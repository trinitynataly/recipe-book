/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
An API route to upload and delete a recipe photo.
*/

// Import the database connection
import dbConnect from '@/lib/mongodb';
// Import the Recipe model
import Recipe from '@/models/Recipe';
// Import the authenticate middleware
import authenticate from '@/middleware/authenticate';
// Import the upload middleware
import upload from '@/middleware/upload';
// Import the fs and s3 modules
import fs from 'fs';
// Import the s3 module
import s3 from '@/lib/aws';
// Import the path module
import path from 'path';

// Set the configuration for the API route
export const config = {
  // Disable body parser to allow parsing multipart/form-data
  api: {
    bodyParser: false
  }
};

/**
 * Handler for the recipe photo upload and delete
 * @param req - The request object
 * @param res - The response object
 * @returns {Promise<*>}
 */
export default async function handler(req, res) {
  // Connect to the MongoDB database
  await dbConnect();
  // Authenticate the user
  await authenticate(req, res);
  // Get the request method
  const {method} = req;
  // Get the recipe ID from the query parameters
  const recipeId = req.query.id;

  try {
    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);
    // Return a 404 error if the recipe is not found
    if (!recipe) {
      return res.status(404).json({success: false, message: 'Recipe not found'});
    }

    // Return a 401 error if the user is not logged in
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    // Return a 403 error if the user is not authorized to update the recipe
    if (!req.user.isAdmin && recipe.authorID.toString() !== req.user.id.toString()) {
      return res.status(403).json({success: false, message: 'Not authorized to update this recipe'});
    }
    // Handle the new photo upload request
    if (method === 'POST') {
      // Use the upload middleware to handle the file upload
      upload.single('photo')(req, res, async (err) => {
        // Return a 400 error if the file upload fails
        if (err) {
          return res.status(500).json({success: false, message: err.message});
        }
        // Get the current timestamp
        const timestamp = Date.now();
        // Get the file extension
        const extension = path.extname(req.file.originalname).toLowerCase();
        // Construct the final file name from the recipe ID, timestamp and extension to ensure file name uniqueness
        const finalFileName = `${recipeId}_${timestamp}${extension}`;
        // Define the final file URL
        let finalFileUrl;

        // Check the storage method is S3
        if (process.env.STORAGE_METHOD === 's3') {
          // Define the final key (path) for the S3 object
          const finalKey = `public/${finalFileName}`;
          // Define the upload parameters
          const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME, // Bucket name
            Key: finalKey, // File name
            Body: req.file.buffer, // Use buffer to upload directly to S3
            ContentType: req.file.mimetype // File type
          };

          // Upload the file to S3
          const uploadResult = await s3.upload(uploadParams).promise();
          // Set the final file URL to the S3 object URL
          finalFileUrl = uploadResult.Location;
        // For local storage, save the file from buffer to the final destination
        } else {
          // Define the final path for the file
          const finalPath = path.join(process.cwd(), 'public', 'uploads', finalFileName);
          // Create the directory if it does not exist
          if (!fs.existsSync(path.dirname(finalPath))) {
            fs.mkdirSync(path.dirname(finalPath), {recursive: true});
          }
          // Write the file from buffer to the final path
          fs.writeFileSync(finalPath, req.file.buffer);
          // Set the final file URL to the local file URL
          finalFileUrl = `/uploads/${finalFileName}`;
        }

        // set the filename to the recipe photo field
        recipe.photo = finalFileName;
        // Save the recipe row
        await recipe.save();
        // Return a success response with the recipe and file URL
        res.status(200).json({success: true, data: recipe, fileUrl: finalFileUrl});
      });
    // Handle the photo delete request
    } else if (method === 'DELETE') {
      // Check if the recipe has a photo
      if (recipe.photo) {
        // Check the storage method is S3
        if (process.env.STORAGE_METHOD === 's3') {
          // Define the delete parameters
          const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME, // Bucket name
            Key: `public/${recipe.photo}` // File key (path)
          };
          // Delete the file from S3
          await s3.deleteObject(deleteParams).promise();
        } else {
          // Define the final path for the file
          const photoPath = path.join(process.cwd(), 'public', 'uploads', recipe.photo);
          // Check if the file exists
          if (fs.existsSync(photoPath)) {
            // Delete the file
            fs.unlinkSync(photoPath);
          }
        }
        // Set the photo field to null
        recipe.photo = null;
        // Save the recipe row
        await recipe.save();
        // Return a success response
        res.status(200).json({success: true, message: 'Photo deleted'});
      } else { // No photo to delete
        // Return a 404 error if the photo is not found
        return res.status(404).json({success: false, message: 'Photo not found'});
      }
    // Handle other request methods
    } else {
      // Set the allowed methods
      res.setHeader('Allow', ['POST', 'DELETE']);
      // Return a 405 error if the method is not allowed
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  // Catch any errors
  } catch (error) {
    // Return a 500 error if there is an error
    res.status(500).json({success: false, message: error.message});
  }
};

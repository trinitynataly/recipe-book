import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import authenticate from '@/middleware/authenticate';
import upload from '@/middleware/upload';
import fs from 'fs';
import s3 from '@/lib/aws';
import path from 'path';

export const config = {
    api: {
        bodyParser: false
    }
};

const handler = async (req, res) => {
    await dbConnect();
    await authenticate(req, res);
    const { method } = req;
    const recipeId = req.query.id;

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        
        if (!req.user.isAdmin && recipe.authorID.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this recipe' }); 
        }
        if (method === 'POST') {
            // Handle file upload
            upload.single('photo')(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err.message });
                }

                const timestamp = Date.now();
                const extension = path.extname(req.file.originalname).toLowerCase();
                const finalFileName = `${recipeId}_${timestamp}${extension}`;
                let finalFileUrl;

                if (process.env.STORAGE_METHOD === 's3') {
                    // Upload the file to S3 with the constructed file name
                    const finalKey = `public/${finalFileName}`;

                    const uploadParams = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: finalKey,
                        Body: req.file.buffer, // Use buffer to upload directly to S3
                        ContentType: req.file.mimetype
                    };

                    const uploadResult = await s3.upload(uploadParams).promise();
                    finalFileUrl = uploadResult.Location;

                } else {
                    // For local storage, save the file from buffer to the final destination
                    const finalPath = path.join(process.cwd(), 'public', 'uploads', finalFileName);

                    if (!fs.existsSync(path.dirname(finalPath))) {
                        fs.mkdirSync(path.dirname(finalPath), { recursive: true });
                    }

                    fs.writeFileSync(finalPath, req.file.buffer);
                    finalFileUrl = `/uploads/${finalFileName}`;
                }

                // Save the filename in the database
                recipe.photo = finalFileName;
                await recipe.save();

                res.status(200).json({ success: true, data: recipe, fileUrl: finalFileUrl });
            });
        } else if (method === 'DELETE') {
            if (recipe.photo) {
                if (process.env.STORAGE_METHOD === 's3') {
                    const deleteParams = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: `public/${recipe.photo}`
                    };

                    await s3.deleteObject(deleteParams).promise();
                } else {
                    const photoPath = path.join(process.cwd(), 'public', 'uploads', recipe.photo);
                    if (fs.existsSync(photoPath)) {
                        fs.unlinkSync(photoPath);
                    }
                }

                recipe.photo = null;
                await recipe.save();

                res.status(200).json({ success: true, message: 'Photo deleted' });
            } else {
                return res.status(404).json({ success: false, message: 'Photo not found' });
            }
        } else {
            res.setHeader('Allow', ['POST', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default handler;

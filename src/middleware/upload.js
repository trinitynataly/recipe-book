/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 2/06/2024
A middleware function to handle file uploads using Multer.
*/

// Import the multer library for file uploads
import multer from 'multer';

// Set up the storage engine for file uploads using memory storage
const storage = multer.memoryStorage();

// Create a multer instance with the storage engine and file filter
const upload = multer({
  storage: storage, // Use the memory storage engine
  fileFilter: function (req, file, cb) { // Set the file filter
    // Set allowed file extensions to JPG, JPEG, and PNG only
    const allowedExtensions = /jpg|jpeg|png/;
    // Get the file extension and convert to lowercase
    const extension = file.originalname.split('.').pop().toLowerCase();
    // Check if the extension is allowed
    if (allowedExtensions.test(extension)) { 
      // Allow the file to be uploaded
      cb(null, true);
    } else {
      // Reject the file upload
      cb(new Error('Only JPG and PNG files are allowed!'), false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

// Export the upload middleware
export default upload;
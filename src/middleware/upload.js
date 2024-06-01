/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 29/05/2024
A middleware function to handle file uploads using Multer.
*/

// Import the multer library for file uploads
import multer from 'multer';
// Import the fs and path libraries for file system operations
import fs from 'fs';
// Import the path library for file path operations
import path from 'path';

// Ensure the temp directory exists in the root of the project
const ensureTempDir = () => {
    // Define the path to the temp directory
    const tempDir = path.join(process.cwd(), 'temp');
    // Check if the temp directory exists
    if (!fs.existsSync(tempDir)) {
        // Create the temp directory if it does not exist
        fs.mkdirSync(tempDir, { recursive: true });
    }
};

// Call the function to ensure the directory is created
ensureTempDir();

// Define storage for the uploaded files
const storage = multer.diskStorage({
    // Set the destination to the temp directory
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'temp')); // Save to temporary folder in the root
    },
    // Set the filename to a unique value
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Save with a temporary name
    }
});

// File filter to accept only JPG and PNG files
const fileFilter = (req, file, cb) => {
    // Define the allowed file extensions
    const allowedExtensions = /jpg|jpeg|png/;
    // Get the file extension of the uploaded file and convert it to lowercase
    const extension = file.originalname.split('.').pop().toLowerCase();
    // Check if the file extension is allowed
    if (allowedExtensions.test(extension)) {
        // If allowed, accept the file
        cb(null, true);
    } else {
        // If not allowed, reject the file
        cb(new Error('Only JPG and PNG files are allowed!'), false);
    }
};

// Configure multer with the defined storage and file filter
const upload = multer({
    storage: storage, // Use the defined storage
    fileFilter: fileFilter, // Use the defined file filter
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

// Export the configured multer upload
export default upload;

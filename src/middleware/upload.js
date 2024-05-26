import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure the temp directory exists in the root of the project
const ensureTempDir = () => {
    const tempDir = path.join(process.cwd(), 'temp');

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
};

// Call the function to ensure the directory is created
ensureTempDir();

// Define storage for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'temp')); // Save to temporary folder in the root
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Save with a temporary name
    }
});

// File filter to accept only JPG and PNG files
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png/;
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (allowedExtensions.test(extension)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG and PNG files are allowed!'), false);
    }
};

// Configure multer with the defined storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

export default upload;

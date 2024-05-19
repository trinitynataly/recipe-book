import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure the uploads and temp directories exist
const ensureUploadsDir = () => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const tempDir = path.join(uploadsDir, 'temp');

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
};

// Call the function to ensure directories are created
ensureUploadsDir();

// Define storage for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads/temp')); // Save to temporary folder first
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

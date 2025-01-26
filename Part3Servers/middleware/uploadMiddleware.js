const multer = require('multer');
const path = require('path');

// Configure the storage options for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'ProfileImages/');
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
    }
});

// Function to filter allowed file types
const fileFilter = (req, file, cb) => {
    
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type. Only image files are allowed!'), false); 
    }
};

// Initialize multer with storage options, file filter, and file size limit
const upload = multer({
    storage: storage,           
    fileFilter: fileFilter,     
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;

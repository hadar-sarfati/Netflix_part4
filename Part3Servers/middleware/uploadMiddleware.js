// Import necessary modules
const multer = require('multer');
const path = require('path');

// Configure the storage options for file upload
const storage = multer.diskStorage({
    // Specify the destination folder for uploaded files
    destination: function (req, file, cb) {
        // Save uploaded files to the 'ProfileImages/' directory
        cb(null, 'ProfileImages/');
    },
    
    // Specify the filename for the uploaded file
    filename: function (req, file, cb) {
        // Generate a unique suffix using current timestamp and a random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Set the filename as the unique suffix followed by the file extension (e.g., .jpg, .png)
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Function to filter allowed file types
const fileFilter = (req, file, cb) => {
    // Define allowed MIME types for file uploads (JPEG, JPG, and PNG)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    // Check if the file type is valid
    if (allowedTypes.includes(file.mimetype)) {
        // Allow the file upload
        cb(null, true);
    } else {
        // Reject the file with an error message if the file type is invalid
        cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'), false);
    }
};

// Initialize multer with storage options, file filter, and file size limit
const upload = multer({
    storage: storage,            // Use the storage configuration
    fileFilter: fileFilter,      // Use the file filter to validate file types
    limits: {
        // Set a limit of 5MB for file uploads
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Export the multer configuration so it can be used in other parts of the app
module.exports = upload;

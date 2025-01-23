const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'PreviewImages/');
        } else if (file.mimetype.startsWith('video/')) {
            cb(null, 'VideoFiles/');
        } else {
            cb(new Error('Invalid file type'), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/mov'];
    const allowedPictureTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedVideoTypes.includes(file.mimetype) || allowedPictureTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP4, AVI, MKV, and MOV files are allowed for movies, and JPEG, JPG and PNG for pictures.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024
    }
});

// Use `fields` to allow uploading both video and preview image
const uploadMovieFiles = upload.fields([
    { name: 'path', maxCount: 1 },  // Video file
    { name: 'previewImage', maxCount: 1 }  // Preview image
]);

module.exports = uploadMovieFiles;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const categories = require('./routes/category');
const users = require('./routes/user');
const tokens = require('./routes/tokens');
const movies = require('./routes/movies');
const upload = require('./routes/upload');
const recommend = require('./routes/recommend');
const recommendSocket = require('./utilities/recommendSocket')
const path = require('path');
const fs = require('fs');
const authMiddleware = require('./middleware/authMiddleware');


require('custom-env').env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require('dotenv').config();

var app = express();
app.disable('etag');

// Serve static files from the 'profileImage' directory

app.use('/profileImage', express.static(path.join(__dirname, 'profileImage')));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/tokens', tokens);
// app.use('/api/movies', authMiddleware, movies);
app.use('/api/movies', movies);
app.use('/api/upload', upload);
app.use('/api/movies', recommend);







app.get('/video', (req, res) => {
  const videoPath = path.join(__dirname, 'public', 'video.mp4');

  // Check if the video file exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }

  const videoSize = fs.statSync(videoPath).size;
  const range = req.headers.range;

  // If no Range header, send the entire file
  if (!range) {
    const head = {
      'Content-Length': videoSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  // Parse Range
  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
  const chunkSize = end - start + 1;

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, headers);
  fs.createReadStream(videoPath, { start, end }).pipe(res);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Range');
  next();
});





// Initialize socket connection to recommendation system
recommendSocket.initializeSocket()
  .then(() => {
    // Start the server once the socket connection is established
    app.listen(process.env.PORT, () => {});
  })
  .catch((err) => {
    process.exit(1); // Exit if the socket cannot be initialized
  });
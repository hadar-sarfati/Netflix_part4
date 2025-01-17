const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const categories = require('./Part3CodeCopy/routes/category');
const users = require('./Part3CodeCopy/routes/user');
const tokens = require('./Part3CodeCopy/routes/tokens');
const movies = require('./Part3CodeCopy/routes/movies');
const upload = require('./Part3CodeCopy/routes/upload');
const recommendSocket = require('./Part3CodeCopy/utilities/recommendSocket');

require('custom-env').env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.disable('etag');

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// API routes
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/tokens', tokens);
app.use('/api/movies', movies);
app.use('/api/upload', upload);

// Static files for React app
app.use(express.static(path.join(__dirname, 'public')));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize socket connection and start server
recommendSocket.initializeSocket()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log('Server is running');
    });
  })
  .catch((err) => {
    console.error('Failed to initialize socket:', err);
    process.exit(1);
  });

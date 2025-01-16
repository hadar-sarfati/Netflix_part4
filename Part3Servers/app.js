const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const categories = require('./routes/category');
const users = require('./routes/user');
const tokens = require('./routes/tokens');
const movies = require('./routes/movies');

const recommend = require('./routes/recommend');
const recommendSocket = require('./utilities/recommendSocket')
const path = require('path');

require('custom-env').env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
app.use('/api/movies', movies);

app.use('/api/movies', recommend);

// Initialize socket connection to recommendation system
recommendSocket.initializeSocket()
  .then(() => {
    // Start the server once the socket connection is established
    app.listen(process.env.PORT, () => {});
  })
  .catch((err) => {
    process.exit(1); // Exit if the socket cannot be initialized
  });
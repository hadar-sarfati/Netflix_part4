const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle all other routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

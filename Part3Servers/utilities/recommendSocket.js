const net = require('net');

let client = null;

function initializeSocket() {
  return new Promise((resolve, reject) => {
    client = new net.Socket();
    
    const host = process.env.MRS_IP;     // Use the environment variable for host
    const port = process.env.MRS_PORT;    // Use the environment variable for port
    
    console.log(`Attempting to connect to recommendation system at ${host}:${port}`);
    
    client.connect(port, host, () => {
      console.log('Successfully connected to recommendation system');
      resolve(client);
    });

    client.on('error', (err) => {
      console.error('Error connecting to the recommendation server:', err);
      reject(err);
    });

    // Add connection closed handler
    client.on('close', () => {
      console.log('Connection to recommendation system closed');
    });
  });
}

module.exports = {
    initializeSocket,
    getClient: () => client
};
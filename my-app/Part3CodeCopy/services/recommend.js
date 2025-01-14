const recommendSocket = require('../utilities/recommendSocket');  // Import the socket manager
const moviesService = require('../services/movies');

function getMovieRecommendations(userID, movieID) {
  return new Promise((resolve, reject) => {
    const client = recommendSocket.getClient();  // Get the established socket client

    if (!client) {
      return reject('Recommendation socket is not connected');
    }

    // Send a request to the recommendation system using the established socket
    const request = `GET ${userID} ${movieID}\n`;

    client.write(request);  // Send the request

    client.on('data', (data) => {
      const response = data.toString().split('\n');  // Dividing the data into lines
      const init_recommendations = response[2].split(' '); // Line 2 is the line of the recs themselves according to RecSystem
      init_recommendations.pop();

      const recommendations = moviesService.convertMovieIdsToMongoIds(init_recommendations);
      resolve(recommendations);  // Resolve the promise with the recommendations
    });

    client.on('error', (err) => {
      // console.error('Error communicating with the recommendation server:', err);
      reject(err);  // Reject the promise in case of an error
    });
  });
}


// Adding a movie to a user that already exists in the recSystem
function recSystemPatch(userID, movieID) {
  return new Promise((resolve, reject) => { 

    const client = recommendSocket.getClient();
    // If there's no client connected - reject
    if (!client) {
      return reject('Recommendation socket is not connected');
    }

    // Template for the post request
    const request = `PATCH ${userID} ${movieID}\n`;

    // Send the request to the recommendation system
    client.write(request);

    // Get the server's response
    client.on('data', (data) => {
      const response = data.toString().trim(); // Clean up the response
      resolve();
    });

    // Handle errors
    client.on('error', (err) => {
      // console.error('Error communicating with the recommendation server:', err);
      reject(err); // Reject the promise in case of an error
    });

  });
}


// Creating a user in the recSystem and adding the movie to him with recSystem post
function recSystemPost(userID, movieID) {
  return new Promise ((resolve, reject) => {
    // Get the connected client
    const client = recommendSocket.getClient();

    // If there's no client connected - reject
    if (!client) {
      return reject('Recommendation socket is not connected');
    }

    // Template for the post request
    const request = `POST ${userID} ${movieID}\n`;

    // Send the request to the recommendation system
    client.write(request);

    // Get the server's response
    client.on('data', (data) => {
      const response = data.toString().trim(); // Clean up the response
      resolve();
    });

    // Handle errors
    client.on('error', (err) => {
      // console.error('Error communicating with the recommendation server:', err);
      reject(err); // Reject the promise in case of an error
    });

  });
}

// This function receives a list of userID's who's watched the movieID and executes DELETE
// in the recommendation system
function recSystemDelete(movieID) {
  return new Promise( async (resolve, reject) => {
    // Get the connected client
    const client = recommendSocket.getClient();

    // If there's no client connected - reject
    if (!client) {
      return reject('Recommendation socket is not connected');
    }

    const movie = await moviesService.getMovieByIntId(movieID);
    await movie.populate('users');
    if (!movie) {
      throw new Error('Movie not found!');
    }

    // For each user who watched the movie which is being deleted, delete the movie from the user in RecSystem
    movie.users.forEach((user) => {

      let userID = user.userId;
      // Delete template, we will be applying this to each user who watched the movie
      const request = `DELETE ${userID} ${movieID}\n`;
      client.write(request);
    });

    client.on('data', (data) => {
      resolve(); // Resolve the promise when the response is received
    });

    // Handle errors
    client.on('error', (err) => {
      // console.error('Error communicating with the recommendation server:', err);
      reject(err); // Reject the promise in case of an error
    });

  })
};


module.exports = {
  getMovieRecommendations,
  recSystemPost,
  recSystemPatch,
  recSystemDelete
};

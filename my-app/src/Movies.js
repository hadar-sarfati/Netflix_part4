import React, { useState, useEffect } from 'react';

function Movies() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const userId = '677b9136c49ee858716e085b'; // Example userId
    fetch('http://localhost:3001/api/movies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId, // Ensure the correct header is passed
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched Categories:', data); // Log the fetched data
        setCategories(data); // Set categories and movies in state
      })
      .catch((error) => console.error('Error fetching movies:', error));
  }, []);

  return (
    <div>
      <h1>Movies List</h1>
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <div key={index}>
            <h2>{category.category}</h2>
            {category.movies.length > 0 ? (
              <ul>
                {category.movies.map((movie) => (
                  <li key={movie._id}>{movie.name}</li>
                ))}
              </ul>
            ) : (
              <p>No movies available in this category.</p>
            )}
          </div>
        ))
      ) : (
        <p>Loading movies...</p>
      )}
    </div>
  );
}

export default Movies;


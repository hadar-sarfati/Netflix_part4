import React, { useState, useEffect } from 'react';
import './Lists.css';

const MovieList = ({ onMovieSelect }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:3000/api/movies', {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const data = await response.json();
                
                // Flatten and remove duplicate movies by _id
                const uniqueMovies = Array.from(
                    new Map(
                        data.flatMap(category => category.movies)
                            .map(movie => [movie._id, movie])
                    ).values()
                );

                setMovies(uniqueMovies);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="list">
            {movies.length > 0 ? (
                movies.map((movie) => (
                    <div
                        key={movie._id}
                        className="card"
                        onClick={() => onMovieSelect(movie)}
                    >
                        <h3>{movie.name}</h3>
                    </div>
                ))
            ) : (
                <p>No movies available.</p>
            )}
        </div>
    );
};

export default MovieList;

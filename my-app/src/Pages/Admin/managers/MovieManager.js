// MovieManager.js
import React, { useState, useEffect } from 'react';
import './Modal.css';

const MovieManager = ({ isOpen, action, movieToEdit, onClose }) => {
    const [movieData, setMovieData] = useState({
        name: '',
        categories: '',
        year: '',
        duration: '',
        cast: '',
        description: '',
        path: '',
        previewImage: ''
    });
    const [path, setPath] = useState('');
    const [message, setMessage] = useState('');
    const [fileName, setFileName] = useState('Choose File'); // New state for file name display
    const [previewImage, setPreviewImage] = useState(null); // New state for file name display
    const [previewImageName, setPreviewImageName] = useState('Choose Image'); // New state for file name display
    const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovieData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("file: ", file);
            if (file.size > 500 * 1024 * 1024) { // 500MB limit
                setMessage('File size too large. Please choose a file under 500MB.');
                e.target.value = ''; // Reset the input
                return;
            }
    
            // Determine if the uploaded file is for video or preview image based on input name
            if (e.target.name === 'path') {
                setPath(file);
                setFileName(file.name);
            } else if (e.target.name === 'previewImage') {
                setPreviewImage(file);
                setPreviewImageName(file.name);
            }
        }    
    };

    const handleSubmit = async (e) => {
        setCurrentTheme(localStorage.getItem('theme') || 'dark');
        e.preventDefault();
        try {
            const submitMovieData = new FormData();
            if (action === 'Delete Movie') {
                submitMovieData.append('_id', movieToEdit._id);
            } else {
                const categoriesArray = movieData.categories.split(',').map(cat => cat.trim());
                Object.keys(movieData).forEach(key => {
                    submitMovieData.append(key, key === 'categories' ? JSON.stringify(categoriesArray) : movieData[key]);
                });
                if (path) {
                    submitMovieData.set('path', path);
                }
                if (previewImage) {
                    submitMovieData.set('previewImage', previewImage);
                }
            }
            
            let url = 'http://localhost:3000/api/movies';
            let meth = action === 'Delete Movie' ? 'DELETE' : (action === 'Edit Movie' ? 'PUT' : 'POST');


            if (movieToEdit && (action === 'Edit Movie' || action === 'Delete Movie')) {
                url += `/${movieToEdit._id}`;
            }

            const token = localStorage.getItem('accessToken');
            const response = await fetch(url, {
                method: meth,
                headers: {
                    'Authorization': `Bearer ${token}`, 
                  },
                body: action === 'Delete Movie' ? null : submitMovieData 
            });

            if (response.ok) {
                setMessage(`${action === 'Delete Movie' ? 'Delete' : (action === 'Edit Movie' ? 'Edit' : 'Add')} Movie successful!`);
                setFileName('Choose File'); // Reset file name after successful submission
                setPreviewImageName('Choose Image'); // Reset file name after successful submission
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || `${action.charAt(0).toUpperCase() + action.slice(1)} Movie failed`);
            }
        } catch (error) {
            setMessage(`An error occurred during ${action === 'Delete Movie' ? 'deleting' : (action === 'Edit Movie' ? 'editing' : 'adding')} movie`);
        }

        onClose();
    };

    // Reset fileName when modal is opened/closed
    useEffect(() => {
        setFileName('Choose File');
        setPreviewImageName('Choose Image');
    }, [isOpen]);

    if (action === 'Delete Movie') {
        return (
            <div className={`modal-overlay theme-${currentTheme}`}>
                <div className={`modal-content theme-${currentTheme}`}>
                    <div className={`admin-container theme-${currentTheme}`}>
                        <div className="admin-header">
                            <h2>Delete Movie</h2>
                        </div>
                        <button onClick={onClose} className="close-button">×</button>
                        <form onSubmit={handleSubmit}>
                            <h3>Are you sure you want to delete this movie?</h3>
                            <button type="submit">Delete</button>
                            {message && (
                                <div className={message.includes('successful') ? 'success-message' : 'error-message'}>
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="admin-container">
                    <div className="admin-header">
                        <h2>{action}</h2>
                    </div>
                    <button onClick={onClose} className="close-button">×</button>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="form-group">
                            <label htmlFor="movieName">Movie Name:</label>
                            <input
                                id="movieName"
                                type="text"
                                name="name"
                                value={movieData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="categories">Categories:</label>
                            <input
                                id="categories"
                                type="text"
                                name="categories"
                                value={movieData.categories}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="year">Release Year:</label>
                            <input
                                id="year"
                                type="number"
                                name="year"
                                value={movieData.year}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="duration">Duration:</label>
                            <input
                                id="duration"
                                type="text"
                                name="duration"
                                value={movieData.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cast">Cast:</label>
                            <input
                                id="cast"
                                type="text"
                                name="cast"
                                value={movieData.cast}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input
                                id="description"
                                type="text"
                                name="description"
                                value={movieData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="path">Upload Video:</label>
                            <div className="file-input-wrapper">
                                <input
                                    id="path"
                                    type="file"
                                    name="path"
                                    onChange={handleFileChange}
                                    className="hidden-file-input"
                                />
                                <span className="file-name-display">{fileName}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="previewImage">Upload Preview Image:</label>
                            <div className="file-input-wrapper">
                                <input
                                    id="previewImage"
                                    type="file"
                                    name="previewImage"
                                    onChange={handleFileChange}
                                    className="hidden-file-input"
                                />
                                <span className="file-name-display">{previewImageName}</span>
                            </div>
                        </div>

                        <button type="submit">Enter</button>
                        
                    </form>
                    {message && (
                        <div className={message.includes('successful') ? 'success-message' : 'error-message'}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieManager;
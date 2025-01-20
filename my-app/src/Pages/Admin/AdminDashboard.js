import React, { useState, useEffect } from 'react';
import MovieManager from './managers/MovieManager';
import CategoryManager from './managers/CategoryManager';
import MovieList from './managers/MovieList';  // Import MovieList
import MoviesByCategory from '../Main/MoviesByCategory/MoviesByCategory';  // Import MoviesByCategory
import './AdminDashboard.css';

const AdminDashboard = () => {
    // Add state for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [showMovieList, setShowMovieList] = useState(false);  // Add this state
    const [selectedMovie, setSelectedMovie] = useState(null);    // Add this state
    useEffect(() => {
        if (selectedMovie && modalAction === 'editMovie') {
            setIsModalOpen(true);
        }
    }, [selectedMovie, modalAction]);

    // Add openModal function
    const openModal = (action) => {
        setModalAction(action);
        if (action === 'editMovie' || action === 'deleteMovie') {
            setShowMovieList(true);
            setModalType('movie');
        } else {
            setIsModalOpen(true);
            setModalType('movie');
        }
    };

    // Add closeModal function
    const closeModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
        setShowMovieList(false);  // Hide movie list when closing modal
        setSelectedMovie(null);   // Reset selected movie
    };

    // Add this function to handle movie selection
    const handleMovieSelect = (movie) => {
        console.log('action:', modalAction);
        console.log("modal type:", modalType);
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard:</h1>
            
            <div className="admin-sections">
                <div className="section">
                    <h2>Movie Management</h2>
                    <div className="action-buttons">
                        <button onClick={() => openModal('addMovie')}>Add Movie</button>
                        <button onClick={() => openModal('editMovie')}>Edit Movie</button>
                        <button onClick={() => openModal('deleteMovie')}>Delete Movie</button>
                    </div>
                </div>

                <div className="section">
                    <h2>Category Management</h2>
                    <div className="action-buttons">
                        <button onClick={() => openModal('addCategory')}>Add Category</button>
                        <button onClick={() => openModal('editCategory')}>Edit Category</button>
                        <button onClick={() => openModal('deleteCategory')}>Delete Category</button>
                    </div>
                </div>
            </div>

            {showMovieList && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeModal} className="close-button">×</button>
                        <MovieList onMovieSelect={handleMovieSelect} />
                    </div>
                </div>
            )}

            {isModalOpen && modalType === 'movie' && (
                <MovieManager 
                    isOpen={isModalOpen}
                    action={modalAction}
                    movieToEdit={selectedMovie}
                    onClose={closeModal}
                />
            )}

            {isModalOpen && modalType === 'category' && (
                <CategoryManager 
                    isOpen={isModalOpen}
                    action={modalAction}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
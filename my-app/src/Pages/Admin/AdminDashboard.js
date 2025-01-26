import React, { useState, useEffect } from 'react';
import MovieManager from './managers/MovieManager';
import CategoryManager from './managers/CategoryManager';
import MovieList from './managers/MovieList';  // Import MovieList
import CategoryList from './managers/CategoryList';  // Import MovieList
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);              // State to manage modal visibility
    const [modalAction, setModalAction] = useState(null);               // State to manage modal action
    const [modalType, setModalType] = useState(null);                   // State to manage modal type
    const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [showMovieList, setShowMovieList] = useState(false);          // Add this state
    const [selectedMovie, setSelectedMovie] = useState(null);           // Add this state
    const [showCategoryList, setShowCategoryList] = useState(false);    // Add this state
    const [selectedCategory, setSelectedCategory] = useState(null);     // Add this state

    useEffect(() => {
        if (selectedMovie && modalAction === 'Edit Movie') {
            setIsModalOpen(true);
        } 
    }, [selectedMovie, modalAction]);

    useEffect(() => {
        if (selectedCategory && modalAction === 'Edit Category') {
            setIsModalOpen(true);
        }
    }, [selectedCategory, modalAction]);


    const openModal = (action) => {
        setCurrentTheme(localStorage.getItem('theme') || 'dark');
        setModalAction(action);
        if (action === 'Add Movie' || action === 'Edit Movie' || action === 'Delete Movie') {
            setModalType('movie');
            if (action === 'Edit Movie' || action === 'Delete Movie') {
                setShowMovieList(true);
            } else {
                setIsModalOpen(true);
            }
        } else {
            setModalType('category');
            if (action === 'Edit Category' || action === 'Delete Category') {
                setShowCategoryList(true);
            } else {
                setIsModalOpen(true);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
        if (showMovieList) {
            setShowMovieList(false);  // Hide movie list when closing modal
            setSelectedMovie(null);   // Reset selected movie
        } else if (showCategoryList) {
            setShowCategoryList(false);  // Hide category list when closing modal
            setSelectedCategory(null);   // Reset selected category
        }        
    };

    // Function to handle movie selection
    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    }

    return (
        <div className={`admin-dashboard theme-${currentTheme}`}>
            <h1>Hey, Big Boss! What action shall we take today?</h1>
            
            <div className="admin-sections">
                <div className="section">
                    <h2>Movie Management</h2>
                    <div className="action-buttons">
                        <button onClick={() => openModal('Add Movie')}>Add Movie</button>
                        <button onClick={() => openModal('Edit Movie')}>Edit Movie</button>
                        <button onClick={() => openModal('Delete Movie')}>Delete Movie</button>
                    </div>
                </div>

                <div className="section">
                    <h2>Category Management</h2>
                    <div className="action-buttons">
                        <button onClick={() => openModal('Add Category')}>Add Category</button>
                        <button onClick={() => openModal('Edit Category')}>Edit Category</button>
                        <button onClick={() => openModal('Delete Category')}>Delete Category</button>
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

            {showCategoryList && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeModal} className="close-button">×</button>
                        <CategoryList onCategorySelect={handleCategorySelect} />
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
                    categoryToEdit={selectedCategory}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
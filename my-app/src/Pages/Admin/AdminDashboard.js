import React, { useState, useEffect } from 'react';
import MovieManager from './managers/MovieManager';
import CategoryManager from './managers/CategoryManager';
import MovieList from './managers/MovieList';  // Import MovieList
import CategoryList from './managers/CategoryList';  // Import MovieList
import './AdminDashboard.css';

//TODO: add new movie to fantasy category AND other category, then delete fantsy category - i want to see that the
// harry3 is still in the comedy category and the fantasy category is deleted with harry2 that is only in it.
// Also edit the one of the categories, and add a brand new category.

const AdminDashboard = () => {
    // Add state for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [showMovieList, setShowMovieList] = useState(false);  // Add this state
    const [selectedMovie, setSelectedMovie] = useState(null);    // Add this state
    const [showCategoryList, setShowCategoryList] = useState(false);  // Add this state
    const [selectedCategory, setSelectedCategory] = useState(null);    // Add this state

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


    // Add openModal function
    const openModal = (action) => {
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

    // Add closeModal function
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

    // Add this function to handle movie selection
    const handleMovieSelect = (movie) => {
        console.log('action:', modalAction);
        console.log("modal type:", modalType);
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    }

    return (
        <div className="admin-dashboard">
            <h1>Welcome Admin</h1>
            
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
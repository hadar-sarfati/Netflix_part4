import React, { useState } from 'react';
import MovieManager from './managers/MovieManager';
import CategoryManager from './managers/CategoryManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
    // Add state for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalType, setModalType] = useState(null);

    // Add openModal function
    const openModal = (action) => {
        setModalAction(action);
        setIsModalOpen(true);
        setModalType(action.includes('Movie') ? 'movie' : 'category');
    };

    // Add closeModal function
    const closeModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            <div className="admin-sections">
                <div className="section">
                    <h2>Movie Management</h2>
                    <div className="action-buttons">
                        <button onClick={() => {openModal('addMovie')}}>Add Movie</button>
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

            {isModalOpen && modalType === 'movie' && (
                <MovieManager 
                    isOpen={isModalOpen}
                    action={modalAction}
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
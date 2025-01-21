// CategoryManager.js
import React, { useState } from 'react';
import './Modal.css';

const CategoryManager = ({ isOpen, action, categoryToEdit, onClose }) => {
    const [categoryData, setCategoryData] = useState({
        name: '',
        promoted: false
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setCategoryData(prevState => ({
          ...prevState,
          [name]: type === 'checkbox' ? checked : value // Handle checkboxes correctly
      }));
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {            
            let url = 'http://localhost:3000/api/categories';
            let meth = action === 'Delete Category' ? 'DELETE' : (action === 'Edit Category' ? 'PATCH' : 'POST');

            if (categoryToEdit && (action === 'Edit Category' || action === 'Delete Category')) {
                url += `/${categoryToEdit._id}`;
                console.log('url:', url);
                console.log('meth:', meth);
                console.log('categoryToEdit name:', categoryToEdit.name);
                console.log('categoryToEdit id:', categoryToEdit._id);
                console.log('categoryData name:', categoryData.name);
                console.log('categoryData promoted:', categoryData.promoted);
            }

            const token = localStorage.getItem('accessToken');
            const response = await fetch(url, {
                method: meth,
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                  },
                body: action === 'Delete Category' ? null : JSON.stringify(categoryData)
            });

            if (response.ok) {
                setMessage(`${action === 'Delete Category' ? 'Delete' : (action === 'Edit Category' ? 'Edit' : 'Add')} Category successful!`);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || `${action.charAt(0).toUpperCase() + action.slice(1)} Movie failed`);
            }
        } catch (error) {
            setMessage(`An error occurred during ${action === 'Delete Category' ? 'deleting' : (action === 'Edit Category' ? 'editing' : 'adding')} category`);
        }

        onClose();
    };

    if (action === 'Delete Category') {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="admin-container">
                        <div className="admin-header">
                            <h2>Delete Category</h2>
                        </div>
                        <button onClick={onClose} className="close-button">×</button>
                        <form onSubmit={handleSubmit}>
                            <h3>Are you sure you want to delete this category?</h3>
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
                            <label htmlFor="name">Category Name:</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={categoryData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="promoted">Promoted:</label>
                            <input
                                id="promoted"
                                type="boolean"
                                name="promoted"
                                value={categoryData.promoted}
                                onChange={handleChange}
                                required
                            />
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

export default CategoryManager;
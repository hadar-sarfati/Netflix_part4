// CategoryManager.js
import React, { useState, useEffect } from 'react';
import './Modal.css';

const CategoryManager = ({ isOpen, action, onClose }) => {
    const [categoryData, setCategoryData] = useState({
        name: '',
        promoted: false
    });
    
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (action === 'addCategory') {
                try {
                  const token = localStorage.getItem('accessToken');
                    const response = await fetch('http://localhost:3000/api/categories', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`, 
                      },
                      body: JSON.stringify(categoryData)
                    });
              
                    if (response.status === 201) {
                      setMessage('Added successful!');
                    } else {
                      const errorData = await response.json();
                      setMessage(errorData.error || 'Adding failed');
                    }
                  } catch (error) {
                    setMessage('An error occurred during adding');
                  }
            }
            else if (action === 'editCategory') {
                try {
                  const token = localStorage.getItem('accessToken');
                    const response = await fetch('http://localhost:3000/api/categories', {
                      method: 'PATCH',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(categoryData)
                    });
              
                    if (response.status === 201) {
                      setMessage('Update successful!');
                    } else {
                      const errorData = await response.json();
                      setMessage(errorData.error || 'Update failed');
                    }
                  } catch (error) {
                    setMessage('An error occurred during updating');
                  }
            }
            else if (action === 'deleteCategory') {
                try {
                  const token = localStorage.getItem('accessToken');
                    const response = await fetch('http://localhost:3000/api/categories', {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(categoryData)
                    });
              
                    if (response.status === 201) {
                      setMessage('Deleted successfully!');
                    } else {
                      const errorData = await response.json();
                      setMessage(errorData.error || 'Failed to delete');
                    }
                  } catch (error) {
                    setMessage('An error occurred during deletion');
                  }
            }

            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    // ... rest of your component code for rendering
};

export default CategoryManager;
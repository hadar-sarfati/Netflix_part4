import React, { useState, useEffect } from 'react';
import './Lists.css';

const CategoryList = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:3000/api/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await response.json();

                setCategories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="list">
            {categories.length > 0 ? (
                categories.map((category) => (
                    <div
                        key={category._id}
                        className="card"
                        onClick={() => onCategorySelect(category)}
                    >
                        <h3>{category.name}</h3>
                    </div>
                ))
            ) : (
                <p>No Categories available.</p>
            )}
        </div>
    );
};

export default CategoryList;

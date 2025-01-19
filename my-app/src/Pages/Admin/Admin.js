// pages/AdminPage.js
import React from 'react';
import AdminDashboard from './AdminDashboard';
import MovieManager from './managers/MovieManager';

const Admin = () => {
    console.log('Admin page');
    return (
        <div className="admin-page">
            <h1>Admin Panel</h1>
            <MovieManager />
        </div>
    );
};

export default Admin;
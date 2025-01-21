// pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import MovieManager from './managers/MovieManager';
import fetchLoginUser from "../Login/fetchLoginUser";
import { useNavigate } from 'react-router-dom';


const Admin = () => {
    // State for storing user data
  const [user, setUser] = useState(null);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // If not logged in, navigate to the login page
      navigate('/Login');
    } else {
      // Fetch login user details using the token
      fetchLoginUser(token, setUser)
        .catch((error) => {
          console.error('Error fetching user details:', error);
          // If there's an error, remove the token and navigate to login
          localStorage.removeItem('accessToken');
          navigate('/Login');
        });
    }
  }, [navigate]);

    console.log('Admin page');
    return (
        <div className="admin-page">
            <h1>Admin Panel</h1>
            <AdminDashboard />
        </div>
    );
};

export default Admin;
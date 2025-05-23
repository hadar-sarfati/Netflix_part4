import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard'; // Component for the admin dashboard UI.
import fetchLoginUser from "../Login/fetchLoginUser"; // Function to fetch user data based on the token.
import { useNavigate } from 'react-router-dom'; // Hook for navigation between routes.
import './Admin.css'; // Styles for the admin page.
import TopMenu from '../Main/TopMenu/TopMenu'; // Import TopMenu component.

const Admin = () => {
  const [user, setUser] = useState(null); // State to store the logged-in user data.
  const [isLoading, setIsLoading] = useState(true); // State to track loading status.
  const [error, setError] = useState(null); // State to handle error messages.
  const [currentTheme, setCurrentTheme] = useState('dark'); // State for theme (light/dark).
  const navigate = useNavigate(); // Hook for programmatically navigating between pages.

  useEffect(() => {
    // Function to check authentication and fetch user details.
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken'); // Retrieve the access token from local storage.
      if (!token) {
        navigate('/Login'); // Redirect to the login page if no token is found.
        return;
      }

      try {
        // Fetch user details using the token.
        await fetchLoginUser(token, (userData) => {
          // Validate user data and check if the user has admin privileges.
          if (!userData || !userData.admin) {
            setError('404 - Page Not Found'); // Set an error message if the user is not an admin.
            setIsLoading(false); // Stop the loading state.
          } else {
            setUser(userData); // Update the user state with the fetched data.
            setIsLoading(false); // Stop the loading state.
          }
        });
      } catch (error) {
        console.error('Error fetching user details:', error); // Log any errors during the fetch.
        localStorage.removeItem('accessToken'); // Remove the invalid token from local storage.
        navigate('/Login'); // Redirect to the login page.
      }
    };

    checkAuth(); // Call the authentication check function on component mount.
  }, [navigate]); // Dependency array ensures the effect runs when `navigate` changes.

  // Render a loading message while the user data is being fetched.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render an error page if there is an issue with authentication or the user lacks permissions.
  if (error) {
    return (
      <div className="error-page">
        <h1>{error}</h1> {/* Display the error message. */}
        <p>The page you are looking for does not exist or you don't have permission to access it.</p>
        <button onClick={() => navigate('/main')}>Return to Home</button> {/* Button to navigate to the home page. */}
      </div>
    );
  }

  // Toggle theme function
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Render the admin panel with the top menu included.
  return (
    <div className="admin-page">
      <TopMenu
        onLogout={() => { localStorage.removeItem('accessToken'); navigate('/Login'); }}
        toggleTheme={toggleTheme}
        currentTheme={currentTheme}
        user={user}
      />
      
      <AdminDashboard /> {/* Admin dashboard component. */}
    </div>
  );
};

export default Admin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate(); // React Router hook to navigate to another page
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  }); // State to hold form field values
  const [profileImage, setProfileImage] = useState(null); // State to hold the profile image file
  const [message, setMessage] = useState(''); // State to hold success/error messages
  const [isSuccess, setIsSuccess] = useState(false); // State to track registration success

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle profile image selection and validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file size is within the limit (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size too large. Please choose a file under 5MB.');
        e.target.value = ''; // Reset the input field
        return;
      }
      // Check if the file type is an acceptable image format
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setMessage('Invalid file type. Please choose a JPEG, JPG or PNG file.');
        e.target.value = ''; // Reset the input field
        return;
      }
      setProfileImage(file); // Set the profile image if valid
      setMessage(''); // Clear error messages if valid
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const submitFormData = new FormData(); // Create a FormData object to submit the form

      // Append all form fields to the FormData
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });

      // Append profile image if selected
      if (profileImage) {
        submitFormData.append('profileImage', profileImage);
      }

      // Send a POST request to register the user
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        body: submitFormData
      });

      if (response.status === 201) {
        setMessage('Registration successful!'); // Success message
        setIsSuccess(true); // Set success state
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Registration failed'); // Error message
        setIsSuccess(false); // Set failure state
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('An error occurred during registration'); // General error message
      setIsSuccess(false); // Set failure state
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Username input */}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email input */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password input */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* First name input */}
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Last name input */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Profile image input */}
        <div className="form-group">
          <label htmlFor="profileImage">Profile Image:</label>
          <input
            id="profileImage"
            type="file"
            name="profileImage"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/jpg"
          />
          <small>Max file size: 5MB. Accepted formats: JPEG, JPG, PNG</small>
        </div>

        {/* Submit button */}
        <button type="submit" className="button">Register</button>
      </form>

      {/* Message display */}
      {message && (
        <div className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}

      {/* Show the login button after successful registration */}
      {isSuccess && (
        <button
          className="button login-button"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      )}
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('File size too large. Please choose a file under 5MB.');
        e.target.value = ''; // Reset the input
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setMessage('Invalid file type. Please choose a JPEG, JPG or PNG file.');
        e.target.value = ''; // Reset the input
        return;
      }
      setProfileImage(file);
      setMessage(''); // Clear any error messages
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitFormData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });
      
      // Add profile image if selected
      if (profileImage) {
        submitFormData.append('profileImage', profileImage);
      }

      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        body: submitFormData
      });

      if (response.status === 201) {
        setMessage('Registration successful!');
        // Optional: Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('An error occurred during registration');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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

        <button type="submit" className="button">Register</button>
      </form>
      
      {message && (
        <div className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Register;
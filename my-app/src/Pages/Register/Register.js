import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate(); // React Router hook for navigation
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  }); // State to store form field values
  const [profileImage, setProfileImage] = useState(null); // State to store selected profile image
  const [message, setMessage] = useState(''); // State for error/success messages
  const [isSuccess, setIsSuccess] = useState(false); // State for tracking success of registration

  // Handle changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value // Update formData state for the specific field
    }));
  };

  // Handle profile image selection and validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file size is too large (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size too large. Please choose a file under 5MB.');
        e.target.value = ''; // Reset file input
        return;
      }
      // Check if the file type is valid (JPEG, JPG, PNG)
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setMessage('Invalid file type. Please choose a JPEG, JPG, or PNG file.');
        e.target.value = ''; // Reset file input
        return;
      }
      setProfileImage(file); // Set the selected profile image
      setMessage(''); // Clear error message
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!hasLetters || !hasNumbers) {
      return 'Password must contain both letters and numbers.';
    }
    return ''; // If password is valid, return an empty string
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate password
    // const passwordValidationMessage = validatePassword(formData.password);
    // if (passwordValidationMessage) {
    //   setMessage(passwordValidationMessage); // Show validation error message
    //   setIsSuccess(false); // Set failure flag
    //   return; // Stop form submission if password is invalid
    // }

    try {
      const submitFormData = new FormData(); // Create FormData object for submitting the form

      // Append all form data fields to FormData object
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });

      // Append profile image if selected
      if (profileImage) {
        submitFormData.append('profileImage', profileImage);
      }

      // Send POST request to backend API to register user
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        body: submitFormData,
      });

      // Check for successful response (201 created)
      if (response.status === 201) {
        setMessage('Registration successful!'); // Success message
        setIsSuccess(true); // Set success flag
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Registration failed'); // Show error message
        setIsSuccess(false); // Set failure flag
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('An error occurred during registration'); // General error message
      setIsSuccess(false); // Set failure flag
    }
  };

  return (
    <div className="register-container">
      <h2>Start your journey with us, it’s only a click away!</h2>
      {/* Instruction message to guide users */}
      <p className="instruction-message">Please fill in all the fields below to create your account.</p>
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
          <small>Max file size: 5MB.</small>
        </div>

        {/* Submit button */}
        <button type="submit" className="button">Sign Up!</button>
      </form>

      {/* Display success or error messages */}
      {message && (
        <div className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}

      {/* Button to navigate to login page after successful registration */}
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

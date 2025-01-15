import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: username, // השם שהוזן על ידי המשתמש
      email: 'itayshay8@example.com', // דוא"ל קבוע
      password: 'securePass456', // סיסמה קבועה
      firstName: 'itay', // שם פרטי קבוע
      lastName: 'Shay', // שם משפחה קבוע
      profileImage: 'profile1.png' // תמונת פרופיל קבועה
    };

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // סוג התוכן
        },
        body: JSON.stringify(formData) // המרת המידע ל-JSON
      });

      if (response.status === 201) {
        setMessage('Registration successful!');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Registration failed');
      }
    } catch (error) {
      setMessage('An error occurred during registration');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      {message && (
        <div className={message.includes('successful') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Register;

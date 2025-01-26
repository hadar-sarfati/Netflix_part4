import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const requestData = {
                username: username,
                password: password,
            };

            const response = await fetch('http://localhost:3000/api/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setError('Incorrect username or password. Please try again.');
                } else {
                    setError('An error occurred during login. Please try again later.');
                }
                return;
            }

            const responseData = await response.json();
            localStorage.setItem('accessToken', responseData.token);
            navigate('/Main');
        } catch (error) {
            console.error('Login failed:', error);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1 className="login-heading">Welcome Back!</h1>
                <p className="login-subheading">Ready to dive back into the action?</p>

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                
                <button type="submit" className="login-button">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;

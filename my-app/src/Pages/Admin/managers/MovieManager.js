// // MovieManager.js
// import React, { useState } from 'react';
// import './Modal.css';

// const MovieManager = ({ isOpen, action, onClose }) => {
//     console.log('MovieManager rendered with isOpen:', isOpen);
//     const [movieData, setMovieData] = useState({
//         name: '',
//         categories: '',
//         year: '',
//         duration: '',
//         cast: '',
//         description: '',
//         path: ''
//     });
//     const [path, setPath] = useState(null);
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setMovieData(prevState => ({
//           ...prevState,
//           [name]: value
//         }));
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 500 * 1024 * 1024) { // 500MB limit
//                 setMessage('File size too large. Please choose a file under 500MB.');
//                 e.target.value = ''; // Reset the input
//                 return;
//             }
//             setPath(file);
//             setMessage(''); // Clear any error messages
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log('Form submitted'); // Debug log to check if function is triggered
//         try {
//             const submitMovieData = new FormData();
            
//             // Add all form fields to FormData
//             Object.keys(movieData).forEach(key => {
//                 submitMovieData.append(key, movieData[key]);
//             });
//             // Add path if selected
//             if (path) {
//                 submitMovieData.set('path', path);
//             }
//             //console.log('Data to submit:', submitMovieData); // Debug log to inspect the FormData object
//             for (let [key, value] of submitMovieData.entries()) {
//                 console.log(key, value);
//             }
//             let meth = 'POST';

//             if (action === 'editMovie') {
//                 meth = 'PATCH';
//             } else if (action === 'deleteMovie') {
//                 meth = 'DELETE';
//             }

//             const response = await fetch('http://localhost:3000/api/movies', {
//                 method: 'POST',
//                 headers: {
//                     // 'Content-Type': 'application/json',
//                     'X-User-Id': '678a3e123688b3f70e75ef34'
//                 },
//                 body: submitMovieData
//             });

//             if (response.ok) {
//                 setMessage(`${action} successful!`);
//             } else {
//                 const errorData = await response.json();
//                 setMessage(errorData.error || `${action} failed`);
//             }
//         } catch (error) {
//             setMessage(`An error occurred during ${action}`);
//         }

//         onClose();
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="admin-container">
//                     <h2>{action}</h2>
//                     <button onClick={onClose} className="close-button">×</button>
//                     <form onSubmit={handleSubmit} encType="multipart/form-data">
//                         <div className="form-group">
//                             <label htmlFor="movieName">Movie Name:</label>
//                             <input
//                                 id="movieName"
//                                 type="text"
//                                 name="name"
//                                 value={movieData.name}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="categories">Categories:</label>
//                             <input
//                                 id="categories"
//                                 type="text"
//                                 name="categories"
//                                 value={movieData.categories}
//                                 onChange={handleChange}
//                                 //required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="year">Release Year:</label>
//                             <input
//                                 id="year"
//                                 type="number"
//                                 name="year"
//                                 value={movieData.year}
//                                 onChange={handleChange}
//                                 //required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="duration">Duration:</label>
//                             <input
//                                 id="duration"
//                                 type="text"
//                                 name="duration"
//                                 value={movieData.duration}
//                                 onChange={handleChange}
//                                 //required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="cast">Cast:</label>
//                             <input
//                                 id="cast"
//                                 type="text"
//                                 name="cast"
//                                 value={movieData.cast}
//                                 onChange={handleChange}
//                                 //required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="description">Description:</label>
//                             <input
//                                 id="description"
//                                 type="text"
//                                 name="description"
//                                 value={movieData.description}
//                                 onChange={handleChange}
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label htmlFor="path">File:</label>
//                             <input
//                                 id="path"
//                                 type="file"
//                                 name="path"
//                                 value={movieData.path}
//                                 onChange={handleFileChange}
//                                 placeholder="Enter movie path"
//                             />
//                         </div>

//                         <button type="submit">Enter</button>
                        
//                     </form>
//                     {message && (
//                         <div className={message.includes('successful') ? 'success-message' : 'error-message'}>
//                             {message}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MovieManager;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css'
const MovieManager = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: ''
  });
//   const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
//         setMessage('File size too large. Please choose a file under 5MB.');
//         e.target.value = ''; // Reset the input
//         return;
//       }
//       if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
//         setMessage('Invalid file type. Please choose a JPEG, JPG or PNG file.');
//         e.target.value = ''; // Reset the input
//         return;
//       }
//       setProfileImage(file);
//       setMessage(''); // Clear any error messages
//     }
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitFormData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });
      
      // Add profile image if selected
    //   if (profileImage) {
    //     submitFormData.append('profileImage', profileImage);
    //   }
  
      const response = await fetch('http://localhost:3000/api/movies', {
        method: 'POST',
        body: submitFormData
      });
  
      if (response.status === 201) {
        setMessage('Registration successful!');
        // נשארים באותו עמוד ולא עושים כלום מעבר להצגת ההודעה
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
    <div className="moviemanager-container">
      <h2>MovieManager</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="name">name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="form-group">
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
        </div> */}

        <button type="submit" className="button">Enter</button>
      </form>
      
      {message && (
        <div className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default MovieManager;
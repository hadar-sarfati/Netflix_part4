import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // בדיקה אם יש טוקן בלוקל סטורג'
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    if (!isAuthenticated) {
        // אם אין טוקן, מעביר ללוגין
        return <Navigate to="/login" replace />;
    }

    // אם יש טוקן, מציג את הקומפוננטה המבוקשת
    return children;
};

export default ProtectedRoute;
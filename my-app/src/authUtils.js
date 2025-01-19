// ייבוא ספריות ופקדים
import { jwtDecode } from 'jwt-decode'; // ייבוא jwtDecode לראש הקובץ

// פונקציה להוספת הטוקן לכל בקשה
export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // אם הטוקן לא תקף, נעביר למסך התחברות
        localStorage.removeItem('token');
        window.location.href = '/Login';
        throw new Error('Session expired');
    }

    return response;
};

// פונקציה לבדיקה אם המשתמש מחובר
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// פונקציה לקבלת מידע המשתמש מהטוקן
export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const decoded = jwtDecode(token); // שימוש בפונקציה jwtDecode
        return decoded;
    } catch (error) {
        return null;
    }
};
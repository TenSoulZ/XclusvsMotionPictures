import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                // Verify token with backend
                await api.get('/me/');
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Token verification failed:", error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, [location]);

    if (isAuthenticated === null) {
        // Show loader while verifying
        return <Loader fullPage />;
    }

    return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;

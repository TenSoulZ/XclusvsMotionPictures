import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);
        
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
       setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <FaCheckCircle className="me-2" />;
            case 'error': return <FaExclamationCircle className="me-2" />;
            case 'warning': return <FaExclamationTriangle className="me-2" />;
            case 'info': return <FaInfoCircle className="me-2" />;
            default: return null;
        }
    };

    const getBg = (type) => {
        switch (type) {
            case 'success': return 'success';
            case 'error': return 'danger';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'dark';
        }
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info, addToast }}>
            {children}
            <ToastContainer 
                position="top-end" 
                className="p-3" 
                style={{ position: 'fixed', zIndex: 9999 }}
            >
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        onClose={() => removeToast(toast.id)}
                        bg={getBg(toast.type)}
                        autohide={toast.duration > 0}
                        delay={toast.duration}
                        className="glass-card"
                    >
                        <Toast.Header className="bg-dark text-white border-0">
                            {getIcon(toast.type)}
                            <strong className="me-auto text-capitalize">{toast.type}</strong>
                        </Toast.Header>
                        <Toast.Body className={`text-white ${toast.type === 'warning' ? 'text-dark' : ''}`}>
                            {toast.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

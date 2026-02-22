import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import logoOrange from '../assets/logos/xmp-logo-orange.png';
import { FaUser, FaLock, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';

/**
 * Login component - Provides the administrative login interface.
 * Handles token-based authentication and redirects to the dashboard.
 */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify if the token is valid by making a lightweight request to the user endpoint
                    // If this fails with 401/403, api interceptor or catch block will handle it
                    await api.get('/me/');
                    navigate('/admin');
                } catch (error) {
                    console.error("Session verification failed:", error);
                    // Token is invalid, remove it so user can login again
                    localStorage.removeItem('token');
                }
            }
        };
        
        verifySession();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const res = await api.post('/api-token-auth/', { username, password });
            
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                toast.success('Login successful! Welcome back.');
                navigate('/admin');
            } else {
                throw new Error('No token received');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 400) {
                setError('Invalid credentials. Please check your username and password.');
            } else if (err.code === 'ERR_NETWORK') {
                setError('Network error. Please check your connection.');
            } else {
                setError('An error occurred during login. Please try again.');
            }
            toast.error('Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100" style={{ position: 'relative', zIndex: 10 }}>
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={5} xl={4}>
                    <div className="glass-card p-5 text-center shadow-lg border-0" style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(15, 15, 15, 0.85)' }}>
                        <div className="mb-5 position-relative d-inline-block">
                            <div className="position-absolute top-50 start-50 translate-middle bg-orange opacity-25 rounded-circle" style={{ width: '80px', height: '80px', filter: 'blur(20px)' }}></div>
                            <img 
                                src={logoOrange} 
                                alt="XMP Logo" 
                                width="100" 
                                className="position-relative"
                                style={{ dropShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
                            />
                        </div>
                        
                        <h2 className="text-white mb-1 fw-bold spacing-3">ADMIN ACCESS</h2>
                        <p className="text-secondary small mb-4">Enter your credentials to continue</p>
                        
                        {error && (
                            <Alert variant="danger" className="text-start small py-2 border-0 bg-danger bg-opacity-25 text-white">
                                <FaSignInAlt className="me-2" /> {error}
                            </Alert>
                        )}
                        
                        <Form onSubmit={handleLogin} className="text-start mt-4">
                            <Form.Group className="mb-4 position-relative">
                                <Form.Label className="text-orange small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Username</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark border-secondary text-secondary"><FaUser /></span>
                                    <Form.Control 
                                        type="text" 
                                        className="bg-dark text-white border-secondary py-2"
                                        placeholder="Enter username"
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        disabled={isLoading}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-5 position-relative">
                                <Form.Label className="text-orange small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Password</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark border-secondary text-secondary"><FaLock /></span>
                                    <Form.Control 
                                        type="password" 
                                        className="bg-dark text-white border-secondary py-2"
                                        placeholder="Enter password"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        disabled={isLoading}
                                    />
                                </div>
                            </Form.Group>
                            
                            <Button 
                                variant="brand" 
                                type="submit" 
                                className="w-100 py-3 rounded-pill fw-bold text-uppercase spacing-2 shadow-lg"
                                disabled={isLoading}
                                style={{ transition: 'all 0.3s ease' }}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        Authenticating...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </Form>
                        
                        <div className="mt-4 pt-3 border-top border-secondary border-opacity-10">
                            <div className="mb-3">
                                <Link to="/" className="text-secondary text-decoration-none small d-inline-flex align-items-center opacity-75 hover-opacity-100 transition-all">
                                    <FaArrowLeft className="me-2" /> Back to Website
                                </Link>
                            </div>
                            <p className="text-secondary x-small mb-0 opacity-50">
                                Protected Area. Authorized Personnel Only.
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

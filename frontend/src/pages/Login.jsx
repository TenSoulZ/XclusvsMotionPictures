import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import logoOrange from '../assets/logos/xmp-logo-orange.png';

/**
 * Login component - Provides the administrative login interface.
 * Handles token-based authentication and redirects to the dashboard.
 */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api-token-auth/', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError('Invalid credentials');
            console.error(err);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-black">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <div className="glass-card p-5 text-center">
                        <img 
                            src={logoOrange} 
                            alt="XMP Logo" 
                            width="100" 
                            className="mb-4"
                        />
                        <h2 className="text-white mb-4 fw-bold">ADMIN <span className="text-orange">LOGIN</span></h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleLogin} className="text-start">
                            <Form.Group className="mb-3">
                                <Form.Label className="text-secondary small">USERNAME</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-dark text-white border-secondary"
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-secondary small">PASSWORD</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    className="bg-dark text-white border-secondary"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </Form.Group>
                            <Button variant="brand" type="submit" className="w-100 py-3 rounded-pill fw-bold">
                                SIGN IN
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

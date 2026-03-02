import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaInstagram, FaYoutube, FaFacebook, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import logoWhite from '../assets/logos/xmp-logo-white.png';

/**
 * Footer component - Sticky footer appearing at the bottom of all pages.
 * Contains quick links, contact information, social links, and branding.
 */
const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-3 mt-auto border-top border-secondary">
            <Container>
                <Row>
                    <Col md={4} className="mb-4">
                        <img 
                            src={logoWhite} 
                            alt="XMP Logo" 
                            height="50" 
                            width="143"
                            className="mb-3"
                            loading="lazy"
                            style={{ objectFit: 'contain' }}
                        />
                        <p className="text-white-50">
                            Established in 2017, Xclusvs Motion Pictures is a dynamic production company specializing in video, photography, and web solutions in Zimbabwe and beyond.
                        </p>
                    </Col>
                    <Col md={2} className="mb-4">
                        <h3 className="h5 fw-bold mb-4">Quick Links</h3>
                        <ul className="list-unstyled text-secondary">
                            <li className="mb-2"><Link to="/gallery" className="text-decoration-none text-secondary hover-orange transition-all">Our Work</Link></li>
                            <li className="mb-2"><Link to="/services" className="text-decoration-none text-secondary hover-orange transition-all">Services</Link></li>
                            <li className="mb-2"><Link to="/contact" className="text-decoration-none text-secondary hover-orange transition-all">Get in Touch</Link></li>
                            <li className="mb-2"><Link to="/faq" className="text-decoration-none text-secondary hover-orange transition-all">FAQ</Link></li>
                            <li className="mb-2"><Link to="/disclaimer" className="text-decoration-none text-secondary hover-orange transition-all">Disclaimer</Link></li>
                            <li className="mb-2"><Link to="/privacy-policy" className="text-decoration-none text-secondary hover-orange transition-all">Privacy Policy</Link></li>
                            <li className="mb-2"><Link to="/terms-and-conditions" className="text-decoration-none text-secondary hover-orange transition-all">Terms & Conditions</Link></li>
                            <li className="mb-2"><Link to="/login" className="text-decoration-none text-secondary hover-orange transition-all">Admin Login</Link></li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h5 className="fw-bold mb-3">Contact</h5>
                        <ul className="list-unstyled text-secondary">
                            <li className="mb-2 small"><FaPhone className="me-2 text-orange" /> +263 77 180 0296</li>
                            <li className="mb-2 small"><FaEnvelope className="me-2 text-orange" /> xclusvsmotionpictures@gmail.com</li>
                            <li className="small">187 BAINES AVENUE/ 9TH STREET, HARARE, ZIMBABWE</li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h5 className="fw-bold mb-3">Follow Us</h5>
                        <div className="d-flex gap-3">
                            <a href="https://www.youtube.com/@xclusvsmotionpictures" target="_blank" rel="noopener noreferrer" className="text-white fs-4" aria-label="Follow XMP on YouTube"><FaYoutube /></a>
                            <a href="https://www.facebook.com/xclusvsmotionpictures/" target="_blank" rel="noopener noreferrer" className="text-white fs-4" aria-label="Follow XMP on Facebook"><FaFacebook /></a>
                        </div>
                    </Col>
                </Row>

                <Row className="mt-4 pt-4 border-top border-secondary border-opacity-25 align-items-center">
                    <Col md={6} className="mb-4 mb-md-0">
                        <h5 className="fw-bold mb-2 h6">Subscribe to our Newsletter</h5>
                        <p className="text-white-50 small mb-0">Get the latest updates on our projects and services.</p>
                    </Col>
                    <Col md={6}>
                        <NewsletterForm />
                    </Col>
                </Row>

                <hr className="border-secondary" />
                <div className="text-center text-secondary small">
                    &copy; {new Date().getFullYear()} Xclusvs Motion Pictures. All Rights Reserved.
                </div>
            </Container>
        </footer>
    );
};

/**
 * NewsletterForm component - Handles email subscription for the newsletter.
 * Integrated within the footer to allow users to subscribe from any page.
 */
const NewsletterForm = () => {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState({ type: '', message: '' });
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/newsletter/', { email });
            setStatus({ type: 'success', message: 'Successfully subscribed! Thank you.' });
            setEmail('');
        } catch (err) {
            const errorMsg = err.response?.data?.email?.[0] || 'Something went wrong. Please try again.';
            if (errorMsg.includes('already exists')) {
                setStatus({ type: 'info', message: 'You are already subscribed!' });
            } else {
                setStatus({ type: 'error', message: errorMsg });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <div className="d-flex gap-2">
                <input 
                    id="newsletter-email"
                    type="email" 
                    placeholder="Enter your email" 
                    className="form-control bg-dark border-secondary text-white rounded-pill px-4 py-2 newsletter-input-footer"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    aria-label="Email address for newsletter"
                />
                <button 
                    type="submit" 
                    className="btn btn-brand rounded-pill px-4 fw-bold"
                    disabled={loading}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {loading ? '...' : 'JOIN'}
                </button>
            </div>
            {status.message && (
                <div className={`small px-3 ${
                    status.type === 'success' ? 'text-success' : 
                    status.type === 'info' ? 'text-info' : 'text-danger'
                }`}>
                    {status.message}
                </div>
            )}
        </form>
    );
};

export default Footer;

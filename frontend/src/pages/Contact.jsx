import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaFacebook } from 'react-icons/fa';
import api from '../utils/api';
import SEO from '../components/SEO';

/**
 * Contact component - Provides a contact form and company location information.
 */
const Contact = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.plan && location.state?.service) {
            setFormData(prev => ({
                ...prev,
                subject: `${location.state.service} Inquiry`,
                message: `I am interested in the ${location.state.plan} plan for ${location.state.service}. Please send me more details.`
            }));
        }
    }, [location.state]);

    const validateForm = () => {
        if (!formData.name.trim()) return "Please enter your name.";
        if (!formData.email.trim()) return "Please enter your email.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";
        if (!formData.subject.trim()) return "Please enter a subject.";
        if (formData.message.trim().length < 10) return "Message must be at least 10 characters long.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Anti-spam check
        if (formData.honeypot) {
            console.warn("Spam detected");
            setStatus({ type: 'success', msg: 'Your message has been sent successfully!' });
            return;
        }

        const error = validateForm();
        if (error) {
            setStatus({ type: 'danger', msg: error });
            return;
        }

        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            await api.post('/contact/', formData);
            setStatus({ type: 'success', msg: 'Your message has been sent successfully! We will get back to you soon.' });
            setFormData({ name: '', email: '', subject: '', message: '', website: '' });
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus({ type: 'danger', msg: 'Failed to send message. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-page pt-5 bg-black min-vh-100 pb-5">
            <SEO 
                title="Contact Us" 
                description="Get in touch with us for project inquiries, quotes, or just to say hi. We're ready to bring your vision to life."
                url="/contact"
            />
            <Container className="py-5 mt-5">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="glass-card overflow-hidden">
                            <Row className="g-0">
                                <Col md={5} className="bg-orange p-5 d-flex flex-column justify-content-center text-white position-relative overflow-hidden">
                                     <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-10" style={{ background: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}></div>
                                     <div className="position-relative z-1">
                                        <h3 className="fw-bold mb-4 display-5">Let's Talk</h3>
                                        <p className="mb-5 opacity-75">Ready to start your project? We are ready to listen.</p>
                                        
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3"><FaPhone /></div> 
                                            <div className="fs-5">
                                                <div>+263 77 180 0296</div>
                                                <div>+263 71 510 1837</div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3"><FaEnvelope /></div> 
                                            <span className="fs-5">xclusvsmotionpictures@gmail.com</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3"><FaMapMarkerAlt /></div> 
                                            <div className="fs-5">
                                                187 BAINES AVENUE/ <br/>
                                                9TH STREET, HARARE, ZIMBABWE
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <h5 className="fw-bold mb-3">Follow Us</h5>
                                            <div className="d-flex gap-3">
                                                <a href="https://www.youtube.com/@xclusvsmotionpictures" target="_blank" rel="noopener noreferrer" aria-label="Visit our YouTube channel" className="text-white fs-4 bg-white bg-opacity-25 p-3 rounded-circle d-flex align-items-center justify-content-center hover-scale transition-all">
                                                    <FaYoutube />
                                                </a>
                                                <a href="https://www.facebook.com/xclusvsmotionpictures/" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className="text-white fs-4 bg-white bg-opacity-25 p-3 rounded-circle d-flex align-items-center justify-content-center hover-scale transition-all">
                                                    <FaFacebook />
                                                </a>
                                            </div>
                                        </div>
                                     </div>
                                </Col>
                                <Col md={7} className="p-5 bg-dark">
                                    <h3 className="mb-4 fw-bold text-white">Send a Message</h3>
                                    
                                    {status.msg && <Alert variant={status.type} className="mb-4">{status.msg}</Alert>}

                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="text-white-50 small fw-bold">NAME</Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="name"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="bg-black border-secondary text-white py-3 rounded-0 border-top-0 border-start-0 border-end-0 custom-input-focus" 
                                                        placeholder="John Doe" 
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="text-white-50 small fw-bold">EMAIL</Form.Label>
                                                    <Form.Control 
                                                        type="email" 
                                                        name="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="bg-black border-secondary text-white py-3 rounded-0 border-top-0 border-start-0 border-end-0 custom-input-focus" 
                                                        placeholder="john@example.com" 
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-white-50 small fw-bold">SUBJECT</Form.Label>
                                            <Form.Select 
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="bg-black border-secondary text-white py-3 rounded-0 border-top-0 border-start-0 border-end-0 custom-select-dark" 
                                            >
                                                <option value="" disabled>Select a subject</option>
                                                <option value="Video Production Inquiry">Video Production Inquiry</option>
                                                <option value="Photography Session">Photography Session</option>
                                                <option value="Web Development Project">Web Development Project</option>
                                                <option value="Branding & Design">Branding & Design</option>
                                                <option value="Live Streaming Event">Live Streaming Event</option>
                                                <option value="General Question">General Question</option>
                                                {formData.subject && !["Video Production Inquiry", "Photography Session", "Web Development Project", "Branding & Design", "Live Streaming Event", "General Question", "Other"].includes(formData.subject) && (
                                                    <option value={formData.subject}>{formData.subject}</option>
                                                )}
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-5">
                                            <Form.Label className="text-white-50 small fw-bold">MESSAGE</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={4} 
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="bg-black border-secondary text-white py-3 rounded-0 border-top-0 border-start-0 border-end-0 custom-input-focus" 
                                                placeholder="Tell us about your project or vision..." 
                                            />
                                        </Form.Group>
                                        
                                        {/* Honeypot field for bot protection */}
                                        <div style={{ display: 'none' }} aria-hidden="true">
                                            <input 
                                                type="text" 
                                                name="website" 
                                                tabIndex="-1" 
                                                autoComplete="off" 
                                                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} 
                                            />
                                        </div>

                                        <Button 
                                            variant="brand" 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-100 py-3 rounded-pill fw-bold spacing-2 d-flex align-items-center justify-content-center"
                                        >
                                            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                                            {loading ? 'SENDING...' : 'SEND MESSAGE'}
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                {/* Interactive Instant Project Estimator */}
                <Row className="justify-content-center mt-5">
                    <Col lg={10}>
                        <div className="glass-card p-4 p-md-5 rounded-4 border-top border-orange border-opacity-25">
                            <div className="text-center mb-4">
                                <h6 className="text-orange fw-bold spacing-2 text-uppercase mb-2">Instant Calculator</h6>
                                <h3 className="display-6 fw-bold text-white mb-2">INTERACTIVE <span className="text-orange">PROJECT ESTIMATOR</span></h3>
                                <p className="text-white-50">Select your scope and options below for an instant estimated budget range.</p>
                            </div>

                            <EstimatorWidget onApplyQuote={(quoteSubject, quoteMsg) => {
                                setFormData(prev => ({
                                    ...prev,
                                    subject: quoteSubject,
                                    message: quoteMsg
                                }));
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                            }} />
                        </div>
                    </Col>
                </Row>

                {/* Map Section */}
                <Row className="justify-content-center mt-5">
                    <Col lg={10}>
                        <div className="glass-card p-2 overflow-hidden map-container" style={{ height: '400px' }}>
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.2!2d31.0!3d-17.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTg3IEJhaW5lcyBBdmUsIEhhcmFyZQ!5e0!3m2!1sen!2szw!4v1713690000000!5m2!1sen!2szw" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, borderRadius: '12px', filter: 'grayscale(1) invert(0.9) contrast(1.2)' }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Office Location"
                            ></iframe>
                        </div>
                        <div className="text-center mt-3 text-secondary small">
                             <FaMapMarkerAlt className="text-orange me-2" /> 187 BAINES AVENUE/ 9TH STREET, HARARE, ZIMBABWE
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

/**
 * EstimatorWidget component - Interactive cost calculator for potential clients.
 */
const EstimatorWidget = ({ onApplyQuote }) => {
    const [service, setService] = useState('Event Production');
    const [duration, setDuration] = useState('Full Day');
    const [addons, setAddons] = useState({
        drone: true,
        cineLens: false,
        motionGraphics: true,
        liveSwitching: false
    });

    const basePrices = {
        'Event Production': 500,
        'Professional Video (Music Video / Short)': 650,
        'Commercial Ad Production': 600,
        'Live Streaming Event': 500,
        'Photography Session': 350
    };

    const durationMultipliers = {
        'Half Day': 1.0,
        'Full Day': 1.6,
        'Multi Day': 2.8
    };

    const addonPrices = {
        drone: 200,
        cineLens: 150,
        motionGraphics: 250,
        liveSwitching: 300
    };

    const calculateTotal = () => {
        const base = basePrices[service] || 500;
        const mult = durationMultipliers[duration] || 1.0;
        let addonSum = 0;
        if (addons.drone) addonSum += addonPrices.drone;
        if (addons.cineLens) addonSum += addonPrices.cineLens;
        if (addons.motionGraphics) addonSum += addonPrices.motionGraphics;
        if (addons.liveSwitching) addonSum += addonPrices.liveSwitching;

        const total = Math.round((base * mult) + addonSum);
        return {
            min: Math.round(total * 0.9),
            max: Math.round(total * 1.15)
        };
    };

    const estimate = calculateTotal();

    const handleApply = () => {
        const selectedAddonsList = Object.keys(addons)
            .filter(k => addons[k])
            .map(k => k === 'drone' ? 'Drone Aerial Footage' : k === 'cineLens' ? 'Anamorphic/Cinema Lens Set' : k === 'motionGraphics' ? 'Motion Graphics & VFX' : 'Live Video Switching')
            .join(', ');

        const subject = `${service} Estimate ($${estimate.min} - $${estimate.max})`;
        const message = `Hello XMP Team,\n\nI calculated an estimated project budget on your website:\n- Service: ${service}\n- Duration: ${duration}\n- Add-ons: ${selectedAddonsList || 'None'}\n- Estimated Price Range: $${estimate.min} - $${estimate.max}\n\nPlease contact me to confirm availability and discuss details.`;

        onApplyQuote(subject, message);
    };

    return (
        <div>
            <Row className="g-4 align-items-center">
                <Col md={6}>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-white-50 small fw-bold">1. SERVICE TYPE</Form.Label>
                        <Form.Select 
                            value={service} 
                            onChange={(e) => setService(e.target.value)}
                            className="bg-black text-white border-secondary rounded-3 py-3"
                        >
                            <option value="Event Production">Event Production (Conferences & Galas)</option>
                            <option value="Professional Video (Music Video / Short)">Professional Video (Music Video / Short)</option>
                            <option value="Commercial Ad Production">Commercial Ad Production (TV & Digital Ads)</option>
                            <option value="Live Streaming Event">Live Streaming Event</option>
                            <option value="Photography Session">Photography Session</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="text-white-50 small fw-bold">2. COVERAGE DURATION</Form.Label>
                        <div className="d-flex gap-2">
                            {['Half Day', 'Full Day', 'Multi Day'].map((dur) => (
                                <Button 
                                    key={dur}
                                    variant={duration === dur ? 'brand' : 'outline-light'}
                                    className="flex-grow-1 py-2 rounded-pill small fw-bold"
                                    onClick={() => setDuration(dur)}
                                >
                                    {dur}
                                </Button>
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-white-50 small fw-bold mb-2">3. PRODUCTION ADD-ONS</Form.Label>
                        <Row className="g-2">
                            {[
                                { key: 'drone', label: 'Drone Aerial Cinema (+$200)' },
                                { key: 'cineLens', label: 'Cine Prime Lenses (+$150)' },
                                { key: 'motionGraphics', label: 'Motion Graphics (+$250)' },
                                { key: 'liveSwitching', label: 'Live Switcher Room (+$300)' }
                            ].map((item) => (
                                <Col sm={6} key={item.key}>
                                    <div 
                                        className={`p-3 rounded-3 cursor-pointer transition-all border ${addons[item.key] ? 'border-orange bg-black text-white shadow-sm' : 'border-secondary border-opacity-25 bg-dark text-white-50'}`}
                                        onClick={() => setAddons(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Form.Check 
                                            type="checkbox" 
                                            label={item.label}
                                            checked={addons[item.key]}
                                            onChange={() => {}}
                                            className="small fw-bold pointer-events-none"
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <div className="glass-card p-4 text-center border-orange border-opacity-50 position-relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #0a0a0a 100%)' }}>
                        <div className="position-absolute top-0 end-0 p-3 opacity-10 fs-1 text-orange">⚡</div>
                        <h6 className="text-orange fw-bold spacing-2 text-uppercase mb-2">Estimated Investment</h6>
                        <div className="display-4 fw-bold text-white mb-2">
                            ${estimate.min} - <span className="text-orange">${estimate.max}</span>
                        </div>
                        <p className="text-white-50 small mb-4">Includes production setup, camera crew, raw media transfer, and initial edit pass.</p>

                        <Button 
                            variant="brand" 
                            className="w-100 py-3 rounded-pill fw-bold shadow-lg"
                            onClick={handleApply}
                        >
                            APPLY ESTIMATE TO CONTACT FORM ↓
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Contact;

import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaVideo, FaCamera, FaGlobe, FaEdit, FaMicrophone, FaBroadcastTower, FaLightbulb, FaBullhorn } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../utils/api';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';

/**
 * Services component - Showcases the company's service offerings and pricing plans.
 * Dynamically fetches and groups pricing data by service type.
 */
const Services = () => {
    const services = [
        { id: 'video', icon: <FaVideo size={30}/>, title: 'Video Production', desc: 'Explainer, corporate, event coverage, and music videos.' },
        { id: 'photo', icon: <FaCamera size={30}/>, title: 'Photography', desc: 'Commercial, event, and portrait photography projects.' },
        { id: 'web', icon: <FaGlobe size={30}/>, title: 'Web Developing', desc: 'Website design, professional web apps, and hosting services.' },
        { id: 'edit', icon: <FaEdit size={30}/>, title: 'Video Editing', desc: 'Expert post-production for clients needing a professional touch.' },
        { id: 'audio', icon: <FaMicrophone size={30}/>, title: 'Audio Production', desc: 'Professional sound recording, mixing, and voice-over services.' },
        { id: 'live', icon: <FaBroadcastTower size={30}/>, title: 'Live Streaming', desc: 'High-quality multi-camera streaming for events and conferences.' },
        { id: 'brand', icon: <FaLightbulb size={30}/>, title: 'Branding', desc: 'Identity design, logo creation, and brand strategy for a cohesive image.' },
        { id: 'marketing', icon: <FaBullhorn size={30}/>, title: 'Digital Marketing', desc: 'Social media management, SEO, and targeted ad campaigns.' },
    ];

    const [selectedService, setSelectedService] = React.useState('video');
    const [pricingData, setPricingData] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await api.get('/pricing-plans/');
                const data = res.data.results || res.data;
                
                const grouped = data.reduce((acc, plan) => {
                    if (!acc[plan.service_type]) acc[plan.service_type] = [];
                    acc[plan.service_type].push({
                        plan: plan.plan_name,
                        price: plan.price,
                        features: plan.features_list,
                        popular: plan.is_popular
                    });
                    return acc;
                }, {});
                setPricingData(grouped);
            } catch (error) {
                console.error("Error fetching pricing plans:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPricing();
    }, []);

    if (loading) {
        return (
            <div className="services-page pt-5 bg-black text-white min-vh-100">
                <Container className="py-5 mt-5">
                    <div className="text-center mb-5">
                        <Skeleton type="text" className="h1 w-50 mx-auto mb-3" />
                        <Skeleton type="text" className="w-25 mx-auto" />
                    </div>
                    <Row className="g-4 mb-5 pb-5">
                        {Array(8).fill(0).map((_, i) => (
                            <Col lg={3} md={6} key={i}>
                                <Skeleton type="base" className="vh-20 rounded-4" />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        );
    }


    return (
        <div className="services-page pt-5 bg-black text-white min-vh-100">
            <SEO 
                title="Our Services" 
                description="Professional video production, photography, web development, branding, and digital marketing. Explore our cinematic services."
                url="/services"
            />
            <Container className="py-5 mt-5">
                <div className="text-center mb-5">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="display-2 fw-bold"
                    >
                        OUR <span className="text-orange">EXPERTISE</span>
                    </motion.h1>
                    <p className="lead text-white-50">Select a service to see tailored pricing plans.</p>
                </div>

                <Row className="g-4 mb-5 pb-5" role="tablist" aria-label="Services selection">
                    {services.map((s, i) => (
                        <Col lg={3} md={6} key={s.id}>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.05, y: -8 }}
                                onClick={() => setSelectedService(s.id)}
                                onKeyDown={(e) => e.key === 'Enter' && setSelectedService(s.id)}
                                tabIndex={0}
                                role="tab"
                                aria-selected={selectedService === s.id}
                                aria-controls={`pricing-panel-${s.id}`}
                                className={`glass-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer transition-all ${
                                    selectedService === s.id ? 'active-service border-orange shadow-lg' : 'border-secondary border-opacity-10'
                                }`}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={`mb-3 p-3 rounded-circle transition-all ${selectedService === s.id ? 'bg-black text-white shadow-sm' : 'bg-white bg-opacity-10 text-orange shadow-sm'}`}>
                                    {React.cloneElement(s.icon, { 'aria-hidden': 'true' })}
                                </div>
                                <h5 className="fw-bold mb-2 text-white">{s.title}</h5>
                                <p className={`small mb-0 transition-all ${selectedService === s.id ? 'text-white fw-bold' : 'text-white-50'}`}>{s.desc}</p>
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                <div className="pricing-section py-5 mt-5">
                    <motion.div
                        key={selectedService}
                        id={`pricing-panel-${selectedService}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${selectedService}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="display-4 fw-bold text-center mb-5">
                            {services.find(s => s.id === selectedService).title.toUpperCase()} <span className="text-orange">PLANS</span>
                        </h2>
                        
                        <Row className="justify-content-center align-items-stretch">
                            {pricingData[selectedService] ? pricingData[selectedService].map((tier, idx) => (
                                <Col lg={4} key={idx} className="mb-4">
                                    <motion.div 
                                        whileHover={{ y: -10 }}
                                        className={`glass-card p-5 text-center h-100 position-relative d-flex flex-column ${
                                            tier.popular ? 'active-tier border-orange shadow-lg z-1' : 'border-secondary border-opacity-10'
                                        }`}
                                        style={tier.popular ? { transform: 'scale(1.05)', borderColor: 'var(--brand-orange)' } : {}}
                                    >
                                        {tier.popular && (
                                            <Badge bg="orange" className="position-absolute top-0 start-50 translate-middle px-3 py-2">MOST POPULAR</Badge>
                                        )}
                                        <h4 className="fw-bold mb-2 text-white text-uppercase letter-spacing-1">{tier.plan}</h4>
                                        <div className="price-tag my-4">
                                            <span className="display-4 fw-bold text-orange">${tier.price}</span>
                                            <span className="text-secondary small ms-1">+</span>
                                        </div>
                                        <ul className="list-unstyled text-start w-100 mb-5 flex-grow-1">
                                            {tier.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="mb-3 d-flex align-items-center gap-2">
                                                    <span className="text-orange fw-bold">✓</span>
                                                    <span className="text-white-50">{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button 
                                            variant={tier.popular ? "brand" : "outline-light"} 
                                            className="w-100 py-3 fw-bold rounded-pill mt-auto shadow-hover"
                                            href="/contact"
                                        >
                                            {tier.plan === 'Corporate' || tier.plan === 'Enterprise' || tier.plan === 'Dominance' ? 'GET QUOTE' : 'CHOOSE PLAN'}
                                        </Button>
                                    </motion.div>
                                </Col>
                            )) : (
                                <Col className="text-center py-5">
                                    <p className="text-secondary fs-5">No plans available for this service yet. Please contact us for a custom quote.</p>
                                    <Button variant="brand" href="/contact" className="rounded-pill px-5">Get Quote</Button>
                                </Col>
                            )}
                        </Row>
                    </motion.div>
                </div>
            </Container>

            <style>{`
                .active-service {
                    background: var(--brand-orange) !important;
                    border: 2px solid #fff !important;
                    box-shadow: 0 0 30px rgba(255, 102, 0, 0.4);
                }
                .active-tier {
                    background: linear-gradient(145deg, #1a1a1a 0%, #000 100%) !important;
                    border: 1px solid var(--brand-orange) !important;
                }
                .shadow-hover:hover {
                    box-shadow: 0 0 20px rgba(255,102,0,0.4);
                }
                .letter-spacing-1 {
                    letter-spacing: 2px;
                }
            `}</style>
        </div>
    );
};

export default Services;

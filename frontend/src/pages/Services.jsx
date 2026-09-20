import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaVideo, FaCamera, FaGlobe, FaEdit, FaMicrophone, FaBroadcastTower, FaLightbulb, FaBullhorn, FaShareAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../utils/api';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';
import ShareModal from '../components/ShareModal';

/**
 * Services component - Showcases the company's service offerings and pricing plans.
 * Dynamically fetches and groups pricing data by service type.
 */
const Services = () => {
    const services = [
        { id: 'video', icon: <FaVideo size={30}/>, title: 'Video Production', desc: 'Explainer, corporate, event coverage, and music videos.' },
        { id: 'event_prod', icon: <FaVideo size={30}/>, title: 'Event Production', desc: 'Conferences, galas, concert coverage, and live event films.' },
        { id: 'pro_video', icon: <FaVideo size={30}/>, title: 'Professional Video', desc: 'Music videos, narrative short films, and documentaries.' },
        { id: 'commercial', icon: <FaBullhorn size={30}/>, title: 'Commercial Ad Production', desc: 'TV spots, social ad video packages, and motion graphics.' },
        { id: 'photo', icon: <FaCamera size={30}/>, title: 'Photography', desc: 'Commercial, event, and portrait photography projects.' },
        { id: 'web', icon: <FaGlobe size={30}/>, title: 'Web Developing', desc: 'Website design, professional web apps, and hosting services.' },
        { id: 'edit', icon: <FaEdit size={30}/>, title: 'Video Editing', desc: 'Expert post-production for clients needing a professional touch.' },
        { id: 'audio', icon: <FaMicrophone size={30}/>, title: 'Audio Production', desc: 'Professional sound recording, mixing, and voice-over services.' },
        { id: 'live', icon: <FaBroadcastTower size={30}/>, title: 'Live Streaming', desc: 'High-quality multi-camera streaming for events and conferences.' },
        { id: 'brand', icon: <FaLightbulb size={30}/>, title: 'Branding', desc: 'Identity design, logo creation, and brand strategy for a cohesive image.' },
        { id: 'marketing', icon: <FaBullhorn size={30}/>, title: 'Digital Marketing', desc: 'Social media management, SEO, and targeted ad campaigns.' },
    ];

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialService = searchParams.get('service') || 'video';
    const [selectedService, setSelectedService] = React.useState(initialService);
    const [pricingData, setPricingData] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [shareData, setShareData] = React.useState(null);
    const [showShareModal, setShowShareModal] = React.useState(false);

    const handleSharePlan = (tier) => {
        const currentServiceObj = services.find(s => s.id === selectedService);
        const serviceTitle = currentServiceObj ? currentServiceObj.title : 'Service';
        const baseUrl = `${window.location.origin}${window.location.pathname}`;
        const shareUrl = `${baseUrl}?service=${selectedService}&plan=${encodeURIComponent(tier.plan)}`;
        setShareData({
            title: `${serviceTitle} - ${tier.plan} Plan`,
            service: serviceTitle,
            plan: tier.plan,
            price: tier.price,
            text: `Check out the ${tier.plan} plan for ${serviceTitle} starting at $${tier.price} from Xclusvs Motion Pictures!`,
            url: shareUrl
        });
        setShowShareModal(true);
    };

    const defaultPlans = {
        video: [
            { plan: 'Essential', price: '350', features: ['Half Day Coverage (4 hrs)', 'HD Highlight Reel (3-5 min)', 'Color Grading & Audio Sync', 'Digital Delivery', '1 Revision Round'], popular: false },
            { plan: 'Pro Cinematic', price: '750', features: ['Full Day Coverage (8 hrs)', '4K Cinematic Film + Teaser', 'Drone Aerial Footage', 'Professional Sound Design', '2 Revision Rounds'], popular: true },
            { plan: 'Enterprise', price: '1,500', features: ['Multi-Day / Multi-Camera', 'Full RAW Footage Delivery', 'Commercial Broadcast Rights', '4K Master + Custom Teasers', 'Unlimited Revisions'], popular: false }
        ],
        event_prod: [
            { plan: 'Basic Event', price: '400', features: ['Half-Day Coverage', 'Single HD Camera Angle', 'Edited Highlights Video', 'Raw Audio Feed'], popular: false },
            { plan: 'Full Gala Coverage', price: '950', features: ['Full Event Coverage', 'Multi-Cam (2 Operators)', 'Full Multi-angle Highlight Film', 'On-site Interviews & Speeches', 'Drone Venue Shots'], popular: true },
            { plan: 'Broadcast Event', price: '1,800', features: ['Multi-day Event Coverage', 'Full Production Crew (3+ Cams)', 'Live Video Feed Switching', 'Same-Day Reel Delivery', 'Full Broadcast Rights'], popular: false }
        ],
        pro_video: [
            { plan: 'Indie Video', price: '450', features: ['Single Day Location Shoot', 'Music Video / Short Project', 'Cinematic 4K Resolution', 'Color Grading & Sound Mix', '1 Revision Round'], popular: false },
            { plan: 'Pro Music Video', price: '950', features: ['Full Concept & Storyboard', 'Multi-location Shoot', 'Advanced Lighting & Effects', 'Drone Aerial Cinema', 'Teaser Cuts for Social Media'], popular: true },
            { plan: 'Master Production', price: '2,000', features: ['High-Concept Studio Shoot', 'Full Creative Crew & Talent', 'VFX & Complex Post-production', 'Cinema Lenses & Anamorphic Kit', 'Full Commercial Distribution'], popular: false }
        ],
        commercial: [
            { plan: 'Social Ad', price: '300', features: ['15-30s Promo Video', 'Optimized for Reels & TikTok', 'Text Callouts & Motion Graphics', 'Licensed Background Track'], popular: false },
            { plan: 'Brand Campaign', price: '750', features: ['60s Brand Storytelling Ad', 'Voiceover Recording & Sync', 'High-impact Commercial Lighting', 'Multiple Aspect Ratio Cuts (16:9, 9:16, 1:1)', '2 Revision Rounds'], popular: true },
            { plan: 'Broadcast TV Commercial', price: '1,800', features: ['TV Broadcast Quality Mastering', 'Full Campaign Ad Set (30s, 15s, 6s)', '2 Motion Graphics Ads Included', 'Actors & Voiceover Talent Setup', 'Full Commercial License'], popular: false }
        ],
        photo: [
            { plan: 'Focus', price: '200', features: ['2 Hours Session', '25 High-Res Edited Photos', 'Online Private Gallery', '1 Location'], popular: false },
            { plan: 'Signature', price: '450', features: ['Half Day Session (4 hrs)', '60 High-Res Edited Photos', 'Skin & Color Retouching', 'Multiple Outfit Changes', 'Commercial Rights'], popular: true },
            { plan: 'Legacy', price: '900', features: ['Full Day Coverage (8 hrs)', '150+ Edited Photos', 'Second Shooter Included', 'Fast 48-Hour Turnaround', 'Full Print Rights'], popular: false }
        ],
        web: [
            { plan: 'Landing Page', price: '400', features: ['Single Page Responsive Site', 'Modern UI/UX Design', 'Contact Form Integration', 'SEO Optimization', '1 Year Free Hosting'], popular: false },
            { plan: 'Business Web App', price: '950', features: ['Multi-page Custom Website', 'Dynamic Content & CMS', 'Speed & Performance Tuned', 'Domain Setup & Security', 'Mobile First Responsive'], popular: true },
            { plan: 'Custom Platform', price: '2,200', features: ['Full-stack Custom App', 'Database & API Backend', 'User Authentication & Admin', 'Payment Gateway Integration', 'Dedicated Support'], popular: false }
        ],
        edit: [
            { plan: 'Basic Cut', price: '150', features: ['Up to 5 min Video', 'Basic Transitions & Cuts', 'Background Music Overlay', '1080p Export'], popular: false },
            { plan: 'Pro Edit', price: '350', features: ['Up to 20 min Video', 'Cinematic Color Grading', 'Audio Cleaning & Sound Effects', 'Subtitles & Motion Titles', '2 Revisions'], popular: true },
            { plan: 'Feature Post', price: '800', features: ['Full Length Project', 'Advanced Visual FX & Graphics', 'Multi-cam Audio/Video Sync', 'Broadcast Quality Mastering', 'Priority Turnaround'], popular: false }
        ],
        audio: [
            { plan: 'Voice & Mix', price: '120', features: ['Professional Voiceover Recording', 'Noise Reduction & EQ', 'Mastered Stereo Output'], popular: false },
            { plan: 'Studio Track', price: '300', features: ['Multi-track Studio Session', 'Vocal Tuning & Compression', 'Custom Background Music', 'High-Res WAV & MP3'], popular: true }
        ],
        live: [
            { plan: 'Basic', price: '125', features: ['Single 1080p HD Camera Angle', 'Wireless Audio Feed / Lapel Mic', 'Stream to 1 Platform (YouTube / FB)', 'HD Backup Recording Included', 'Basic Title Graphic & Lower Third'], popular: false },
            { plan: 'Professional', price: '500', features: ['2-3 Multi-Camera HD Angles', 'Pro Multi-Channel Audio Mixer & Mics', 'Custom Branded Lower Thirds & Overlays', 'Dual-Platform Simulcasting', 'Dedicated Stream Operator & Master Recording'], popular: true },
            { plan: 'Broadcast', price: '1,600', features: ['4+ Cinema Camera Angles (PTZ & Crane/Drone Ready)', 'Full Mobile Video Switcher Control Room', 'Studio Intercom Comms & Wireless Mics', 'Live Graphics, Scoreboards & Instant Replay', 'Multi-Platform 4K Stream + Master Recording & Technical Crew'], popular: false }
        ],
        brand: [
            { plan: 'Identity Kit', price: '300', features: ['Logo Design & Variations', 'Brand Color Palette', 'Typography & Fonts', 'Vector Master Files'], popular: false },
            { plan: 'Complete Brand', price: '700', features: ['Full Brand Style Guide', 'Social Media Templates', 'Business Card & Letterhead', 'Brand Usage Guidelines'], popular: true }
        ],
        marketing: [
            { plan: 'Starter', price: '250', features: ['12 Social Media Posts per month', 'Custom Graphic Design & Copywriting', 'Scheduled Publishing & Engagement', 'Monthly Performance Overview'], popular: false },
            { plan: 'Growth', price: '550', features: ['18 Social Media Posts (including 2 Reels)', 'Strategic Content Calendar', 'Targeted Hashtag & Audience Strategy', 'Active Community Management & Stories', 'Bi-weekly Performance Strategy Session'], popular: true },
            { plan: 'Performance', price: '1,200', features: ['Full Digital Calendar (Complete Month Coverage)', '6 High-Impact Reels per month', '2 Custom Motion Ads / Video Ad Campaigns', 'Complete Paid Ad Setup & Campaign Management', 'Weekly Analytics Reports & Growth Strategist'], popular: false }
        ]
    };

    React.useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await api.get('/pricing-plans/');
                const data = res.data.results || res.data;
                
                if (Array.isArray(data) && data.length > 0) {
                    const grouped = data.reduce((acc, plan) => {
                        if (!acc[plan.service_type]) acc[plan.service_type] = [];
                        const featList = Array.isArray(plan.features_list)
                            ? plan.features_list
                            : (typeof plan.features === 'string' ? plan.features.split('\n').filter(Boolean) : []);
                        acc[plan.service_type].push({
                            plan: plan.plan_name,
                            price: plan.price,
                            features: featList.length ? featList : ['Custom Features'],
                            popular: plan.is_popular
                        });
                        return acc;
                    }, {});
                    setPricingData(grouped);
                }
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
                description="Professional video production, photography, web development, branding, live streaming, and digital marketing."
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
                    <p className="lead text-white-50">Select a service to see tailored packages and pricing plans.</p>
                </div>

                {/* Featured Production Pillars Section */}
                <div className="mb-5 pb-4">
                    <h4 className="text-orange fw-bold spacing-2 text-uppercase mb-4 text-center">FEATURED PRODUCTION PILLARS</h4>
                    <Row className="g-4 justify-content-center">
                        {[
                            {
                                id: 'event_prod',
                                fallbackId: 'video',
                                title: '1. Event Production',
                                subtitle: 'Conferences, Galas & Live Shows',
                                desc: 'Full multi-camera event coverage, high-fidelity audio capture, live switching, and dynamic recap films.',
                                badge: 'Coverage & Galas'
                            },
                            {
                                id: 'pro_video',
                                fallbackId: 'video',
                                title: '2. Professional Video',
                                subtitle: 'Music Videos & Storytelling',
                                desc: 'High-end music videos, narrative shorts, artist showcases, and documentaries shot on 4K/6K cinema gear.',
                                badge: 'Music Videos & Shorts'
                            },
                            {
                                id: 'commercial',
                                fallbackId: 'video',
                                title: '3. Commercial Ad Production',
                                subtitle: 'Brand Ads & Motion Campaigns',
                                desc: 'High-converting commercials, TV spots, social media ad video sets, and motion graphics design.',
                                badge: 'TV & Digital Ads'
                            }
                        ].map((pillar, pIdx) => (
                            <Col lg={4} md={6} key={pIdx}>
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => setSelectedService(defaultPlans[pillar.id] ? pillar.id : pillar.fallbackId)}
                                    className={`glass-card p-4 h-100 border-0 cursor-pointer d-flex flex-column justify-content-between position-relative overflow-hidden ${selectedService === pillar.id ? 'border-orange shadow-lg' : ''}`}
                                    style={{ background: 'linear-gradient(145deg, rgba(255,102,0,0.08) 0%, rgba(20,20,20,0.95) 100%)', cursor: 'pointer' }}
                                >
                                    <div>
                                        <Badge bg="orange" className="mb-3 px-3 py-2 text-uppercase">{pillar.badge}</Badge>
                                        <h4 className="fw-bold text-white mb-1">{pillar.title}</h4>
                                        <h6 className="text-orange small mb-3">{pillar.subtitle}</h6>
                                        <p className="text-white-50 small mb-4">{pillar.desc}</p>
                                    </div>
                                    <Button variant="outline-light" size="sm" className="rounded-pill align-self-start fw-bold">
                                        VIEW PACKAGES →
                                    </Button>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
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
                            {(services.find(s => s.id === selectedService)?.title || 'SERVICE').toUpperCase()} <span className="text-orange">PLANS</span>
                        </h2>
                        
                        {(() => {
                            const currentPlans = (pricingData[selectedService] && pricingData[selectedService].length > 0)
                                ? pricingData[selectedService]
                                : (defaultPlans[selectedService] || []);
                            
                            return (
                                <Row className="justify-content-center align-items-stretch">
                                    {currentPlans.length > 0 ? currentPlans.map((tier, idx) => (
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
                                        <div className="d-flex flex-column gap-2 mt-auto w-100">
                                            <Button 
                                                variant={tier.popular ? "brand" : "outline-light"} 
                                                className="w-100 py-3 fw-bold rounded-pill shadow-hover"
                                                onClick={() => navigate('/contact', { 
                                                    state: { 
                                                        plan: tier.plan, 
                                                        service: services.find(s => s.id === selectedService)?.title || 'Service'
                                                    } 
                                                })}
                                            >
                                                {tier.plan === 'Corporate' || tier.plan === 'Enterprise' || tier.plan === 'Dominance' ? 'GET QUOTE' : 'CHOOSE PLAN'}
                                            </Button>

                                            <Button 
                                                variant="outline-secondary" 
                                                className="w-100 py-2 fw-bold rounded-pill text-white border-secondary border-opacity-50 d-flex align-items-center justify-content-center gap-2 shadow-hover small"
                                                onClick={() => handleSharePlan(tier)}
                                            >
                                                <FaShareAlt /> Share Price
                                            </Button>
                                        </div>
                                    </motion.div>
                                </Col>
                            )) : (
                                <Col className="text-center py-5">
                                    <p className="text-secondary fs-5">No plans available for this service yet. Please contact us for a custom quote.</p>
                                    <Button variant="brand" href="/contact" className="rounded-pill px-5">Get Quote</Button>
                                </Col>
                            )}
                                </Row>
                            );
                        })()}
                    </motion.div>
                </div>
            </Container>

            <ShareModal 
                show={showShareModal} 
                onHide={() => setShowShareModal(false)} 
                shareData={shareData} 
            />

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

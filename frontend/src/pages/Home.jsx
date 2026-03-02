import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import VideoThumbnail from '../components/VideoThumbnail';
import Loader from '../components/Loader';
import SEO from '../components/SEO';
import { getEmbedUrl } from '../utils/videoUtils';
import { optimizeImage } from '../utils/imageOptimization';
import { FaStar, FaArrowLeft, FaArrowRight, FaMicrophone, FaBroadcastTower } from 'react-icons/fa';
import heroBg from '../assets/pictures/hero-bg-pic.webp';

/**
 * Home component - The landing page of Xclusvs Motion Pictures.
 * Features parallax hero section, live stream alerts, featured projects, 
 * marquee of partner brands, testimonials carousel, and latest blog posts.
 */
const Home = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    const [featuredWork, setFeaturedWork] = React.useState([]);
    const [brands, setBrands] = React.useState([]);
    const [testimonials, setTestimonials] = React.useState([]);
    const [currentTesti, setCurrentTesti] = React.useState(0);
    const [blogPosts, setBlogPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [isLive, setIsLive] = React.useState(false);
    const [activeStream, setActiveStream] = React.useState(null);

    React.useEffect(() => {
        /**
         * Fetches all required data for the Home page, including featured work,
         * brands, testimonials, blog posts, and live stream status.
         */
        const fetchData = async () => {
            try {
                // Fetch featured videos and photos simultaneously
                const [vidRes, photoRes] = await Promise.all([
                    api.get('/videos/', { params: { is_featured: true } }),
                    api.get('/photos/', { params: { is_featured: true } })
                ]);
                
                // Combine results
                const videos = vidRes.data.results || vidRes.data;
                const photos = photoRes.data.results || photoRes.data;
                const combined = [...videos, ...photos].slice(0, 3);
                setFeaturedWork(combined);

                // Fetch other data in parallel
                const [brandRes, testiRes, blogRes, liveRes] = await Promise.all([
                    api.get('/brands/'),
                    api.get('/testimonials/'),
                    api.get('/blog/'),
                    api.get('/live/')
                ]);

                setBrands(brandRes.data.results || brandRes.data);
                setTestimonials(testiRes.data.results || testiRes.data);
                
                const blogs = blogRes.data.results || blogRes.data;
                setBlogPosts(blogs.slice(0, 3));

                const streams = liveRes.data.results || liveRes.data;
                const current = streams.find(s => s.is_live);
                if (current) {
                    setIsLive(true);
                    setActiveStream(current);
                }
            } catch (error) {
                console.error("Error fetching home page data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-play testimonials
    React.useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentTesti(prev => (prev + 1) % testimonials.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    // Don't block the whole page loading. Let the Hero load immediately.
    // if (loading) return <Loader fullPage />;

    const businessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Xclusvs Motion Pictures",
        "image": "https://xclusvsmotionpictures.com/logo.png",
        "@id": "",
        "url": "https://xclusvsmotionpictures.com",
        "telephone": "+263 77 123 4567",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Chitungwiza",
            "addressLocality": "Harare",
            "addressRegion": "Harare",
            "postalCode": "0000",
            "addressCountry": "ZW"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -18.0127,
            "longitude": 31.0661
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "08:00",
            "closes": "18:00"
        },
        "sameAs": [
            "https://www.facebook.com/XclusvsMotionPictures",
            "https://www.instagram.com/XclusvsMotionPictures"
        ]
    };

    return (
        <div className="home-page overflow-hidden pt-5 mt-3 pt-lg-0 mt-lg-0">
            <SEO 
                title="Home" 
                description="Professional cinematography and photography services in Zimbabwe. We capture the unseen and craft legacies through cinematic visuals."
                url="/"
                schemaData={businessSchema}
            />
            {/* Live Now Alert Bar */}
            <AnimatePresence>
                {isLive && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-danger text-white py-2 shadow-lg fixed-top z-3"
                        style={{ marginTop: '80px' }} 
                    >
                        <Container className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <div className="pulse-dot-white"></div>
                                <span className="fw-bold small spacing-1">LIVE NOW: {activeStream?.title}</span>
                            </div>
                            <Button variant="link" href="/live" className="text-white p-0 small fw-bold text-decoration-none">
                                WATCH LIVE →
                            </Button>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Creative Parallax Hero */}
            <header className="position-relative vh-100 d-flex align-items-center justify-content-center overflow-hidden">
                <motion.div 
                    style={{ y: y1 }}
                    className="position-absolute w-100 h-100"
                >
                    <img 
                        src={heroBg}
                        alt="Cinematic Background"
                        fetchpriority="high"
                        loading="eager"
                        style={{ 
                            objectFit: 'cover',
                            objectPosition: 'center',
                            height: '120%', 
                            width: '100%',
                            filter: 'brightness(0.6)'
                        }} 
                    />
                </motion.div>
                
                <Container className="position-relative text-center text-white z-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="display-1 fw-bold mb-0" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-3px', lineHeight: 1 }}>
                            CAPTURING <br/> THE <span className="text-transparent bg-clip-text" style={{ background: 'var(--brand-orange-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UNSEEN</span>
                        </h1>
                        <p className="lead fs-4 mt-4 mb-5 fw-medium text-white-50" style={{ letterSpacing: '4px' }}>
                            CINEMATIC VISUALS FOR THE BOLD
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="d-flex justify-content-center gap-3"
                    >
                        {isLive ? (
                            <Button variant="danger" size="lg" className="px-5 py-3 shadow-lg fw-bold pulse-animation-btn" href="/live">
                                <FaBroadcastTower className="me-2" /> WATCH LIVE
                            </Button>
                        ) : (
                            <Button variant="brand" size="lg" className="px-5 py-3 shadow-lg" href="/gallery">EXPLORE WORK</Button>
                        )}
                    </motion.div>
                </Container>
                
                {/* Scroll Indicator */}
                <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="position-absolute bottom-0 mb-5 text-white opacity-50 text-center w-100"
                >
                    <p className="small mb-1" style={{ letterSpacing: '2px' }}>SCROLL</p>
                    <div className="vr bg-white opacity-100" style={{ height: '40px', width: '2px' }}></div>
                </motion.div>
            </header>

            {/* Live Screening Section - Appears only when live */}
            <AnimatePresence>
                {isLive && activeStream && (
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="py-5 bg-black border-bottom border-danger border-opacity-25"
                    >
                        <Container className="py-4">
                            <div className="text-center mb-5">
                                <h6 className="text-danger fw-bold spacing-3 text-uppercase mb-2">Happening Now</h6>
                                <h2 className="display-4 fw-bold text-white">LIVE <span className="text-white opacity-25">SCREENING</span></h2>
                            </div>
                            <div className="glass-card p-2 p-md-4 rounded-4 shadow-lg overflow-hidden border-danger border-opacity-50">
                                <div className="ratio ratio-16x9">
                                    <iframe 
                                        src={getEmbedUrl(activeStream.stream_url) + "?autoplay=1&mute=1"} 
                                        title={activeStream.title} 
                                        allowFullScreen
                                        loading="lazy"
                                        className="rounded-3 shadow-2xl"
                                    ></iframe>
                                </div>
                                <div className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3 bg-dark bg-opacity-50">
                                    <div>
                                        <h4 className="fw-bold mb-1 text-white">{activeStream.title}</h4>
                                        <p className="text-light opacity-75 small mb-0">{activeStream.description}</p>
                                    </div>
                                    <Button variant="danger" href="/live" className="px-4 py-2 fw-bold">THE LIVE EXPERIENCE</Button>
                                </div>
                            </div>
                        </Container>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Asymmetrical Services Section */}
            <section className="py-5 position-relative bg-black">
                <Container className="py-5">
                    <Row className="align-items-center mb-5">
                        <Col lg={5}>
                             <motion.h2 
                                initial={{ x: -50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="display-3 fw-bold mb-4"
                             >
                                CRAFTING <br/> <span className="text-orange">LEGACIES</span>
                             </motion.h2>
                        </Col>
                        <Col lg={7}>
                            <p className="fs-5 text-white-50 border-start border-orange border-4 ps-4">
                                We don't just record events; we engineer memories. Using industry-leading cinema cameras and post-production techniques, we turn seconds into eternity.
                            </p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col lg={4} md={6} className="mt-lg-5">
                            <motion.div whileHover={{ y: -10 }} className="glass-card p-4 h-100">
                                <h3 className="display-4 text-orange mb-3 fw-bold">01</h3>
                                <h4 className="fw-bold">Video Production</h4>
                                <p className="text-secondary opacity-75 small">Explainer, corporate, event, and music videos. Cinematic 4K production.</p>
                            </motion.div>
                        </Col>
                        <Col lg={4} md={6}>
                            <motion.div whileHover={{ y: -10 }} className="glass-card p-4 h-100 bg-orange border-0 shadow-lg" style={{ background: 'var(--brand-orange)' }}>
                                <h3 className="display-4 text-black mb-3 fw-bold">02</h3>
                                <h4 className="fw-bold text-white">Photography</h4>
                                <p className="text-black fw-medium opacity-100 small">Commercial, event, and portrait photography that captures raw emotion.</p>
                            </motion.div>
                        </Col>
                        <Col lg={4} md={6} className="mt-lg-5">
                            <motion.div whileHover={{ y: -10 }} className="glass-card p-4 h-100">
                                <h3 className="display-4 text-orange mb-3 fw-bold">03</h3>
                                <h4 className="fw-bold">Web Developing</h4>
                                <p className="text-secondary opacity-75 small">Website design, web apps, and hosting services for a powerful digital presence.</p>
                            </motion.div>
                        </Col>
                        <Col lg={4} md={6}>
                            <motion.div whileHover={{ y: -10 }} className="glass-card p-4 h-100 bg-orange border-0 shadow-lg" style={{ background: 'var(--brand-orange)' }}>
                                <h3 className="display-4 text-black mb-3 fw-bold">04</h3>
                                <h4 className="fw-bold text-white">Video Editing</h4>
                                <p className="text-black fw-medium opacity-100 small">Expert post-production and editing services to bring your raw footage to life.</p>
                            </motion.div>
                        </Col>
                        <Col lg={4} md={6} className="mt-lg-5">
                            <motion.div whileHover={{ y: -10 }} className="glass-card p-4 h-100">
                                <h3 className="display-4 text-orange mb-3 fw-bold">05</h3>
                                <h4 className="fw-bold">Audio Production</h4>
                                <p className="text-secondary opacity-75 small">Professional sound recording, mixing, and voice-over services for all media.</p>
                            </motion.div>
                        </Col>
                        <Col lg={4} md={6}>
                            <motion.div whileHover={{ y: -10 }} className="glass-card p-4 h-100 bg-orange border-0 shadow-lg" style={{ background: 'var(--brand-orange)' }}>
                                <h3 className="display-4 text-black mb-3 fw-bold">06</h3>
                                <h4 className="fw-bold text-white">Live Streaming</h4>
                                <p className="text-black fw-medium opacity-100 small">High-quality multi-camera streaming for events, conferences, and weddings.</p>
                            </motion.div>
                        </Col>
                        <Col lg={4} md={6} className="mt-lg-5">
                            <motion.div whileHover={{ y: -10 }} className="glass-card p-4 h-100">
                                <h3 className="display-4 text-orange mb-3 fw-bold">07</h3>
                                <h4 className="fw-bold">Branding</h4>
                                <p className="text-secondary opacity-75 small">Identity design, logo creation, and brand strategy for a cohesive image.</p>
                            </motion.div>
                        </Col>
                        <Col lg={4} md={6}>
                            <motion.div whileHover={{ y: -10 }} className="glass-card p-4 h-100 bg-orange border-0 shadow-lg" style={{ background: 'var(--brand-orange)' }}>
                                <h3 className="display-4 text-black mb-3 fw-bold">08</h3>
                                <h4 className="fw-bold text-white">Digital Marketing</h4>
                                <p className="text-black fw-medium opacity-100 small">Social media management, SEO, and targeted ad campaigns for growth.</p>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Featured Work - Dark & Moody */}
            <section className="py-5 bg-dark" style={{ minHeight: '800px' }}>
                <Container className="py-5">
                    <div className="d-flex justify-content-between align-items-end mb-5">
                        <h2 className="display-4 fw-bold text-white">FEATURED <br/><span className="text-white opacity-25">PROJECTS</span></h2>
                        <Button variant="outline-light" href="/gallery" className="d-none d-md-block">VIEW ALL WORK</Button>
                    </div>
                    
                    <Row className="g-4">
                        {featuredWork.length > 0 ? (
                            <>
                                {/* Main Featured Item (Left) */}
                                <Col md={8}>
                                    {featuredWork[0] && (
                                        <motion.div 
                                            whileHover={{ scale: 0.98 }}
                                            className="position-relative overflow-hidden rounded-4 h-100" 
                                            style={{ minHeight: '400px' }}
                                        >
                                            {/* Handle Video vs Photo content */}
                                            {featuredWork[0].video_url ? (
                                                <div className="w-100 h-100 bg-dark position-relative">
                                                     {/* Use thumbnail if available, else placeholder or iframe (iframe not ideal for hover card but ok for now) 
                                                         Ideally we used the thumbnail field from backend */}
                                                    <VideoThumbnail video={featuredWork[0]} className="img-cover w-100 h-100 object-fit-cover" />
                                                </div>
                                            ) : (
                                                <img src={optimizeImage(featuredWork[0].image, 800, 600)} width="800" height="600" alt={featuredWork[0].title} className="img-cover w-100 h-100 object-fit-cover" loading="lazy" />
                                            )}
                                            
                                            <div className="position-absolute bottom-0 start-0 w-100 p-5 bg-gradient-to-t" style={{ background: 'linear-gradient(to top, black, transparent)' }}>
                                                <h3 className="text-white mb-0">{featuredWork[0].title}</h3>
                                                <p className="text-orange small fw-bold spacing-2 text-uppercase">{featuredWork[0].category?.name || 'FEATURED'}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </Col>
                                {/* Secondary Items (Right Stack) */}
                                <Col md={4}>
                                    <div className="d-flex flex-column gap-4 h-100">
                                        {featuredWork.slice(1, 3).map((item) => (
                                            <motion.div 
                                                key={item.id}
                                                whileHover={{ scale: 0.98 }}
                                                className="position-relative overflow-hidden rounded-4 flex-grow-1"
                                                style={{ minHeight: '250px' }}
                                            >
                                                {item.video_url ? (
                                                     <VideoThumbnail video={item} className="img-cover w-100 h-100 object-fit-cover" />
                                                ) : (
                                                    <img src={optimizeImage(item.image, 400, 300)} width="400" height="300" alt={item.title} className="img-cover w-100 h-100 object-fit-cover" loading="lazy" />
                                                )}
                                                <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, black, transparent)' }}>
                                                    <h5 className="text-white mb-0">{item.title}</h5>
                                                    <p className="text-orange small fw-bold text-uppercase">{item.category?.name || 'PROJECT'}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Col>
                            </>
                        ) : (
                             <Col className="text-center py-5">
                                <p className="text-secondary">No featured projects yet. Check back soon!</p>
                             </Col>
                        )}
                    </Row>
                    <div className="d-md-none text-center mt-4">
                        <Button variant="outline-light" href="/gallery">VIEW ALL WORK</Button>
                    </div>
                </Container>
            </section>

            {/* Clients Section - Premium Marquee */}
            <section className="py-5 bg-black overflow-hidden border-top border-secondary border-opacity-10" style={{ minHeight: '300px' }}>
                {brands.length > 0 ? (
                    <Container fluid className="px-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="text-center mb-5"
                        >
                            <h6 className="text-orange fw-bold spacing-2 text-uppercase mb-2" style={{ letterSpacing: '4px' }}>Partnerships</h6>
                            <h2 className="display-5 fw-bold text-white mb-0">CLIENTS WE'VE <span className="text-white opacity-25">WORKED WITH</span></h2>
                        </motion.div>
                        
                        <div className="logo-marquee-container">
                            <div className="logo-marquee-track">
                                {/* Duplicate logos for seamless loop */}
                                {[...brands, ...brands, ...brands].map((brand, idx) => (
                                    <div key={`${brand.id}-${idx}`} className="logo-item">
                                        {brand.website_url ? (
                                            <a 
                                                href={brand.website_url} 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="d-block text-center"
                                            >
                                                <img 
                                                    src={optimizeImage(brand.logo, 356, 200)} 
                                                    width="356"
                                                    height="200"
                                                    alt={brand.name} 
                                                    className="brand-logo-img"
                                                    title={brand.name}
                                                    loading="lazy"
                                                />
                                            </a>
                                        ) : (
                                            <div className="d-block text-center" style={{ cursor: 'default' }}>
                                                <img 
                                                    src={optimizeImage(brand.logo, 356, 200)} 
                                                    width="356"
                                                    height="200"
                                                    alt={brand.name} 
                                                    className="brand-logo-img"
                                                    title={brand.name}
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Container>
                ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                        <p className="text-secondary opacity-50">Loading partners...</p>
                    </div>
                )}
            </section>

            {/* Testimonials - Premium Carousel */}
            <section className="py-5 bg-black position-relative overflow-hidden" style={{ minHeight: '600px' }}>
                {testimonials.length > 0 ? (
                    <>
                    {/* Background Subtle Text */}
                    <div className="position-absolute top-50 start-50 translate-middle display-1 fw-bold text-white opacity-25" style={{ fontSize: '15vw', whiteSpace: 'nowrap', zIndex: 0, color: '#1a1a1a', pointerEvents: 'none' }}>
                        FEEDBACK
                    </div>
                    
                    <Container className="text-center position-relative z-1 py-5">
                        <div className="testimonial-slider-container">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={testimonials[currentTesti].id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="glass-card p-5 text-start mx-auto"
                                    style={{ maxWidth: '850px' }}
                                >
                                    <div className="mb-4 text-orange display-4" style={{ lineHeight: 0.5 }}>"</div>
                                    <h3 className="fw-light mb-5 text-white display-6 lh-base">
                                        {testimonials[currentTesti].content}
                                    </h3>
                                    
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            {testimonials[currentTesti].client_image ? (
                                                <img 
                                                    src={optimizeImage(testimonials[currentTesti].client_image, 120, 120)} 
                                                    className="rounded-circle object-fit-cover shadow-lg" 
                                                    width="60" 
                                                    height="60" 
                                                    alt={testimonials[currentTesti].client_name} 
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="rounded-circle bg-orange bg-opacity-20 d-flex align-items-center justify-content-center text-orange shadow-lg" style={{ width: '60px', height: '60px' }}>
                                                    <FaStar size={24} />
                                                </div>
                                            )}
                                            <div>
                                                <h5 className="mb-0 fw-bold text-white">{testimonials[currentTesti].client_name}</h5>
                                                <p className="small text-orange mb-0 spacing-1 text-uppercase">{testimonials[currentTesti].client_role || 'Client'}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Simple Navigation Controls */}
                                        {testimonials.length > 1 && (
                                            <div className="d-none d-md-flex gap-2">
                                                <Button 
                                                    variant="outline-light" 
                                                    size="sm" 
                                                    className="rounded-circle p-2 opacity-50 hover-opacity-100"
                                                    onClick={() => setCurrentTesti(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                                                >
                                                    <FaArrowLeft size={16}/>
                                                </Button>
                                                <Button 
                                                    variant="outline-light" 
                                                    size="sm" 
                                                    className="rounded-circle p-2 opacity-50 hover-opacity-100"
                                                    onClick={() => setCurrentTesti(prev => (prev + 1) % testimonials.length)}
                                                >
                                                    <FaArrowRight size={16}/>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* Pagination Dots */}
                            {testimonials.length > 1 && (
                                <div className="d-flex justify-content-center gap-2 mt-5">
                                    {testimonials.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentTesti(idx)}
                                            className={`border-0 rounded-pill transition-all ${currentTesti === idx ? 'bg-orange' : 'bg-secondary opacity-25'}`}
                                            style={{ 
                                                width: currentTesti === idx ? '30px' : '8px', 
                                                height: '8px',
                                                padding: 0
                                            }}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </Container>
                    </>
                ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 w-100 py-5">
                        <p className="text-secondary opacity-50">Loading testimonials...</p>
                    </div>
                )}
            </section>

            {/* Latest Blog Posts */}
            <section className="py-5 bg-black border-top border-secondary border-opacity-10" style={{ minHeight: '700px' }}>
                {blogPosts.length > 0 ? (
                    <Container className="py-5">
                        <div className="d-flex justify-content-between align-items-end mb-5">
                            <div>
                                <h6 className="text-orange fw-bold spacing-2 text-uppercase mb-2">The Journal</h6>
                                <h2 className="display-5 fw-bold text-white mb-0">LATEST <span className="text-white opacity-25">STORIES</span></h2>
                            </div>
                            <Button href="/blog" variant="outline-light" className="d-none d-md-block px-4 py-2 text-decoration-none">VIEW ALL ARTICLES</Button>
                        </div>

                        <Row className="g-4">
                            {blogPosts.map((post, idx) => (
                                <Col key={post.id} lg={4} md={6}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <div 
                                            className="glass-card h-100 overflow-hidden border-0 hover-scale" 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={() => window.location.href = `/blog/${post.slug}`}
                                        >
                                            <div style={{ height: '220px', overflow: 'hidden' }}>
                                                <img 
                                                    src={optimizeImage(post.featured_image, 400, 220)} 
                                                    width="400"
                                                    height="220"
                                                    alt={post.title} 
                                                    className="w-100 h-100 object-fit-cover transition-transform"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="p-4 bg-transparent">
                                                <p className="text-orange small fw-bold mb-2">
                                                    {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <h4 className="text-white fw-bold mb-3 line-clamp-2">{post.title}</h4>
                                                <p className="text-white-50 small line-clamp-3 mb-4">
                                                    {post.content.substring(0, 120)}...
                                                </p>
                                                <div className="text-orange small fw-bold spacing-1">READ MORE →</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                        <div className="d-md-none text-center mt-5">
                            <Button href="/blog" variant="outline-light" className="w-100 text-decoration-none">VIEW ALL ARTICLES</Button>
                        </div>
                    </Container>
                ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 w-100 py-5">
                        <p className="text-secondary opacity-50">Loading journal entries...</p>
                    </div>
                )}
            </section>

            <style>{`
                /* Styles moved to index.css */
            `}</style>
        </div>
    );
};

export default Home;

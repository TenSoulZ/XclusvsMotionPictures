import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaFacebook, FaCircle } from 'react-icons/fa';
import api from '../utils/api';
import logoWhite from '../assets/logos/xmp-logo-white.png';

/**
 * Navigation component - Fixed top navigation bar.
 * Handles scroll effects, responsive menu, and live broadcast indicator.
 */
const Navigation = () => {
    const [scrolled, setScrolled] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const checkLiveStatus = async () => {
            try {
                const res = await api.get('/live/');
                const streams = Array.isArray(res.data) ? res.data : res.data.results || [];
                setIsLive(streams.some(s => s.is_live));
            } catch (error) {
                console.error("Error checking live status:", error);
            }
        };

        checkLiveStatus();
        const interval = setInterval(checkLiveStatus, 60000); // Check every minute
        
        const handleScroll = () => {
            // Update scrolled state
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Update scroll progress
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolledPct = (winScroll / height) * 100;
            setScrollProgress(scrolledPct);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    return (
        <>
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
        <Navbar 
            expand="lg" 
            fixed="top" 
            expanded={expanded}
            onToggle={(nextExpanded) => setExpanded(nextExpanded)}
            className={`${scrolled || location.pathname !== '/' || expanded ? 'bg-black shadow-lg rounded-bottom-4' : 'bg-transparent'} py-3`} 
            variant="dark" 
            style={{ transition: '0.4s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center" aria-label="Xclusvs Motion Pictures Home">
                    <img 
                        src={logoWhite} 
                        alt="XMP Logo" 
                        height="40" 
                        width="114"
                        className="d-inline-block align-top"
                        loading="eager"
                        style={{ objectFit: 'contain' }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" aria-label="Toggle navigation menu" />
                <Navbar.Collapse id="basic-navbar-nav" className="mobile-menu-glass">
                    <Nav className="ms-auto align-items-center gap-2 mt-3 mt-lg-0">
                        <Nav.Link as={Link} to="/" active={location.pathname === '/'} onClick={() => setExpanded(false)}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/about" active={location.pathname === '/about'} onClick={() => setExpanded(false)}>About</Nav.Link>
                        <Nav.Link as={Link} to="/services" active={location.pathname === '/services'} onClick={() => setExpanded(false)}>Services</Nav.Link>
                        
                        <NavDropdown 
                            title="Portfolio" 
                            id="portfolio-dropdown" 
                            menuVariant="dark"
                            className={location.pathname === '/gallery' || location.pathname === '/videos' ? 'active' : ''}
                        >
                            <NavDropdown.Item as={Link} to="/videos" active={location.pathname === '/videos'} onClick={() => setExpanded(false)}>Videos</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/gallery" active={location.pathname === '/gallery'} onClick={() => setExpanded(false)}>Gallery</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link as={Link} to="/blog" active={location.pathname.startsWith('/blog')} onClick={() => setExpanded(false)}>Blog</Nav.Link>
                        <Nav.Link as={Link} to="/live" active={location.pathname === '/live'} onClick={() => setExpanded(false)} className="d-flex align-items-center gap-2">
                            Live Broadcast
                            {isLive && (
                                <span className="badge bg-danger rounded-circle p-1 pulse-dot">
                                    <span className="visually-hidden">Live Now</span>
                                </span>
                            )}
                        </Nav.Link>
                        <Nav.Link as={Link} to="/faq" active={location.pathname === '/faq'} onClick={() => setExpanded(false)}>FAQ</Nav.Link>
                        <Nav.Link as={Link} to="/contact" active={location.pathname === '/contact'} onClick={() => setExpanded(false)}>Contact</Nav.Link>
                        <div className="d-flex ms-3 gap-3">

                            <a 
                                href={import.meta.env.VITE_YOUTUBE_URL || "https://www.youtube.com/@xclusvsmotionpictures"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-white"
                                aria-label="Subscribe to our YouTube channel"
                            >
                                <FaYoutube size={20} />
                            </a>
                            <a 
                                href={import.meta.env.VITE_FACEBOOK_URL || "https://www.facebook.com/xclusvsmotionpictures/"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-white"
                                aria-label="Like us on Facebook"
                            >
                                <FaFacebook size={20} />
                            </a>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>

        </Navbar>
        </>
    );
};

export default Navigation;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Badge } from 'react-bootstrap';
import api from '../utils/api';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { getEmbedUrl } from '../utils/videoUtils';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import VideoThumbnail from '../components/VideoThumbnail';
import { useToast } from '../contexts/ToastContext';
import { FaPlay, FaSearch, FaTimes, FaShareAlt } from 'react-icons/fa';
import '../components/Skeleton.css';

import heroBg from '../assets/pictures/hero-bg-pic.webp'; // Using the established hero background

/**
 * Videos component - Displays a filterable library of video projects.
 * Supports categories, search, pagination, and a modal video player.
 */
const Videos = () => {
    const toast = useToast();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleShare = async (video) => {
        if (!video) return;
        
        const shareData = {
            title: `${video.title} | Xclusvs Motion Pictures`,
            text: `Check out this film: ${video.title}`,
            url: window.location.href, // Or a specific link if you have deep links
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            if (error.name !== 'AbortError') {
                toast.error("Sharing failed. Link copied to clipboard.");
                navigator.clipboard.writeText(window.location.href);
            }
        }
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 12;

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories/');
                setCategories(res.data.results || res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);
    
    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    category__name: selectedCategory !== 'All' ? selectedCategory : undefined,
                    search: searchQuery || undefined
                };
                
                const response = await api.get('/videos/', { params });
                const data = response.data.results || response.data;
                const count = response.data.count || (Array.isArray(data) ? data.length : 0);
                
                setVideos(data);
                setTotalCount(count);
            } catch (error) {
                console.error("Error fetching videos:", error);
                toast.error("Failed to load videos.");
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [currentPage, selectedCategory, searchQuery, toast]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="videos-page overflow-hidden">
            <SEO 
                title="Video Portfolio" 
                description="Cinematic storytelling and professional video production. Watch our latest projects and films."
                url="/videos"
            />
            
            {/* Parallax Hero Section */}
            <header className="position-relative vh-50 d-flex align-items-center justify-content-center overflow-hidden" style={{ minHeight: '60vh' }}>
                <motion.div 
                    style={{ y: y1 }}
                    className="position-absolute w-100 h-100"
                >
                    <div 
                        style={{ 
                            backgroundImage: `url(${heroBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '120%', 
                            width: '100%',
                            filter: 'brightness(0.4)'
                        }} 
                    />
                </motion.div>
                
                <Container className="position-relative text-center text-white z-2 pt-5">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="glass-card p-5 mx-auto"
                        style={{ maxWidth: '800px' }}
                    >
                        <h6 className="text-orange fw-bold spacing-3 text-uppercase mb-3">Our Work</h6>
                        <h1 className="display-2 fw-bold mb-4">VIDEO <span className="text-transparent bg-clip-text" style={{ background: 'var(--brand-orange-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PORTFOLIO</span></h1>
                        <p className="lead fs-5 text-white-50 mx-auto mb-0" style={{ maxWidth: '600px' }}>
                            Explore our collection of cinematic stories, commercials, and events captured with passion.
                        </p>
                    </motion.div>
                </Container>
            </header>

            <Container className="py-5 position-relative z-2" style={{ marginTop: '-50px' }}>
                {/* Filters and Search Bar - Floating Glass Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-4 rounded-4 mb-5 shadow-lg border-top border-orange border-opacity-25"
                >
                    <Row className="align-items-center g-4">
                        <Col lg={8}>
                            <div className="d-flex flex-wrap gap-2">
                                <Button 
                                    variant={selectedCategory === 'All' ? 'brand' : 'outline-light'}
                                    className={`rounded-pill px-4 ${selectedCategory === 'All' ? 'shadow-sm' : 'border-0 opacity-75'}`}
                                    onClick={() => handleCategoryChange('All')}
                                    aria-pressed={selectedCategory === 'All'}
                                    aria-label="Show all videos"
                                >
                                    All
                                </Button>
                                {categories.map(cat => (
                                    <Button 
                                        key={cat.id}
                                        variant={selectedCategory === cat.name ? 'brand' : 'outline-light'}
                                        className={`rounded-pill px-4 ${selectedCategory === cat.name ? 'shadow-sm' : 'border-0 opacity-75'}`}
                                        onClick={() => handleCategoryChange(cat.name)}
                                        aria-pressed={selectedCategory === cat.name}
                                        aria-label={`Filter by ${cat.name}`}
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="search-bar bg-black bg-opacity-50 d-flex align-items-center px-3 py-2 rounded-pill border border-secondary border-opacity-25">
                                <FaSearch className="text-secondary me-2" />
                                <input 
                                    type="text" 
                                    placeholder="Search videos..." 
                                    className="bg-transparent border-0 text-white w-100 outline-none"
                                    style={{ outline: 'none' }}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    aria-label="Search videos"
                                />
                                {searchQuery && (
                                    <FaTimes 
                                        className="text-secondary cursor-pointer ms-2" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSearchQuery('')} 
                                        aria-label="Clear search"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && setSearchQuery('')}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </motion.div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <Row key="loader">
                            <Col md={6} className="mb-4">
                                <Skeleton type="video" count={2} />
                            </Col>
                            <Col md={6} className="mb-4">
                                <Skeleton type="video" count={2} />
                            </Col>
                        </Row>
                    ) : (
                        <motion.div 
                            key="content"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Row>
                                {videos.length > 0 ? videos.map((video) => (
                                    <Col md={6} lg={4} key={video.id} className="mb-4">
                                        <motion.div 
                                            variants={itemVariants}
                                            className="video-card position-relative overflow-hidden rounded-4 glass-card p-0 border-0 shadow-sm h-100 glow-hover"
                                            onClick={() => setSelectedVideo(video)}
                                            onKeyDown={(e) => e.key === 'Enter' && setSelectedVideo(video)}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Watch ${video.title}`}
                                        >
                                            <div className="overflow-hidden position-relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                                                 <div className="position-absolute top-0 start-0 w-100 h-100">
                                                    <VideoThumbnail video={video} className="img-cover w-100 h-100" style={{ filter: 'brightness(0.8)', transition: 'transform 0.5s ease' }} />
                                                 </div>
                                                
                                                <div className="position-absolute top-50 start-50 translate-middle text-center z-1">
                                                    <div className="play-btn-circle glass-card rounded-circle p-3 mb-2 hover-scale" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <FaPlay className="ms-1 text-white" />
                                                    </div>
                                                </div>
                                                
                                                {/* Hover Overlay */}
                                                <div className="video-card-overlay position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-50 opacity-0 transition-opacity d-flex align-items-end p-4">
                                                     <div className="w-100">
                                                        <Badge bg="orange" className="mb-2 rounded-pill px-3 py-2 text-white border-0">
                                                            {video.category?.name || 'Video'}
                                                        </Badge>
                                                        <h5 className="text-white mb-0 fw-bold">{video.title}</h5>
                                                     </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-dark d-block d-md-none"> {/* Mobile Only Details underneath */}
                                                <h6 className="text-white mb-1">{video.title}</h6>
                                                <small className="text-secondary">{video.category?.name}</small>
                                            </div>
                                        </motion.div>
                                    </Col>
                                )) : (
                                    <Col xs={12} className="text-center py-5">
                                        <div className="glass-card p-5 d-inline-block rounded-4">
                                            <p className="text-secondary fs-5 mb-0">No videos found matching your criteria.</p>
                                            <Button variant="link" className="text-orange mt-2" onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}>Clear Filters</Button>
                                        </div>
                                    </Col>
                                )}
                            </Row>

                            <Pagination 
                                currentPage={currentPage}
                                totalCount={totalCount}
                                pageSize={pageSize}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>

            <Modal show={!!selectedVideo} onHide={() => setSelectedVideo(null)} centered size="xl" contentClassName="bg-black border-0 rounded-4 overflow-hidden">
                <Modal.Body className="p-0 position-relative">
                    <div className="ratio ratio-16x9">
                        {selectedVideo && (
                            <iframe 
                                src={getEmbedUrl(selectedVideo.video_url) + "?autoplay=1"} 
                                title={selectedVideo.title} 
                                allowFullScreen
                                allow="autoplay; encrypted-media"
                                loading="lazy"
                                className="border-0"
                            ></iframe>
                        )}
                    </div>
                </Modal.Body>
                <div className="bg-dark p-3 d-flex justify-content-between align-items-center">
                     <div className="d-flex align-items-center gap-3">
                        <h5 className="text-white mb-0">{selectedVideo?.title}</h5>
                        <Button 
                            variant="outline-light" 
                            size="sm" 
                            className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                            style={{ width: '35px', height: '35px' }}
                            onClick={() => handleShare(selectedVideo)}
                        >
                            <FaShareAlt size={14} />
                        </Button>
                     </div>
                    <Button variant="outline-secondary" size="sm" className="rounded-pill px-4" onClick={() => setSelectedVideo(null)}>Close Player</Button>
                </div>
            </Modal>
            
            <style>{`
                .hover-scale { transition: transform 0.3s ease; }
                .video-card:hover .hover-scale { transform: scale(1.1); }
                .video-card:hover .video-card-overlay { opacity: 1 !important; }
                .video-card:hover img { transform: scale(1.05) !important; filter: brightness(0.6) !important; }
            `}</style>
        </div>
    );
};

export default Videos;

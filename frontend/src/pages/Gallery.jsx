import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, Button, Badge } from 'react-bootstrap';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { FaSearch, FaTimes, FaShareAlt } from 'react-icons/fa';
import '../components/Skeleton.css';

/**
 * Gallery component - Displays a masonry-style grid of photography projects.
 * Features category filtering, search, pagination, and a full-screen lightbox.
 */
const Gallery = () => {
    const toast = useToast();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleShare = async (photo) => {
        if (!photo) return;
        
        const shareData = {
            title: `${photo.title} | Xclusvs Motion Pictures`,
            text: `Check out this photo: ${photo.title}`,
            url: window.location.href,
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
        const fetchPhotos = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    category__name: selectedCategory !== 'All' ? selectedCategory : undefined,
                    search: searchQuery || undefined
                };
                
                const response = await api.get('/photos/', { params });
                const data = response.data.results || response.data;
                const count = response.data.count || (Array.isArray(data) ? data.length : 0);
                
                setPhotos(data);
                setTotalCount(count);
            } catch (error) {
                console.error("Error fetching photos:", error);
                toast.error("Failed to load gallery.");
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, [currentPage, selectedCategory, searchQuery, toast]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleNext = () => {
        const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
        if (currentIndex < photos.length - 1) {
            setSelectedPhoto(photos[currentIndex + 1]);
        } else {
            setSelectedPhoto(photos[0]); // Loop to beginning
        }
    };

    const handlePrev = () => {
        const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
        if (currentIndex > 0) {
            setSelectedPhoto(photos[currentIndex - 1]);
        } else {
            setSelectedPhoto(photos[photos.length - 1]); // Loop to end
        }
    };

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedPhoto) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') setSelectedPhoto(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhoto, photos]);


    return (
        <div className="gallery-page pt-5 mt-5">
            <SEO 
                title="Photo Gallery" 
                description="Explore our high-quality photography portfolio featuring weddings, events, and commercial shoots."
                url="/gallery"
            />
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h2 className="display-4 fw-bold">Photo <span className="text-orange">Gallery</span></h2>
                    <p className="lead text-secondary">Capturing moments in their purest form.</p>
                </div>

                {/* Filters and Search */}
                <div className="mb-5">
                    <Row className="align-items-center g-4">
                        <Col lg={8}>
                            <div className="d-flex flex-wrap gap-2">
                                <Button 
                                    variant={selectedCategory === 'All' ? 'brand' : 'outline-light'}
                                    className="rounded-pill px-4"
                                    onClick={() => handleCategoryChange('All')}
                                    aria-pressed={selectedCategory === 'All'}
                                    aria-label="Show all photos"
                                >
                                    All
                                </Button>
                                {categories.map(cat => (
                                    <Button 
                                        key={cat.id}
                                        variant={selectedCategory === cat.name ? 'brand' : 'outline-light'}
                                        className="rounded-pill px-4"
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
                            <div className="search-bar glass-card d-flex align-items-center px-3 py-2 rounded-pill">
                                <FaSearch className="text-secondary me-2" />
                                <input 
                                    type="text" 
                                    placeholder="Search gallery..." 
                                    className="bg-transparent border-0 text-white w-100 outline-none"
                                    style={{ outline: 'none' }}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                {searchQuery && (
                                    <FaTimes 
                                        className="text-secondary cursor-pointer ms-2" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSearchQuery('')} 
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div key="loader" className="masonry-grid">
                            <Skeleton type="photo" count={6} />
                        </div>
                    ) : (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="masonry-grid">
                                {photos.length > 0 ? photos.map(photo => (
                                    <motion.div 
                                        layout
                                        key={photo.id} 
                                        className="masonry-item mb-4" 
                                        onClick={() => setSelectedPhoto(photo)}
                                        onKeyDown={(e) => e.key === 'Enter' && setSelectedPhoto(photo)}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`View ${photo.title}`}
                                    >
                                        <div className="photo-card position-relative overflow-hidden rounded-4 glass-card p-2 border-0 shadow-sm">
                                            <img 
                                                src={photo.image} 
                                                alt={photo.title} 
                                                className="img-fluid rounded-3 w-100" 
                                                loading="lazy"
                                                style={{ transition: '0.5s', cursor: 'zoom-in', aspectRatio: 'auto' }}
                                            />
                                            <div className="photo-overlay position-absolute bottom-0 start-0 w-100 p-4 pb-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', opacity: 0, transition: '0.3s' }}>
                                                <h5 className="text-white mb-0">{photo.title}</h5>
                                                <Badge bg="orange" className="mt-2 fw-normal">
                                                    {photo.category_name || photo.category?.name || 'Photo'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="w-100 text-center py-5">
                                        <p className="text-secondary fs-5">No photos found matching your criteria.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5">
                                <Pagination 
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    pageSize={pageSize}
                                    onPageChange={(page) => {
                                        setCurrentPage(page);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
            
            <Modal show={!!selectedPhoto} onHide={() => setSelectedPhoto(null)} centered size="xl" contentClassName="bg-transparent border-0">
                <Modal.Body 
                    className="p-0 position-relative"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <Button 
                        variant="link" 
                        className="position-absolute top-0 end-0 m-3 text-white fs-4 z-index-10 d-none d-md-block" 
                        onClick={() => setSelectedPhoto(null)}
                        style={{ zIndex: 1050, opacity: 0.7 }}
                    >
                        <FaTimes />
                    </Button>
                    
                    {selectedPhoto && (
                        <div className="text-center position-relative">
                            {/* Navigation Buttons */}
                            <Button 
                                variant="link" 
                                className="position-absolute top-50 start-0 translate-middle-y text-white fs-1 d-none d-md-block"
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                style={{ zIndex: 1050, opacity: 0.5, left: '-50px' }}
                            >
                                <span className="p-3">‹</span>
                            </Button>
                            
                            <Button 
                                variant="link" 
                                className="position-absolute top-50 end-0 translate-middle-y text-white fs-1 d-none d-md-block"
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                style={{ zIndex: 1050, opacity: 0.5, right: '-50px' }}
                            >
                                <span className="p-3">›</span>
                            </Button>

                            <motion.img 
                                key={selectedPhoto.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={selectedPhoto.image} 
                                alt={selectedPhoto.title} 
                                className="img-fluid rounded-4 shadow-lg" 
                                style={{ maxHeight: '85vh' }}
                            />
                            
                            <div className="glass-card mt-3 p-3 d-inline-flex align-items-center gap-3 rounded-pill position-absolute bottom-0 start-50 translate-middle-x mb-4">
                                <span className="text-white fw-bold px-3 d-none d-sm-block">{selectedPhoto.title}</span>
                                <Button 
                                    variant="brand" 
                                    className="rounded-circle p-2" 
                                    style={{ width: '45px', height: '45px' }}
                                    onClick={() => handleShare(selectedPhoto)}
                                    title="Share Photo"
                                >
                                    <FaShareAlt />
                                </Button>
                                <Button 
                                    variant="outline-light" 
                                    className="rounded-circle p-2 d-md-none" 
                                    style={{ width: '45px', height: '45px' }}
                                    onClick={() => setSelectedPhoto(null)}
                                >
                                    <FaTimes />
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Gallery;

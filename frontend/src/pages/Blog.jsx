import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import Skeleton from '../components/Skeleton';
import { FaSearch, FaCalendarAlt, FaUser, FaTimes } from 'react-icons/fa';

/**
 * Blog component - Displays a searchable list of blog articles.
 */
const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await api.get('/blog/', { params: { search: searchTerm } });
                setPosts(res.data.results || res.data);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchPosts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <div className="blog-page bg-black py-5 min-vh-100 mt-5">
            <SEO 
                title="Blog" 
                description="Stay updated with the latest news, tutorials, and behind-the-scenes stories from Xclusvs Motion Pictures."
                url="/blog"
            />
            
            <Container className="py-5">
                <header className="text-center mb-5">
                    <motion.h6 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-orange fw-bold spacing-2 text-uppercase mb-2"
                    >
                        Journal
                    </motion.h6>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="display-3 fw-bold text-white mb-4"
                    >
                        LATEST <span className="text-secondary opacity-50">STORIES</span>
                    </motion.h1>
                    
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <InputGroup className="glass-card overflow-hidden border-0 p-1">
                                    <InputGroup.Text className="bg-transparent border-0 text-secondary">
                                        <FaSearch aria-hidden="true" />
                                    </InputGroup.Text>
                                    <Form.Control 
                                        placeholder="Search articles..." 
                                        className="bg-transparent border-0 text-white shadow-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        aria-label="Search blog articles"
                                    />
                                    {searchTerm && (
                                        <Button 
                                            variant="link" 
                                            className="text-secondary p-2 d-flex align-items-center"
                                            onClick={() => setSearchTerm('')}
                                            aria-label="Clear search"
                                        >
                                            <FaTimes size={14} />
                                        </Button>
                                    )}
                                </InputGroup>
                            </motion.div>
                        </Col>
                    </Row>
                </header>

                <Row className="g-4" role="list" aria-label="Blog posts list">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <Col key={i} lg={4} md={6}>
                                <Skeleton type="blog" />
                            </Col>
                        ))
                    ) : (
                        posts.length > 0 ? (
                            posts.map((post, idx) => (
                                <Col key={post.id} lg={4} md={6} role="listitem">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card 
                                            as={Link} 
                                            to={`/blog/${post.slug}`} 
                                            className="glass-card h-100 text-decoration-none border-0 overflow-hidden hover-scale"
                                            role="link"
                                            tabIndex={0}
                                            aria-label={`Read more about ${post.title}`}
                                            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/blog/${post.slug}`)}
                                        >
                                            <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                                                <Card.Img 
                                                    variant="top" 
                                                    src={post.featured_image} 
                                                    className="w-100 h-100 object-fit-cover"
                                                    alt={`Featured image for ${post.title}`}
                                                    loading="lazy"
                                                />
                                                <div className="position-absolute top-0 end-0 m-3">
                                                    <Badge bg="orange" className="p-2">Read Article</Badge>
                                                </div>
                                            </div>
                                            <Card.Body className="p-4 bg-transparent">
                                                <div className="d-flex gap-3 text-secondary small mb-3">
                                                    <span className="d-flex align-items-center gap-1">
                                                        <FaCalendarAlt size={12} aria-hidden="true"/> 
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="d-flex align-items-center gap-1">
                                                        <FaUser size={12} aria-hidden="true"/> 
                                                        {post.author_name}
                                                    </span>
                                                </div>
                                                <Card.Title className="h4 fw-bold text-white mb-3 line-clamp-2">{post.title}</Card.Title>
                                                <Card.Text className="text-secondary small line-clamp-3 mb-4">
                                                    {post.content.substring(0, 150)}...
                                                </Card.Text>
                                                <div className="mt-auto">
                                                    <span className="p-0 text-orange fw-bold text-decoration-none spacing-1">
                                                        CONTINUE READING →
                                                    </span>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center py-5">
                                <h3 className="text-secondary opacity-50 mb-4">No articles found.</h3>
                                {searchTerm && (
                                    <Button 
                                        variant="brand" 
                                        className="rounded-pill px-4"
                                        onClick={() => setSearchTerm('')}
                                        aria-label="Clear search"
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </Col>
                        )
                    )}
                </Row>
            </Container>
        </div>
    );
};

// Simple Badge component since BS defaults might be boring
const Badge = ({ children, bg, className }) => (
    <span className={`badge ${bg === 'orange' ? 'bg-orange' : 'bg-secondary'} ${className}`}>
        {children}
    </span>
);

export default Blog;

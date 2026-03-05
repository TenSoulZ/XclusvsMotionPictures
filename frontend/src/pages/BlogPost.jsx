import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import Skeleton from '../components/Skeleton';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import DOMPurify from 'dompurify';

/**
 * BlogPost component - Displays the full content of a single blog article.
 */
const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState([]);

    const handleShare = async () => {
        if (!post) return;
        
        const shareData = {
            title: `${post.title} | Xclusvs Motion Pictures`,
            text: post.content.substring(0, 100) + '...',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Post shared successfully!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.info("Link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            if (error.name !== 'AbortError') {
                toast.error("Sharing failed. Link copied to clipboard as a fallback.");
                navigator.clipboard.writeText(window.location.href);
            }
        }
    };
	
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const [postRes, allRes] = await Promise.all([
                    api.get(`/blog/${slug}/`),
                    api.get('/blog/')
                ]);
                setPost(postRes.data);
                
                const otherPosts = (allRes.data.results || allRes.data)
                    .filter(p => p.slug !== slug)
                    .slice(0, 3);
                setRelatedPosts(otherPosts);
            } catch (error) {
                console.error("Error fetching blog data:", error);
                if (error.response?.status === 404) {
                    navigate('/blog');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="blog-post-detail bg-black min-vh-100 mt-5 pt-5">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Skeleton type="base" className="vh-50 mb-4" />
                            <Skeleton type="text" className="h1 w-75 mb-4" />
                            <Skeleton type="text" count={10} className="mb-3" />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
    if (!post) return null;

    const postSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.featured_image,
        "datePublished": post.created_at,
        "dateModified": post.updated_at || post.created_at,
        "author": {
            "@type": "Person",
            "name": post.author_name
        },
        "publisher": {
            "@type": "Organization",
            "name": "Xclusvs Motion Pictures",
            "logo": {
                "@type": "ImageObject",
                "url": "https://xclusvsmotionpictures.com/logo.png"
            }
        },
        "description": post.content.substring(0, 160)
    };

    return (
        <div className="blog-post-detail bg-black min-vh-100 mt-5 pt-5">
            <SEO 
                title={post.title} 
                description={post.content.substring(0, 160)}
                url={`/blog/${post.slug}`}
                image={post.featured_image}
                schemaData={postSchema}
            />
            
            {/* Parallax Hero Header */}
            <header className="position-relative vh-60 overflow-hidden" style={{ minHeight: '500px' }}>
                <div 
                    className="position-absolute w-100 h-100"
                    style={{
                        backgroundImage: `url(${post.featured_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.4)'
                    }}
                />
                <Container className="position-relative h-100 d-flex flex-column justify-content-end pb-5 z-1">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Button 
                            as={Link} 
                            to="/blog" 
                            variant="link" 
                            className="text-orange text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 spacing-1 fw-bold"
                        >
                            <FaArrowLeft /> BACK TO JOURNAL
                        </Button>
                        <h1 className="display-2 fw-bold text-white mb-4" style={{ maxWidth: '900px' }}>{post.title}</h1>
                        <div className="d-flex align-items-center gap-4 text-secondary small">
                             <span className="d-flex align-items-center gap-2"><FaCalendarAlt className="text-orange"/> {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                             <span className="d-flex align-items-center gap-2"><FaUser className="text-orange"/> {post.author_name}</span>
                        </div>
                    </motion.div>
                </Container>
            </header>

            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <motion.article
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="blog-content text-white fs-5 lh-lg"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                        />

                        <div className="d-flex justify-content-between align-items-center mt-5">
                            <Button 
                                variant="dark" 
                                className="rounded-circle border-secondary" 
                                aria-label="Share this post"
                                onClick={handleShare}
                            >
                                <FaShareAlt size={16}/>
                            </Button>
                            <Button as={Link} to="/contact" variant="brand">WORK WITH US</Button>
                        </div>
                    </Col>
                </Row>

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <div className="mt-5 pt-5 border-top border-secondary border-opacity-10">
                        <h3 className="fw-bold mb-4 text-white">RELATED <span className="opacity-25">STORIES</span></h3>
                        <Row className="g-4">
                            {relatedPosts.map((rPost) => (
                                <Col key={rPost.id} md={4}>
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        className="glass-card overflow-hidden h-100 border-0"
                                        onClick={() => navigate(`/blog/${rPost.slug}`)}
                                        style={{ cursor: 'pointer' }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Read related story: ${rPost.title}`}
                                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/blog/${rPost.slug}`)}
                                    >
                                        <div style={{ height: '200px' }}>
                                            <img 
                                                src={rPost.featured_image} 
                                                alt={rPost.title} 
                                                className="w-100 h-100 object-fit-cover" 
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-orange small fw-bold mb-1">
                                                {new Date(rPost.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <h6 className="text-white fw-bold mb-0 line-clamp-2">{rPost.title}</h6>
                                        </div>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default BlogPost;

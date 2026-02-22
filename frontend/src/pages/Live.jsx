import React from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBroadcastTower, FaClock, FaCircle, FaShareAlt, FaPlay } from 'react-icons/fa';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { getEmbedUrl } from '../utils/videoUtils';
import { useToast } from '../contexts/ToastContext';

/**
 * Live component - Displays active and upcoming live streams.
 * Automatically polls for stream status updates every 30 seconds.
 */
const Live = () => {
    const toast = useToast();
    const [streams, setStreams] = React.useState([]);
    const [selectedStream, setSelectedStream] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const handleShare = async () => {
        if (!selectedStream) return;
        
        const shareData = {
            title: `Live: ${selectedStream.title} | Xclusvs Motion Pictures`,
            text: selectedStream.description,
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

    const fetchLiveStreams = React.useCallback(async () => {
        try {
            const res = await api.get('/live/');
            const allStreams = res.data.results || res.data;
            const activeStreams = allStreams.filter(s => s.is_live);
            
            setStreams(activeStreams);
            
            setSelectedStream(currentSelected => {
                // If we don't have a selected stream yet, or the selected one is no longer live
                if (!currentSelected || !activeStreams.find(s => s.id === currentSelected.id)) {
                    return activeStreams[0] || allStreams[0] || null;
                }
                return currentSelected;
            });
        } catch (error) {
            console.error("Error fetching live streams:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchLiveStreams();
        const interval = setInterval(fetchLiveStreams, 30000);
        return () => clearInterval(interval);
    }, [fetchLiveStreams]);

    if (loading) return <Loader fullPage />;

    return (
        <div className="live-page pt-5 bg-black text-white min-vh-100">
            <SEO 
                title={selectedStream?.is_live ? `Live: ${selectedStream.title}` : "Live Stream"} 
                description="Join our live broadcasts and events. Experience cinematic live streaming by Xclusvs Motion Pictures."
                url="/live"
            />
            
            <Container className="py-5 mt-5">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="preview-container position-relative mb-5">
                            <AnimatePresence mode="wait">
                                {selectedStream ? (
                                    <motion.div
                                        key={selectedStream.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="glass-card overflow-hidden border-0 shadow-lg"
                                    >
                                        <div className="ratio ratio-16x9">
                                            {selectedStream.is_live ? (
                                                <iframe 
                                                    src={`${getEmbedUrl(selectedStream.stream_url)}${getEmbedUrl(selectedStream.stream_url).includes('?') ? '&' : '?'}autoplay=1`} 
                                                    title={selectedStream.title}
                                                    allowFullScreen
                                                    allow="autoplay; encrypted-media"
                                                    loading="lazy"
                                                    className="border-0"
                                                ></iframe>
                                            ) : (
                                                <div className="d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-50">
                                                    <div className="text-center p-5">
                                                        <FaBroadcastTower size={80} className="text-secondary opacity-25 mb-4" />
                                                        <h2 className="fw-bold mb-3">STREAM IS CURRENTLY <span className="text-secondary">OFFLINE</span></h2>
                                                        {selectedStream.scheduled_at && (
                                                            <p className="text-orange lead">
                                                                <FaClock className="me-2" />
                                                                Next stream scheduled for: {new Date(selectedStream.scheduled_at).toLocaleString()}
                                                            </p>
                                                        )}
                                                        <Button variant="outline-light" className="mt-4 px-4" onClick={fetchLiveStreams}>REFRESH STATUS</Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4 p-md-5 bg-transparent border-top border-secondary border-opacity-10">
                                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                                                <div>
                                                    {selectedStream.is_live && (
                                                        <Badge bg="danger" className="mb-2 px-3 py-2 pulse-animation d-inline-flex align-items-center">
                                                            <FaCircle className="me-2 small" /> LIVE NOW
                                                        </Badge>
                                                    )}
                                                    <h1 className="fw-bold mb-0 display-5">{selectedStream.title}</h1>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <Button 
                                                        variant="outline-light" 
                                                        className="rounded-circle p-3 d-flex align-items-center justify-content-center" 
                                                        style={{ width: '50px', height: '50px' }}
                                                        onClick={handleShare}
                                                    >
                                                        <FaShareAlt />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="lead text-secondary opacity-75">{selectedStream.description}</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="glass-card p-5 text-center"
                                    >
                                        <FaBroadcastTower size={100} className="text-secondary opacity-25 mb-4" />
                                        <h2 className="fw-bold">No live events scheduled at the moment.</h2>
                                        <p className="text-secondary">Check back later for upcoming broadcasts.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Multiple Streams Selector */}
                        {streams.length > 1 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-5"
                            >
                                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <span className="text-orange"><FaBroadcastTower /></span>
                                    Other Live Channels
                                </h4>
                                <Row className="g-4">
                                    {streams.filter(s => s.id !== selectedStream?.id).map(s => (
                                        <Col key={s.id} md={6} lg={4}>
                                            <div 
                                                className="glass-card p-3 h-100 transition-all hover-transform cursor-pointer border-0 shadow-sm"
                                                onClick={() => setSelectedStream(s)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="ratio ratio-16x9 mb-3 rounded-3 overflow-hidden bg-dark">
                                                    <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                                                        <FaPlay className="text-white opacity-50 fs-2" />
                                                    </div>
                                                    <div className="position-absolute top-0 start-0 p-2">
                                                        <Badge bg="danger" className="small pulse-animation">LIVE</Badge>
                                                    </div>
                                                </div>
                                                <h6 className="fw-bold text-white mb-1 text-truncate">{s.title}</h6>
                                                <p className="small text-secondary mb-0 text-truncate">{s.description}</p>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </motion.div>
                        )}

                        <div className="text-center py-5">
                            <h3 className="fw-bold mb-4">Want to stream your own event?</h3>
                            <p className="text-secondary mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                                From weddings and conferences to concert performances, we provide professional multi-camera live streaming solutions that bring your event to the global audience.
                            </p>
                            <Button href="/contact" variant="brand" className="px-5 py-3 fs-5 fw-bold">BOOK A LIVE STREAM</Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.02); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .hover-transform {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .hover-transform:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    border: 1px solid rgba(255, 102, 0, 0.3) !important;
                }
            `}</style>
        </div>
    );
};

export default Live;

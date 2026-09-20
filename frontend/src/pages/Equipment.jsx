import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Modal, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { optimizeImage } from '../utils/imageOptimization';
import { FaTools, FaCamera, FaMicrophone, FaLightbulb, FaPlane, FaBoxOpen, FaTimes, FaSearchPlus } from 'react-icons/fa';

/**
 * Equipment Page - Displays the company's gear.
 * Features categorized grid, detailed view modal, and informational section.
 */
const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const res = await api.get('/equipment/');
                const data = res.data.results || res.data;
                setEquipment(data);
                
                // Extract unique categories
                const uniqueCats = [...new Set(data.map(item => item.category))];
                setCategories(uniqueCats);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipment();
    }, []);

    const defaultEquipment = [
        { id: 'd1', name: 'RED Komodo 6K Cinema Camera', category: 'Camera', description: 'Global shutter 6K cinema camera for high-end film and commercial productions.', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80' },
        { id: 'd2', name: 'Sennheiser MKH416 Shotgun Mic', category: 'Audio', description: 'Industry standard supercardioid shotgun microphone for crystal clear location audio.', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80' },
        { id: 'd3', name: 'Aputure 600d Pro Daylight LED', category: 'Lighting', description: 'High-output point-source LED light capable of matching 1200W HMI fixtures.', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80' },
        { id: 'd4', name: 'DJI Inspire 3 8K Drone', category: 'Drone', description: 'Full-frame 8K cinema drone with dual-operator control and RTK precision.', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80' },
        { id: 'd5', name: 'Sony FX6 Full-Frame Cinema Line', category: 'Camera', description: 'Full-frame sensor camera with dual native ISO for low-light cinematography.', image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=600&q=80' },
        { id: 'd6', name: 'DZOFILM Vespid Prime Lens Set', category: 'Lens', description: 'Full-frame cine prime lenses providing organic flare and ultra-sharp coverage.', image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=600&q=80' },
        { id: 'd7', name: 'Blackmagic ATEM Mini Extreme ISO', category: 'Live Streaming', description: '8-input live switcher with broadcast recording and multi-platform streaming.', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80' },
        { id: 'd8', name: 'DJI RS 3 Pro Gimbal Stabilizer', category: 'Support', description: 'Automated axis locks with LiDAR focusing for smooth moving camera shots.', image: 'https://images.unsplash.com/photo-1589872737085-802657827ad6?auto=format&fit=crop&w=600&q=80' }
    ];

    const interleaveByDiversity = (items) => {
        if (!items || items.length === 0) return items;
        const grouped = {};
        items.forEach(item => {
            const cat = item.category || 'Other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
        });
        
        const result = [];
        const keys = Object.keys(grouped);
        let added = true;
        let idx = 0;
        while (added) {
            added = false;
            for (const key of keys) {
                if (grouped[key][idx]) {
                    result.push(grouped[key][idx]);
                    added = true;
                }
            }
            idx++;
        }
        return result;
    };

    const displayEquipment = equipment.length > 0 ? equipment : defaultEquipment;

    const filteredEquipment = selectedCategory === 'All' 
        ? interleaveByDiversity(displayEquipment)
        : displayEquipment.filter(item => item.category === selectedCategory);

    const displayCategories = categories.length > 0 
        ? categories 
        : [...new Set(defaultEquipment.map(i => i.category))];

    const getCategoryIcon = (cat) => {
        switch(cat) {
            case 'Camera': return <FaCamera />;
            case 'Lens': return <FaCamera />; 
            case 'Audio': return <FaMicrophone />;
            case 'Lighting': return <FaLightbulb />;
            case 'Drone': return <FaPlane />;
            default: return <FaTools />;
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="equipment-page pt-5 mt-5">
            <SEO 
                title="Our Equipment" 
                description="Explore the professional gear Xclusvs Motion Pictures uses. From 6K cinema cameras to precision lighting, see what powers our productions."
                url="/equipment"
            />
            
            {/* Hero / Intro Section */}
            <section className="py-5 mb-5 position-relative">
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-orange blur-bg" style={{ filter: 'blur(100px)', zIndex: -1, opacity: 0.05 }}></div>
                <Container className="text-center position-relative z-1">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h6 className="text-orange fw-bold spacing-2 text-uppercase mb-3">Behind The Scenes</h6>
                        <h1 className="display-3 fw-bold text-white mb-4">OUR <span className="text-orange">ARSENAL</span></h1>
                        <p className="lead text-secondary mx-auto" style={{ maxWidth: '800px' }}>
                            We believe that while equipment doesn't make the artist, the right tools empower the vision. 
                            Our inventory is curated to handle everything from run-and-gun documentaries to high-end commercial productions.
                        </p>
                    </motion.div>
                </Container>
            </section>

            <Container className="pb-5">
                {/* Category Filter */}
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`btn rounded-pill px-4 py-2 border-0 ${selectedCategory === 'All' ? 'bg-orange text-white shadow-lg' : 'bg-dark text-secondary'}`}
                        onClick={() => setSelectedCategory('All')}
                    >
                        All Gear
                    </motion.button>
                    {displayCategories.map(cat => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`btn rounded-pill px-4 py-2 border-0 ${selectedCategory === cat ? 'bg-orange text-white shadow-lg' : 'bg-dark text-secondary'}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <span className="me-2">{getCategoryIcon(cat)}</span>
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Equipment Grid */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        layout
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                    >
                        <Row className="g-4">
                            {filteredEquipment.length > 0 ? (
                                filteredEquipment.map((item, idx) => (
                                    <Col key={item.id} lg={3} md={4} sm={6}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="h-100"
                                            layout
                                        >
                                            <div 
                                                className="glass-card h-100 overflow-hidden border-0 hover-card group cursor-pointer"
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                                                    {item.image ? (
                                                        <>
                                                            <img 
                                                                src={optimizeImage(item.image, 400, 300)} 
                                                                alt={item.name}
                                                                className="w-100 h-100 object-fit-cover transition-transform"
                                                                style={{ transition: 'transform 0.5s ease' }}
                                                                loading="lazy"
                                                            />
                                                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-all">
                                                                <FaSearchPlus className="text-white fs-2" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-secondary">
                                                            <FaBoxOpen size={40} />
                                                        </div>
                                                    )}
                                                    <div className="position-absolute top-0 end-0 p-2">
                                                        <Badge bg="dark" className="border border-secondary text-secondary shadow-sm">
                                                            {getCategoryIcon(item.category)} {item.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-transparent position-relative">
                                                    <div className="position-absolute top-0 start-0 w-100 h-1px bg-gradient-to-r from-transparent via-orange to-transparent opacity-25"></div>
                                                    <h5 className="fw-bold text-white mb-2">{item.name}</h5>
                                                    <p className="text-secondary small mb-0 line-clamp-2">
                                                        {item.description || 'Professional grade equipment.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Col>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-secondary opacity-50 display-6"><FaBoxOpen className="mb-3 d-block mx-auto" />No equipment found in this category.</p>
                                </div>
                            )}
                        </Row>
                    </motion.div>
                </AnimatePresence>
            </Container>

            {/* Item Detail Modal */}
            <Modal 
                show={!!selectedItem} 
                onHide={() => setSelectedItem(null)} 
                centered 
                size="lg"
                contentClassName="xmp-modal bg-transparent border-0"
            >
                <div className="glass-card overflow-hidden rounded-4 border border-secondary border-opacity-25 position-relative">
                    <Button 
                        variant="link" 
                        className="position-absolute top-0 end-0 m-3 text-white z-3 rounded-circle p-2 bg-black bg-opacity-50"
                        onClick={() => setSelectedItem(null)}
                    >
                        <FaTimes />
                    </Button>
                    
                    {selectedItem && (
                        <Row className="g-0">
                            <Col md={6} className="bg-black">
                                {selectedItem.image ? (
                                    <img 
                                        src={selectedItem.image} 
                                        alt={selectedItem.name} 
                                        className="w-100 h-100 object-fit-contain p-4"
                                        style={{ minHeight: '300px', maxHeight: '500px' }}
                                    />
                                ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary" style={{ minHeight: '300px' }}>
                                        <FaBoxOpen size={60} />
                                    </div>
                                )}
                            </Col>
                            <Col md={6} className="d-flex flex-column justify-content-center p-5 bg-dark bg-opacity-95">
                                <Badge bg="orange" className="align-self-start mb-3">
                                    {getCategoryIcon(selectedItem.category)} {selectedItem.category}
                                </Badge>
                                <h2 className="fw-bold text-white mb-4">{selectedItem.name}</h2>
                                <p className="text-secondary fs-5 lh-base">
                                    {selectedItem.description || "Top-tier equipment ensuring the highest quality production value for your projects."}
                                </p>
                                <div className="mt-4 pt-4 border-top border-secondary border-opacity-25">
                                    <div className="d-flex align-items-center gap-2 text-orange small fw-bold text-uppercase spacing-1">
                                        <FaTools /> Professional Standard
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}
                </div>
            </Modal>

            <style>{`
                .hover-card:hover img {
                    transform: scale(1.05);
                }
                .hover-opacity-100:hover {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default Equipment;

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { optimizeImage } from '../utils/imageOptimization';
import { FaTools, FaCamera, FaMicrophone, FaLightbulb, FaPlane, FaBoxOpen } from 'react-icons/fa';

/**
 * Equipment Page - Displays the company's gear.
 */
const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

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

    const filteredEquipment = selectedCategory === 'All' 
        ? equipment 
        : equipment.filter(item => item.category === selectedCategory);

    const getCategoryIcon = (cat) => {
        switch(cat) {
            case 'Camera': return <FaCamera />;
            case 'Lens': return <FaCamera />; // Or a lens icon if available
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
                description="Check out the professional gear Xclusvs Motion Pictures uses to create cinematic masterpieces."
                url="/equipment"
            />
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h2 className="display-4 fw-bold">OUR <span className="text-orange">GEAR</span></h2>
                    <p className="lead text-secondary">State-of-the-art tools for cinematic storytelling.</p>
                </div>

                {/* Category Filter */}
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`btn rounded-pill px-4 ${selectedCategory === 'All' ? 'btn-brand' : 'btn-outline-light'}`}
                        onClick={() => setSelectedCategory('All')}
                    >
                        All Gear
                    </motion.button>
                    {categories.map(cat => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`btn rounded-pill px-4 ${selectedCategory === cat ? 'btn-brand' : 'btn-outline-light'}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
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
                                        >
                                            <div className="glass-card h-100 overflow-hidden border-0 hover-card">
                                                <div className="position-relative" style={{ height: '200px' }}>
                                                    {item.image ? (
                                                        <img 
                                                            src={optimizeImage(item.image, 400, 300)} 
                                                            alt={item.name}
                                                            className="w-100 h-100 object-fit-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-secondary">
                                                            <FaBoxOpen size={40} />
                                                        </div>
                                                    )}
                                                    <div className="position-absolute top-0 end-0 p-2">
                                                        <Badge bg="orange" className="shadow-sm">
                                                            {getCategoryIcon(item.category)} {item.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h5 className="fw-bold text-white mb-2">{item.name}</h5>
                                                    <p className="text-secondary small mb-0 line-clamp-3">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Col>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-secondary">No equipment found in this category.</p>
                                </div>
                            )}
                        </Row>
                    </motion.div>
                </AnimatePresence>
            </Container>
        </div>
    );
};

export default Equipment;

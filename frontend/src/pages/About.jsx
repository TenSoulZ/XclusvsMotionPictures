import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import api from '../utils/api';
import Skeleton from '../components/Skeleton';
/**
 * About component - Tells the story of Xclusvs Motion Pictures.
 * Displays company mission, process, expertise, and team members.
 */
const About = () => {
    const [team, setTeam] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        /**
         * Fetches the creative team members from the backend.
         */
        const fetchTeam = async () => {
            try {
                const res = await api.get('/team/');
                setTeam(res.data.results || res.data);
            } catch (error) {
                console.error('Error fetching team:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);
    return (
        <div className="about-page pt-5 bg-black">
            <SEO 
                title="Our Story" 
                description="Learn about Xclusvs Motion Pictures, our mission, our creative team, and our journey in visual storytelling since 2017."
                url="/about"
            />
            {/* Hero */}
            <section className="py-5 mt-5">
                <Container>
                    <Row className="align-items-center mb-5">
                        <Col lg={6}>
                            <motion.h1 
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="display-1 fw-bold mb-4"
                            >
                                OUR <span className="text-transparent" style={{ WebkitTextStroke: '2px #ff6600', color: 'transparent' }}>STORY</span>
                            </motion.h1>
                            <p className="lead text-white mb-4 fs-4">
                                Delivering top-notch visual solutions since 2017.
                            </p>
                            <p className="text-white-50" style={{ maxWidth: '90%' }}>
                                Established in 2017 in Harare, Zimbabwe, Xclusvs Motion Pictures is a dynamic production company dedicated to producing high-quality visual content. Our mission is to provide innovative and effective visual solutions that help our clients achieve their goals. We strive to build long-term relationships founded on trust, creativity, and exceptional service.
                            </p>
                        </Col>
                        <Col lg={6}>
                             <div className="position-relative">
                                 <div className="position-absolute top-0 start-0 w-100 h-100 border border-orange border-2 rounded-4" style={{ transform: 'translate(20px, 20px)', zIndex: 0 }}></div>
                                 <img src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="High-end Cinema Camera" className="img-fluid rounded-4 position-relative z-1 shadow-lg" loading="lazy" />
                             </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats / Process */}
            <section className="py-5 bg-dark">
                <Container>
                    <h2 className="text-center mb-5 display-4 fw-bold">THE <span className="text-orange">PROCESS</span></h2>
                    <Row className="g-4">
                        {[
                            { step: '01', title: 'Concept', desc: 'We brainstorm and storyboard to ensure your vision is clear.' },
                            { step: '02', title: 'Pre-Production', desc: 'Detailed planning, scripting, and logistics to set the stage.' },
                            { step: '03', title: 'Post-Production', desc: 'Color grading, sound design, and VFX bring the story to life.' }
                        ].map((item, idx) => (
                            <Col md={4} key={idx}>
                                <motion.div 
                                    whileHover={{ y: -10 }}
                                    className="glass-card p-5 h-100 text-center position-relative overflow-hidden"
                                >
                                    <div className="display-1 fw-bold text-white opacity-10 mb-3" style={{ position: 'absolute', top: '-20px', left: '20px' }}>{item.step}</div>
                                    <h4 className="fw-bold mb-3 mt-4 text-white">{item.title}</h4>
                                    <p className="text-white-50 small">{item.desc}</p>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
            
            {/* Expertise */}
            <section className="py-5 border-top border-secondary">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={4}>
                            <h2 className="display-5 fw-bold mb-4 text-white">INDUSTRY <br/> <span className="text-orange">EXPERTISE</span></h2>
                            <p className="text-white-50">We deliver tailored visual solutions across diverse sectors, ensuring your message resonates with the right audience.</p>
                        </Col>
                        <Col lg={8}>
                            <Row className="g-3">
                                {[
                                    'Corporate Communications',
                                    'Advertising and Marketing',
                                    'Entertainment and Media',
                                    'Education and Training'
                                ].map((item, idx) => (
                                    <Col md={6} key={idx}>
                                        <div className="glass-card p-3 border-orange border-opacity-25 h-100 d-flex align-items-center">
                                            <div className="bg-orange p-1 me-3 rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                            <span className="fw-bold">{item}</span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Team */}
            <section className="py-5">
                <Container>
                    <h2 className="text-center mb-5 display-4 fw-bold">CREATIVE <span className="text-orange">MINDS</span></h2>
                    <Row className="g-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <Col md={4} key={idx}>
                                    <Skeleton type="card" />
                                </Col>
                            ))
                        ) : team.length > 0 ? (
                            team.map((member, idx) => (
                                <Col md={4} key={member.id || idx}>
                                    <div className="text-center group">
                                        <div className="position-relative d-inline-block mb-3 overflow-hidden rounded-circle" style={{ width: '200px', height: '200px' }}>
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="img-cover w-100 h-100 object-fit-cover" loading="lazy" />
                                            ) : (
                                                <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center text-white display-4">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-orange opacity-0 hover-opacity-20 transition-all"></div>
                                        </div>
                                        <h5 className="fw-bold mb-0">{member.name}</h5>
                                        <p className="text-orange small">{member.role}</p>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <div className="text-secondary text-center w-100">Our creative team is growing. Check back soon!</div>
                        )}
                        {[].length > 0 && [].map((member, idx) => (
                            <Col md={4} key={idx}>
                                {/* ... removed internal map logic ... */}
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default About;

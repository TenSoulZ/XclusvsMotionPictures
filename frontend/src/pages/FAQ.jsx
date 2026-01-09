import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import SEO from '../components/SEO';

const FAQ = () => {
    return (
        <div className="faq-page pt-5 bg-black min-vh-100">
            <SEO 
                title="FAQ" 
                description="Frequently Asked Questions about Xclusvs Motion Pictures."
                url="/faq"
            />
            <Container className="py-5 mt-5">
                <h1 className="fw-bold mb-5 text-white">Frequently Asked <span className="text-orange">Questions</span></h1>
                <Accordion defaultActiveKey="0" className="mb-5" theme="dark">
                    <Accordion.Item eventKey="0" className="bg-dark text-white border-secondary mb-3 rounded overflow-hidden">
                        <Accordion.Header>What services do you offer?</Accordion.Header>
                        <Accordion.Body className="text-secondary">
                            We offer a wide range of visual production services including corporate communications, advertising and marketing videos, entertainment media production, and educational content.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="bg-dark text-white border-secondary mb-3 rounded overflow-hidden">
                        <Accordion.Header>Where are you located?</Accordion.Header>
                        <Accordion.Body className="text-secondary">
                            We are established and based in Harare, Zimbabwe, but we operate globally depending on project requirements.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="bg-dark text-white border-secondary mb-3 rounded overflow-hidden">
                        <Accordion.Header>How can I book a session?</Accordion.Header>
                        <Accordion.Body className="text-secondary">
                            You can book a session by contacting us through our Contact page, emailing us directly, or giving us a call. We'll discuss your project needs and schedule a consultation.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3" className="bg-dark text-white border-secondary mb-3 rounded overflow-hidden">
                        <Accordion.Header>Do you do destination shoots?</Accordion.Header>
                        <Accordion.Body className="text-secondary">
                            Yes, we are available for destination shoots. Travel and accommodation costs will be factored into the project quote.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </div>
    );
};

export default FAQ;

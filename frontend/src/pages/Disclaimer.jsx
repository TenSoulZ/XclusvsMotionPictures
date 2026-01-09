import React from 'react';
import { Container } from 'react-bootstrap';
import SEO from '../components/SEO';

const Disclaimer = () => {
    return (
        <div className="disclaimer-page pt-5 bg-black min-vh-100">
            <SEO 
                title="Disclaimer" 
                description="Disclaimer for Xclusvs Motion Pictures website."
                url="/disclaimer"
            />
            <Container className="py-5 mt-5 text-white">
                <h1 className="fw-bold mb-4">Disclaimer</h1>
                
                <section className="mb-5">
                    <h4 className="text-orange mb-3">General Information</h4>
                    <p className="text-secondary">
                        The information provided by Xclusvs Motion Pictures ("we," "us," or "our") on our website is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">External Links Disclaimer</h4>
                    <p className="text-secondary">
                        The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">Professional Disclaimer</h4>
                    <p className="text-secondary">
                        The Site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
                    </p>
                </section>
            </Container>
        </div>
    );
};

export default Disclaimer;

import React from 'react';
import { Container } from 'react-bootstrap';
import SEO from '../components/SEO';

const TermsAndConditions = () => {
    return (
        <div className="terms-page pt-5 bg-black min-vh-100">
            <SEO 
                title="Terms and Conditions" 
                description="Terms and Conditions for Xclusvs Motion Pictures cinematography and photography services."
                url="/terms-and-conditions"
            />
            <Container className="py-5 mt-5 text-white">
                <h1 className="fw-bold mb-4">Terms <span className="text-orange">& Conditions</span></h1>
                
                <p className="text-white-50 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">1. Acceptance of Terms</h4>
                    <p className="text-white-50">
                        By accessing or using the Xclusvs Motion Pictures website or services, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not use this website or our services.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">2. Service Provision</h4>
                    <p className="text-white-50">
                        Xclusvs Motion Pictures provides professional video production, photography, and digital solutions. Specific service agreements, including pricing, project scope, and delivery timelines, will be detailed in separate contracts for each project.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">3. Intellectual Property</h4>
                    <p className="text-white-50">
                        Unless otherwise agreed upon in writing, Xclusvs Motion Pictures retains the primary intellectual property rights for all raw footage and original assets produced. Clients are granted usage rights as specified in their individual project contracts upon full payment.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">4. Content Usage</h4>
                    <p className="text-white-50">
                        The content on this website, including videos, photos, and text, is the property of Xclusvs Motion Pictures and is protected by copyright laws. Unauthorized reproduction or distribution is strictly prohibited.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">5. Limitation of Liability</h4>
                    <p className="text-white-50">
                        Xclusvs Motion Pictures shall not be liable for any indirect, incidental, or consequential damages arising out of the use of our services or the inability to access our website.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">6. Modifications</h4>
                    <p className="text-white-50">
                        We reserve the right to modify these terms at any time. Your continued use of the site or services following any changes constitutes your acceptance of the new terms.
                    </p>
                </section>
                
                <section className="mb-5">
                    <h4 className="text-orange mb-3">7. Contact Information</h4>
                    <p className="text-white-50">
                        For any questions regarding these Terms and Conditions, please contact us via our official contact page or email.
                    </p>
                </section>
            </Container>
        </div>
    );
};

export default TermsAndConditions;

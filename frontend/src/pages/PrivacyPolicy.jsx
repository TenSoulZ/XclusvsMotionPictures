import React from 'react';
import { Container } from 'react-bootstrap';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-page pt-5 bg-black min-vh-100">
            <SEO 
                title="Privacy Policy" 
                description="Privacy Policy for Xclusvs Motion Pictures."
                url="/privacy-policy"
            />
            <Container className="py-5 mt-5 text-white">
                <h1 className="fw-bold mb-4">Privacy <span className="text-orange">Policy</span></h1>
                
                <p className="text-secondary mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">Introduction</h4>
                    <p className="text-secondary">
                        Xclusvs Motion Pictures respects the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website including any other media form, media channel, mobile website, or mobile application related or connected thereto.
                    </p>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">Collection of Your Information</h4>
                    <p className="text-secondary">
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul className="text-secondary">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>
                </section>

                <section className="mb-5">
                    <h4 className="text-orange mb-3">Use of Your Information</h4>
                    <p className="text-secondary">
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul className="text-secondary">
                        <li>Create and manage your account.</li>
                        <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                    </ul>
                </section>
                
                <section className="mb-5">
                    <h4 className="text-orange mb-3">Contact Us</h4>
                    <p className="text-secondary">
                        If you have questions or comments about this Privacy Policy, please contact us at our Contact page.
                    </p>
                </section>
            </Container>
        </div>
    );
};

export default PrivacyPolicy;

import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navbar';
import Footer from './Footer';
import ParticlesBackground from './ParticlesBackground';
import BackToTop from './BackToTop';

const Layout = ({ children }) => {
    const location = useLocation();
    // Check if current path is admin-related (admin dashboard or login)
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

    if (isAdminRoute) {
        // Admin Portal Layout
        return (
            <div className="admin-portal-layout d-flex flex-column min-vh-100 position-relative">
                <ParticlesBackground />
                {/* No Navbar, No Footer, No BackToTop for Admin Portal */}
                <main className="flex-grow-1">
                    {children}
                </main>
            </div>
        );
    }

    // Public Website Layout
    return (
        <div className="d-flex flex-column min-vh-100 position-relative">
            <ParticlesBackground />
            <Navigation />
            <main id="main-content">
                <BackToTop />
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;

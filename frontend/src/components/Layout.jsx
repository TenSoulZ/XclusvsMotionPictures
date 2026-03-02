import React, { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';

// Lazy load ParticlesBackground since it's a heavy component and non-critical
const ParticlesBackground = lazy(() => import('./ParticlesBackground'));

const Layout = ({ children }) => {
    const location = useLocation();
    // Check if current path is admin-related (admin dashboard or login)
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

    if (isAdminRoute) {
        // Admin Portal Layout
        return (
            <div className="admin-portal-layout d-flex flex-column min-vh-100 position-relative">
                <Suspense fallback={null}>
                    <ParticlesBackground />
                </Suspense>
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
            <Suspense fallback={null}>
                <ParticlesBackground />
            </Suspense>
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

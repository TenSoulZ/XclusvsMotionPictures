import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Loader from '../components/Loader';
import PrivateRoute from '../components/PrivateRoute';

// Lazy load page components
const Home = lazy(() => import('../pages/Home'));
const Gallery = lazy(() => import('../pages/Gallery'));
const Videos = lazy(() => import('../pages/Videos'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const About = lazy(() => import('../pages/About'));
const Services = lazy(() => import('../pages/Services'));
const Contact = lazy(() => import('../pages/Contact'));
const Blog = lazy(() => import('../pages/Blog'));
const BlogPost = lazy(() => import('../pages/BlogPost'));
const Login = lazy(() => import('../pages/Login'));
const Live = lazy(() => import('../pages/Live'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Disclaimer = lazy(() => import('../pages/Disclaimer'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions'));

// Simple fade transition for all pages
const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
};

const PageWrapper = ({ children }) => (
    <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-100"
    >
        {children}
    </motion.div>
);

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<Loader />}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                    <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
                    <Route path="/videos" element={<PageWrapper><Videos /></PageWrapper>} />
                    <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                    <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
                    <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                    <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
                    <Route path="/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
                    <Route path="/live" element={<PageWrapper><Live /></PageWrapper>} />
                    <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
                    <Route path="/disclaimer" element={<PageWrapper><Disclaimer /></PageWrapper>} />
                    <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
                    <Route path="/terms-and-conditions" element={<PageWrapper><TermsAndConditions /></PageWrapper>} />
                    <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                    <Route 
                        path="/admin" 
                        element={
                            <PrivateRoute>
                                <PageWrapper><AdminDashboard /></PageWrapper>
                            </PrivateRoute>
                        } 
                    />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;


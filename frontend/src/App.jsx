/**
 * Main Application Component
 * Sets up the global providers, routing, and layout structure.
 */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes';
import Navigation from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Live from './pages/Live';
import FAQ from './pages/FAQ';
import Disclaimer from './pages/Disclaimer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

import ParticlesBackground from './components/ParticlesBackground';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100 position-relative">
          <ParticlesBackground />
          <Navigation />
          <BackToTop />
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;

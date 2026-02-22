/**
 * Main Application Component
 * Sets up the global providers, routing, and layout structure.
 */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';

function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Layout>
            <ErrorBoundary>
              <AnimatedRoutes />
            </ErrorBoundary>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;

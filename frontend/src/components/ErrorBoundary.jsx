import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="glass-card p-5 text-center" style={{ maxWidth: '600px' }}>
                        <div className="text-orange mb-4" style={{ fontSize: '4rem' }}>
                            <FaExclamationTriangle />
                        </div>
                        <h2 className="fw-bold mb-3">Oops! Something went wrong</h2>
                        <Alert variant="danger" className="bg-dark border-danger text-start">
                            <Alert.Heading className="h6">Error Details:</Alert.Heading>
                            <p className="small mb-0 font-monospace">
                                {this.state.error && this.state.error.toString()}
                            </p>
                        </Alert>
                        <p className="text-secondary mb-4">
                            We're sorry for the inconvenience. The error has been logged and we'll look into it.
                        </p>
                        <div className="d-flex gap-3 justify-content-center">
                            <Button variant="outline-light" onClick={() => window.history.back()}>
                                Go Back
                            </Button>
                            <Button variant="brand" onClick={this.handleReset}>
                                Reload Page
                            </Button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details className="mt-4 text-start">
                                <summary className="text-secondary cursor-pointer">
                                    Stack Trace (Development Only)
                                </summary>
                                <pre className="small text-secondary mt-2 p-3 bg-black rounded">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

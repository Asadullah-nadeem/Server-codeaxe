import React from 'react';
import { Container } from 'react-bootstrap';

const LoadingSpinner = ({ text = "", fluid = true, className = "" }) => {
    return (
        <Container fluid={fluid} className={`d-flex flex-column align-items-center justify-content-center ${className}`} style={{ minHeight: '300px' }}>
            <div className="premium-loader">
                <div className="loader-circle"></div>
                <div className="loader-circle-inner"></div>
            </div>
            {text && <p className="mt-4 text-muted fw-medium tracking-tight opacity-75">{text}</p>}
            
            <style jsx>{`
                .premium-loader {
                    position: relative;
                    width: 80px;
                    height: 80px;
                }
                .loader-circle {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: conic-gradient(from 0deg, transparent 30%, var(--bs-primary) 100%);
                    animation: spin 1s linear infinite;
                    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0);
                }
                .loader-circle-inner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: var(--bs-primary);
                    opacity: 0.3;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
                    50% { transform: translate(-50%, -50%) scale(2.5); opacity: 0.4; }
                }
                .tracking-tight { letter-spacing: -0.01em; }
            `}</style>
        </Container>
    );
};

export default LoadingSpinner;

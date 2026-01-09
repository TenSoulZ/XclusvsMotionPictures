import React from 'react';
import logoOrange from '../assets/logos/xmp-logo-orange.png';

const Loader = ({ fullPage = false }) => {
    return (
        <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
            <div className="loader-content">
                <div className="spinner mb-4">
                    <img 
                        src={logoOrange} 
                        alt="XMP" 
                        className="loader-logo-spinner" 
                        width="60"
                    />
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                </div>
                <p className="loader-text mt-3">XCLUSVS <span className="text-orange">MOTION</span></p>
            </div>
        </div>
    );
};

export default Loader;

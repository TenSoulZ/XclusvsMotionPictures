import React from 'react';

const SkipToContent = ({ contentId = 'main-content' }) => {
    return (
        <a href={`#${contentId}`} className="skip-to-content-link">
            Skip to main content
        </a>
    );
};

export default SkipToContent;

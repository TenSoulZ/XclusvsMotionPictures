import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type, count = 1, className = '' }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'video':
                return (
                    <div className={`skeleton-video-wrapper ${className}`}>
                        <div className="skeleton-video-thumb shimmer" />
                        <div className="skeleton-video-title shimmer" />
                    </div>
                );
            case 'photo':
                return (
                    <div className={`skeleton-photo-wrapper ${className}`}>
                        <div className="skeleton-photo-img shimmer" />
                    </div>
                );
            case 'blog':
                return (
                    <div className={`skeleton-blog-wrapper ${className}`}>
                        <div className="skeleton-blog-img shimmer" />
                        <div className="skeleton-blog-meta shimmer" />
                        <div className="skeleton-blog-title shimmer" />
                        <div className="skeleton-blog-text shimmer" />
                    </div>
                );
            case 'text':
                return <div className={`skeleton-text shimmer ${className}`} />;
            case 'circle':
                return <div className={`skeleton-circle shimmer ${className}`} />;
            default:
                return <div className={`skeleton-base shimmer ${className}`} />;
        }
    };

    return (
        <>
            {Array(count).fill(0).map((_, i) => (
                <React.Fragment key={i}>
                    {renderSkeleton()}
                </React.Fragment>
            ))}
        </>
    );
};

export default Skeleton;

import React, { useState } from 'react';
import { Modal, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import { FaShareAlt, FaWhatsapp, FaTwitter, FaFacebookF, FaLinkedinIn, FaEnvelope, FaLink, FaCheck, FaTimes } from 'react-icons/fa';

/**
 * ShareModal Component - Renders a sleek modal for sharing pricing plans, 
 * packages, or service offerings to all social platforms or copying direct links.
 */
const ShareModal = ({ show, onHide, shareData }) => {
    const [copied, setCopied] = useState(false);

    if (!shareData) return null;

    const { title, text, url, price, plan, service } = shareData;

    // Full share text
    const formattedShareText = text || `Check out ${title}${price ? ` for $${price}` : ''} at Xclusvs Motion Pictures!`;
    const shareUrl = url || window.location.href;

    // Social platform sharing links
    const shareLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${formattedShareText}\n${shareUrl}`)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(formattedShareText)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        email: `mailto:?subject=${encodeURIComponent(`XMP Pricing: ${title}`)}&body=${encodeURIComponent(`${formattedShareText}\n\nLink: ${shareUrl}`)}`
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: formattedShareText,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Native share error:', err);
                }
            }
        }
    };

    return (
        <>
            <Modal 
                show={show} 
                onHide={onHide} 
                centered 
                contentClassName="xmp-modal bg-transparent border-0"
            >
                <div className="glass-card overflow-hidden rounded-4 border border-orange border-opacity-50 p-4 text-white position-relative shadow-lg">
                    <Button 
                        variant="link" 
                        className="position-absolute top-0 end-0 m-3 text-white z-3 rounded-circle p-2 bg-black bg-opacity-50"
                        onClick={onHide}
                    >
                        <FaTimes />
                    </Button>

                    <div className="text-center mb-4 pt-2">
                        <div className="d-inline-flex p-3 rounded-circle bg-orange bg-opacity-20 text-orange mb-3">
                            <FaShareAlt size={28} />
                        </div>
                        <h4 className="fw-bold mb-1">Share Package Pricing</h4>
                        <p className="text-white-50 small mb-0">
                            {service} • <span className="text-orange fw-bold">{plan}</span> {price && `($${price})`}
                        </p>
                    </div>

                    {/* Native Mobile Share Button if available */}
                    {navigator.share && (
                        <div className="mb-4">
                            <Button 
                                variant="brand" 
                                className="w-100 py-3 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                                onClick={handleNativeShare}
                            >
                                <FaShareAlt /> Share via App / Device
                            </Button>
                        </div>
                    )}

                    {/* Social Icons Grid */}
                    <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
                        <a 
                            href={shareLinks.whatsapp} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-outline-light rounded-circle p-3 d-flex align-items-center justify-content-center share-btn-whatsapp"
                            title="Share on WhatsApp"
                        >
                            <FaWhatsapp size={22} />
                        </a>
                        <a 
                            href={shareLinks.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-outline-light rounded-circle p-3 d-flex align-items-center justify-content-center share-btn-twitter"
                            title="Share on X (Twitter)"
                        >
                            <FaTwitter size={22} />
                        </a>
                        <a 
                            href={shareLinks.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-outline-light rounded-circle p-3 d-flex align-items-center justify-content-center share-btn-facebook"
                            title="Share on Facebook"
                        >
                            <FaFacebookF size={22} />
                        </a>
                        <a 
                            href={shareLinks.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-outline-light rounded-circle p-3 d-flex align-items-center justify-content-center share-btn-linkedin"
                            title="Share on LinkedIn"
                        >
                            <FaLinkedinIn size={22} />
                        </a>
                        <a 
                            href={shareLinks.email} 
                            className="btn btn-outline-light rounded-circle p-3 d-flex align-items-center justify-content-center share-btn-email"
                            title="Share via Email"
                        >
                            <FaEnvelope size={22} />
                        </a>
                    </div>

                    {/* Direct Copy Link Input */}
                    <div className="bg-black bg-opacity-50 p-2 rounded-3 border border-secondary border-opacity-25 d-flex align-items-center gap-2">
                        <Form.Control 
                            type="text" 
                            readOnly 
                            value={shareUrl} 
                            className="bg-transparent border-0 text-white-50 small shadow-none"
                        />
                        <Button 
                            variant={copied ? "success" : "brand"}
                            size="sm"
                            className="rounded-pill px-3 py-2 fw-bold text-nowrap d-flex align-items-center gap-1"
                            onClick={handleCopyLink}
                        >
                            {copied ? <><FaCheck /> Copied!</> : <><FaLink /> Copy</>}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Copy Toast Alert */}
            <ToastContainer position="bottom-center" className="p-3 position-fixed" style={{ zIndex: 9999 }}>
                <Toast 
                    show={copied} 
                    onClose={() => setCopied(false)} 
                    delay={3000} 
                    autohide 
                    bg="dark" 
                    className="border border-orange text-white rounded-pill px-3 py-1 shadow-lg"
                >
                    <Toast.Body className="d-flex align-items-center gap-2 small py-1">
                        <FaCheck className="text-success" /> Price package link copied to clipboard!
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <style>{`
                .share-btn-whatsapp:hover { background-color: #25D366 !important; border-color: #25D366 !important; color: #fff !important; }
                .share-btn-twitter:hover { background-color: #1DA1F2 !important; border-color: #1DA1F2 !important; color: #fff !important; }
                .share-btn-facebook:hover { background-color: #1877F2 !important; border-color: #1877F2 !important; color: #fff !important; }
                .share-btn-linkedin:hover { background-color: #0A66C2 !important; border-color: #0A66C2 !important; color: #fff !important; }
                .share-btn-email:hover { background-color: var(--brand-orange) !important; border-color: var(--brand-orange) !important; color: #fff !important; }
            `}</style>
        </>
    );
};

export default ShareModal;

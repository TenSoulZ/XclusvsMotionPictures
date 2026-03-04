import React from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';

/**
 * DashboardModal component for adding or editing content in the Admin Dashboard.
 */
const DashboardModal = ({
    show,
    onHide,
    activeTab,
    isEditing,
    newItem,
    setNewItem,
    categories,
    validationErrors,
    imagePreview,
    setImagePreview,
    handleFileChange,
    handleSubmit,
    formatFileSize,
    isLoading = false
}) => {
    const getTitle = () => {
        const type = {
            'videos': 'Video',
            'photos': 'Photo',
            'brands': 'Brand',
            'testimonials': 'Testimonial',
            'blog': 'Blog Post',
            'team': 'Team Member',
            'live': 'Live Stream',
            'pricing': 'Pricing Plan'
        }[activeTab] || 'Item';
        return `${isEditing ? 'Edit' : 'Add New'} ${type}`;
    };

    const [showPreview, setShowPreview] = React.useState(false);

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="bg-dark text-white border-secondary">
                <Modal.Title className="d-flex align-items-center justify-content-between w-100">
                    <span>{getTitle()}</span>
                    {activeTab === 'blog' && (
                        <Button 
                            variant="outline-orange" 
                            size="sm" 
                            className="ms-auto me-3 py-1 px-3 rounded-pill"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            {showPreview ? 'EDIT MODE' : 'PREVIEW'}
                        </Button>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                <Form>
                    {showPreview && activeTab === 'blog' ? (
                        <div className="bg-black bg-opacity-50 p-4 rounded-3 border border-secondary border-opacity-25 mb-3" style={{ minHeight: '300px' }}>
                            <h2 className="fw-bold mb-4">{newItem.title}</h2>
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#ccc' }}>
                                {newItem.description || 'No content yet...'}
                            </div>
                        </div>
                    ) : (
                        <>
                            <Row>
                                <Col md={activeTab === 'brands' || activeTab === 'testimonials' || activeTab === 'blog' || activeTab === 'live' || activeTab === 'pricing' ? 12 : 8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{activeTab === 'brands' ? 'Brand Name' : activeTab === 'testimonials' ? 'Client Name' : activeTab === 'pricing' ? 'Plan Name' : 'Title'}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            className="bg-black border-secondary text-white" 
                                            value={activeTab === 'testimonials' ? newItem.client_name : activeTab === 'pricing' ? newItem.plan_name : newItem.title} 
                                            onChange={e => {
                                                if (activeTab === 'testimonials') setNewItem({...newItem, client_name: e.target.value});
                                                else if (activeTab === 'pricing') setNewItem({...newItem, plan_name: e.target.value});
                                                else setNewItem({...newItem, title: e.target.value});
                                            }} 
                                        />
                                    </Form.Group>
                                </Col>
                                {activeTab !== 'brands' && activeTab !== 'testimonials' && activeTab !== 'blog' && activeTab !== 'team' && activeTab !== 'live' && activeTab !== 'pricing' && (
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select 
                                                className="bg-black border-secondary text-white"
                                                value={newItem.category} 
                                                onChange={e => setNewItem({...newItem, category: e.target.value})}
                                            >
                                                {categories.length > 0 ? (
                                                    categories.map(cat => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))
                                                ) : (
                                                    <option>Loading categories...</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>

                            {activeTab !== 'brands' && activeTab !== 'live' && activeTab !== 'pricing' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>{activeTab === 'testimonials' ? 'Feedback Content' : activeTab === 'blog' ? 'Article Content' : 'Description'}</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={activeTab === 'testimonials' || activeTab === 'blog' ? 12 : 2} 
                                        className="bg-black border-secondary text-white"
                                        value={newItem.description} 
                                        onChange={e => setNewItem({...newItem, description: e.target.value})} 
                                    />
                                    {activeTab === 'blog' && (
                                        <Form.Text className="text-secondary opacity-50 small">
                                            Use double enters for new paragraphs. Preview to see how it looks.
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            )}
                        </>
                    )}
                    
                    {activeTab === 'team' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="bg-black border-secondary text-white"
                                value={newItem.role} 
                                onChange={e => setNewItem({...newItem, role: e.target.value})} 
                            />
                        </Form.Group>
                    )}

                    {activeTab === 'live' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Stream Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                className="bg-black border-secondary text-white"
                                value={newItem.description} 
                                onChange={e => setNewItem({...newItem, description: e.target.value})} 
                            />
                        </Form.Group>
                    )}

                    {activeTab === 'blog' && (
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Slug (leave empty for auto-gen)</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className="bg-black border-secondary text-white" 
                                        placeholder="my-article-slug"
                                        value={newItem.slug} 
                                        onChange={e => setNewItem({...newItem, slug: e.target.value})} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Author Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className="bg-black border-secondary text-white"
                                        value={newItem.author_name} 
                                        onChange={e => setNewItem({...newItem, author_name: e.target.value})} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}

                    {activeTab === 'testimonials' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Client Role / Company (Optional)</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="bg-black border-secondary text-white" 
                                placeholder="e.g. CEO, TechFlow"
                                value={newItem.client_role} 
                                onChange={e => setNewItem({...newItem, client_role: e.target.value})} 
                            />
                        </Form.Group>
                    )}

                    {activeTab === 'videos' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Youtube/Vimeo URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="bg-black border-secondary text-white" 
                                placeholder="https://..."
                                value={newItem.url} 
                                onChange={e => setNewItem({...newItem, url: e.target.value})} 
                            />
                        </Form.Group>
                    )}

                    {activeTab === 'brands' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Website URL (Optional)</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="bg-black border-secondary text-white" 
                                placeholder="https://..."
                                value={newItem.website_url} 
                                onChange={e => setNewItem({...newItem, website_url: e.target.value})} 
                            />
                        </Form.Group>
                    )}

                    {activeTab === 'pricing' && (
                        <>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Service Type</Form.Label>
                                        <Form.Select 
                                            className="bg-black border-secondary text-white"
                                            value={newItem.service_type} 
                                            onChange={e => setNewItem({...newItem, service_type: e.target.value})}
                                        >
                                            <option value="video">Video Production</option>
                                            <option value="photo">Photography</option>
                                            <option value="web">Web Developing</option>
                                            <option value="edit">Video Editing</option>
                                            <option value="audio">Audio Production</option>
                                            <option value="live">Live Streaming</option>
                                            <option value="brand">Branding</option>
                                            <option value="marketing">Digital Marketing</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price (number or text)</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            className="bg-black border-secondary text-white" 
                                            value={newItem.price} 
                                            onChange={e => setNewItem({...newItem, price: e.target.value})} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Features (One per line)</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={5} 
                                    className="bg-black border-secondary text-white"
                                    value={newItem.features} 
                                    onChange={e => setNewItem({...newItem, features: e.target.value})} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Display Order</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    className="bg-black border-secondary text-white"
                                    value={newItem.order} 
                                    onChange={e => setNewItem({...newItem, order: parseInt(e.target.value)})} 
                                />
                            </Form.Group>
                            <Form.Check 
                                type="switch"
                                label="Mark as Most Popular"
                                className="text-white mt-3"
                                checked={newItem.is_popular}
                                onChange={e => setNewItem({...newItem, is_popular: e.target.checked})}
                            />
                        </>
                    )}

                    {(activeTab === 'photos' || activeTab === 'brands' || activeTab === 'testimonials' || activeTab === 'blog' || activeTab === 'team') && (
                         <Form.Group className="mb-3">
                            <Form.Label>
                                {activeTab === 'brands' ? 'Upload Logo' : 
                                 activeTab === 'testimonials' ? 'Client Image (Optional)' : 
                                 activeTab === 'team' ? 'Profile Picture' : 
                                 activeTab === 'blog' ? 'Featured Image' : 
                                 'Upload Image'}
                            </Form.Label>
                            <Form.Control 
                                type="file" 
                                className="bg-black border-secondary text-white"
                                onChange={handleFileChange} 
                                accept="image/*" 
                            />
                            
                            {validationErrors?.length > 0 && (
                                <Alert variant="danger" className="mt-2 py-2 px-3 bg-transparent border-danger text-danger small">
                                    <ul className="mb-0 ps-3">
                                        {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                                    </ul>
                                </Alert>
                            )}

                            {imagePreview && (
                                <div className="mt-3 text-center position-relative d-inline-block">
                                                                         <img 
                                                                            src={imagePreview} 
                                                                            alt="Image preview" 
                                                                            className="rounded border border-secondary shadow-sm"
                                                                            style={{ maxHeight: '200px', maxWidth: '100%' }} 
                                                                        />                                                                         <Button 
                                                                            variant="danger" 
                                                                            size="sm" 
                                                                            className="position-absolute top-0 end-0 rounded-circle translate-middle p-1"
                                                                            aria-label="Remove image"
                                                                            onClick={() => {
                                                                                setImagePreview(null);
                                                                                setNewItem({...newItem, image: null});
                                                                            }}
                                                                        >                                        <FaTimesCircle />
                                    </Button>
                                    <div className="small text-secondary mt-1">
                                        {newItem.image && formatFileSize(newItem.image.size)}
                                    </div>
                                </div>
                            )}
                        </Form.Group>
                    )}

                    {activeTab !== 'brands' && activeTab !== 'testimonials' && activeTab !== 'blog' && activeTab !== 'live' && (
                        <Form.Check 
                            type="switch"
                            label="Mark as Featured"
                            className="text-white mt-3"
                            checked={newItem.is_featured}
                            onChange={e => setNewItem({...newItem, is_featured: e.target.checked})}
                        />
                    )}

                    {activeTab === 'live' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Stream URL (YouTube/Vimeo)</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="bg-black border-secondary text-white" 
                                placeholder="https://..."
                                value={newItem.url} 
                                onChange={e => setNewItem({...newItem, url: e.target.value})} 
                            />
                        </Form.Group>
                    )}
                    
                    {activeTab === 'live' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Scheduled At (Optional)</Form.Label>
                            <Form.Control 
                                type="datetime-local" 
                                className="bg-black border-secondary text-white"
                                value={newItem.scheduled_at} 
                                onChange={e => setNewItem({...newItem, scheduled_at: e.target.value})} 
                            />
                        </Form.Group>
                    )}

                    {activeTab === 'live' && (
                        <Form.Check 
                            type="switch"
                            label="Is Live Now"
                            className="text-white mt-3"
                            checked={newItem.is_live}
                            onChange={e => setNewItem({...newItem, is_live: e.target.checked})}
                        />
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
                <Button variant="outline-light" onClick={onHide} disabled={isLoading}>Cancel</Button>
                <Button variant="brand" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Content'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DashboardModal;

import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Nav, Row, Col, Form } from 'react-bootstrap';
import api from '../utils/api';
import { FaPlus, FaTimesCircle, FaBroadcastTower, FaEye, FaVideo, FaImage, FaStar, FaPenNib, FaEnvelope, FaMoneyBillAlt, FaTrash } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import { validateImage, formatFileSize, createImagePreview } from '../utils/imageValidation';
import { getEmbedUrl } from '../utils/videoUtils';
import Pagination from '../components/Pagination';
import logoOrange from '../assets/logos/xmp-logo-orange.png';
import DashboardTable from '../components/DashboardTable';
import DashboardModal from '../components/DashboardModal';

/**
 * AdminDashboard component - Core interface for content management.
 * Provides CRUD operations for videos, photos, brands, testimonials, blog posts, live streams, and team members.
 */

const AdminDashboard = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [videos, setVideos] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [brands, setBrands] = useState([]);
    const [messages, setMessages] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [liveStreams, setLiveStreams] = useState([]);
    const [team, setTeam] = useState([]);
    const [pricingPlans, setPricingPlans] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 12;

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ 
        title: '', 
        description: '', 
        url: '', // for video
        image: null, // for photo file or brand logo
        category: 'wedding', // default
        is_featured: false,
        website_url: '', // for brand
        client_name: '', // for testimonial
        client_role: '', // for testimonial
        slug: '', // for blog
        author_name: 'XMP Team', // for blog
        is_published: true, // for blog
        is_live: false, // for live
        scheduled_at: '', // for live
        role: '', // for team
        service_type: 'video', // for pricing
        plan_name: '', // for pricing
        price: '', // for pricing
        features: '', // for pricing
        order: 0 // for pricing
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewStream, setPreviewStream] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showViewMessageModal, setShowViewMessageModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [responseContent, setResponseContent] = useState('');
    const [isResponding, setIsResponding] = useState(false);

    // Newsletter State
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [newsletterSubject, setNewsletterSubject] = useState('');
    const [newsletterContent, setNewsletterContent] = useState('');
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    /**
     * Fetches content based on the active tab, current page, and search term.
     * Handles different API endpoints and data structures for various content types.
     */
    const fetchContent = async () => {
        try {
            if (activeTab === 'dashboard') {
                const [v, p, b, m] = await Promise.all([
                    api.get('/videos/'),
                    api.get('/photos/'),
                    api.get('/blog/'),
                    api.get('/contact/')
                ]);
                setVideos(v.data.results || v.data);
                setPhotos(p.data.results || p.data);
                setBlogPosts(b.data.results || b.data);
                setMessages(m.data.results || m.data);
                setTotalCount(0); // Not using pagination on dashboard
                return;
            }

            const endpoint = activeTab === 'blog' ? '/blog/' :
                           activeTab === 'contact' || activeTab === 'messages' ? '/contact/' :
                           activeTab === 'newsletter' ? '/newsletter/' :
                           activeTab === 'pricing' ? '/pricing-plans/' :
                           `/${activeTab}/`;

            const params = {
                page: currentPage,
                search: searchTerm
            };

            const response = await api.get(endpoint, { params });
            const data = response.data.results || response.data;
            const count = response.data.count || (Array.isArray(data) ? data.length : 0);

            if (activeTab === 'videos') setVideos(data);
            else if (activeTab === 'photos') setPhotos(data);
            else if (activeTab === 'brands') setBrands(data);
            else if (activeTab === 'messages') setMessages(data);
            else if (activeTab === 'testimonials') setTestimonials(data);
            else if (activeTab === 'blog') setBlogPosts(data);
            else if (activeTab === 'live') setLiveStreams(data);
            else if (activeTab === 'team') setTeam(data);
            else if (activeTab === 'pricing') setPricingPlans(data);
            else if (activeTab === 'newsletter') setSubscribers(data);

            setTotalCount(count);
            
            // Fetch categories if needed
            if (categories.length === 0) {
                const catRes = await api.get('/categories/');
                setCategories(catRes.data.results || catRes.data);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                window.location.href = '/login';
            } else {
                toast.error('Failed to load content. Please try again.');
            }
        }
    };

    useEffect(() => {
        fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, currentPage]);

    // Handle Toggle Featured
    const handleToggleFeatured = async (id, currentStatus) => {
        try {
            await api.patch(`/${activeTab}/${id}/`, { is_featured: !currentStatus });
            toast.success(`Featured status updated successfully!`);
            fetchContent();
        } catch (error) {
            console.error("Error updating featured status:", error);
            toast.error('Failed to update status. Please try again.');
        }
    };

    // Handle Delete Trigger
    const handleDeleteTrigger = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    // Handle Add Trigger
    const handleAddTrigger = () => {
        setIsEditing(false);
        setEditId(null);
        setNewItem({ 
            title: '', 
            description: '', 
            url: '', 
            image: null, 
            category: categories.length > 0 ? categories[0].name.toLowerCase() : 'wedding', 
            is_featured: false, 
            website_url: '',
            client_name: '',
            client_role: '',
            slug: '',
            author_name: '',
            is_published: true, // for blog
            is_live: false, // for live
            scheduled_at: '', // for live
            role: '', // for team
            service_type: 'video', // for pricing
            plan_name: '', // for pricing
            price: '', // for pricing
            features: '', // for pricing
            order: 0, // for pricing
            is_popular: false // for pricing
        });
        setImagePreview(null);
        setValidationErrors([]);
        setShowModal(true);
    };

    const handleEditTrigger = (item) => {
        setIsEditing(true);
        setEditId(item.id);
        if (activeTab === 'live') {
            setNewItem({
                title: item.title,
                description: item.description,
                url: item.stream_url,
                is_live: item.is_live,
                scheduled_at: item.scheduled_at?.slice(0, 16) || '', // format for datetime-local
            });
        } else if (activeTab === 'pricing') {
            setNewItem({
                plan_name: item.plan_name,
                service_type: item.service_type,
                price: item.price,
                features: item.features,
                is_popular: item.is_popular,
                order: item.order
            });
            setShowModal(true);
        } else if (activeTab === 'messages') {
            handleViewMessage(item);
        }
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        setShowViewMessageModal(true);
        
        // Mark as read if not already
        if (!message.is_read) {
            try {
                await api.patch(`/contact/${message.id}/`, { is_read: true });
                // Update local state to reflect read status
                setMessages(messages.map(m => m.id === message.id ? { ...m, is_read: true } : m));
            } catch (error) {
                console.error("Error marking message as read:", error);
            }
        }
    };

    const handleSendResponse = async () => {
        if (!responseContent.trim()) return;
        
        setIsResponding(true);
        try {
            await api.post(`/contact/${selectedMessage.id}/respond/`, { 
                response_content: responseContent 
            });
            toast.success('Response sent successfully!');
            setShowViewMessageModal(false);
            setResponseContent('');
            fetchContent();
        } catch (error) {
            toast.error('Failed to send response');
            console.error(error);
        } finally {
            setIsResponding(false);
        }
    };

    const handleBroadcastNewsletter = async () => {
        if (!newsletterSubject.trim() || !newsletterContent.trim()) {
            toast.error('Subject and content are required.');
            return;
        }

        setIsBroadcasting(true);
        try {
            await api.post('/newsletter/broadcast/', {
                subject: newsletterSubject,
                content: newsletterContent
            });
            toast.success('Newsletter broadcasted successfully!');
            setShowNewsletterModal(false);
            setNewsletterSubject('');
            setNewsletterContent('');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to broadcast newsletter.');
        } finally {
            setIsBroadcasting(false);
        }
    };

    const handleToggleLive = async (stream) => {
        try {
            await api.patch(`/live/${stream.id}/`, { is_live: !stream.is_live });
            toast.success(`Stream ${!stream.is_live ? 'is now LIVE!' : 'has ended.'}`);
            fetchContent();
        } catch (error) {
            toast.error("Failed to update stream status.");
        }
    };

    // Confirm Delete Action
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        
        const id = itemToDelete.id;
        const endpoint = activeTab === 'messages' ? `/contact/${id}/` :
                         activeTab === 'pricing' ? `/pricing-plans/${id}/` :
                         `/${activeTab}/${id}/`;
        
        try {
            await api.delete(endpoint);
            setShowDeleteModal(false);
            setItemToDelete(null);
            toast.success('Item deleted successfully!');
            fetchContent();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error('Failed to delete item. Please try again.');
        }
    };

    /**
     * Handles the submission of new or edited content.
     * Manages payload construction for different content types, including FormData for file uploads.
     */
    const handleSubmit = async () => {
        // Validate photo upload
        if (activeTab === 'photos' && newItem.image) {
            const validation = await validateImage(newItem.image, {
                maxSizeMB: 10,
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            });
            
            if (!validation.valid) {
                setValidationErrors(validation.errors);
                toast.error('Image validation failed. Please check the requirements.');
                return;
            }
        }

        const endpoint = activeTab === 'pricing' ? '/pricing-plans/' :
                         activeTab === 'messages' ? '/contact/' :
                         `/${activeTab}/`;

        // Find category ID for videos/photos
        let categoryId = null;
        const needsCategory = ['videos', 'photos'].includes(activeTab);
        if (needsCategory) {
            const selectedCat = categories.find(c => c.name.toLowerCase() === newItem.category.toLowerCase());
            categoryId = selectedCat ? selectedCat.id : null;

            if (!categoryId) {
                toast.error('Invalid category selected.');
                return;
            }
        }

        try {
            let payload;
            const isMultipart = !['videos', 'live', 'pricing'].includes(activeTab);

            if (isMultipart) {
                payload = new FormData();
                if (activeTab === 'photos') {
                    payload.append('title', newItem.title);
                    payload.append('description', newItem.description);
                    payload.append('category_id', categoryId);
                    payload.append('is_featured', newItem.is_featured);
                    if (newItem.image) payload.append('image', newItem.image);
                } else if (activeTab === 'brands') {
                    payload.append('name', newItem.title);
                    if (newItem.website_url) payload.append('website_url', newItem.website_url);
                    if (newItem.image) payload.append('logo', newItem.image);
                } else if (activeTab === 'testimonials') {
                    payload.append('client_name', newItem.client_name || newItem.title);
                    payload.append('client_role', newItem.client_role);
                    payload.append('content', newItem.description);
                    if (newItem.image) payload.append('client_image', newItem.image);
                } else if (activeTab === 'blog') {
                    payload.append('title', newItem.title);
                    payload.append('content', newItem.description);
                    payload.append('author_name', newItem.author_name);
                    payload.append('is_published', newItem.is_published);
                    if (newItem.image) payload.append('featured_image', newItem.image);
                    if (!isEditing) payload.append('slug', newItem.slug || newItem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
                } else if (activeTab === 'team') {
                    payload.append('name', newItem.title);
                    payload.append('role', newItem.role);
                    if (newItem.image) payload.append('image', newItem.image);
                }
            } else {
                // Handling JSON payloads (videos, live, pricing)
                let cleanUrl = newItem.url;
                if (cleanUrl?.trim().startsWith('<iframe')) {
                    const srcMatch = cleanUrl.match(/src="([^"]+)"/);
                    cleanUrl = srcMatch?.[1] || cleanUrl;
                }

                if (activeTab === 'videos') {
                    payload = {
                        title: newItem.title,
                        description: newItem.description,
                        video_url: cleanUrl,
                        category_id: categoryId,
                        is_featured: newItem.is_featured,
                    };
                } else if (activeTab === 'live') {
                    payload = {
                        title: newItem.title,
                        description: newItem.description,
                        stream_url: cleanUrl,
                        is_live: newItem.is_live,
                        scheduled_at: newItem.scheduled_at || null
                    };
                } else if (activeTab === 'pricing') {
                    payload = {
                        plan_name: newItem.plan_name,
                        service_type: newItem.service_type,
                        price: newItem.price,
                        features: newItem.features,
                        is_popular: newItem.is_popular,
                        order: newItem.order
                    };
                }
            }

            if (isEditing) {
                await api.patch(`${endpoint}${editId}/`, payload, {
                    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}
                });
            } else {
                await api.post(endpoint, payload, {
                    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}
                });
            }

            toast.success(`Item ${isEditing ? 'updated' : 'added'} successfully!`);
            setShowModal(false);
            fetchContent();
        } catch (error) {
            console.error("Error saving content:", error);
            const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : "Check console for details.";
            toast.error(`Failed to save: ${errorMsg}`);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setValidationErrors([]);
        setNewItem({ ...newItem, image: file });

        const validation = await validateImage(file, { maxSizeMB: 10 });
        if (!validation.valid) {
            setValidationErrors(validation.errors);
        }

        try {
            const preview = await createImagePreview(file);
            setImagePreview(preview);
        } catch (err) {
            console.error("Error creating preview:", err);
        }
    };

    const sidebarItems = [
        { id: 'dashboard', label: 'Overview', icon: <FaEye /> },
        { id: 'videos', label: 'Videos', icon: <FaVideo /> },
        { id: 'photos', label: 'Photos', icon: <FaImage /> },
        { id: 'brands', label: 'Brands', icon: <FaStar /> },
        { id: 'testimonials', label: 'Testimonials', icon: <FaStar /> },
        { id: 'blog', label: 'Blog', icon: <FaPenNib /> },
        { id: 'live', label: 'Live', icon: <FaBroadcastTower /> },
        { id: 'team', label: 'Team', icon: <FaStar /> },
        { id: 'pricing', label: 'Pricing', icon: <FaMoneyBillAlt /> },
        { id: 'newsletter', label: 'Newsletter', icon: <FaEnvelope /> },
        { id: 'messages', label: 'Messages', icon: <FaEnvelope /> },
    ];

    // Polling for messages
    useEffect(() => {
        const checkMessages = async () => {
            try {
                const res = await api.get('/contact/');
                const msgs = res.data.results || res.data;
                setMessages(msgs);
            } catch (error) {
                console.error("Error polling messages:", error);
            }
        };

        const interval = setInterval(checkMessages, 30000); // Every 30s
        return () => clearInterval(interval);
    }, []);

    const renderDashboardOverview = () => {
        const stats = [
            { label: 'Videos', value: videos.length, icon: <FaVideo />, color: '#ff6600' },
            { label: 'Photos', value: photos.length, icon: <FaImage />, color: '#00ccff' },
            { label: 'Blog Posts', value: blogPosts.length, icon: <FaPenNib />, color: '#cc33ff' },
            { label: 'Unread Leads', value: messages.filter(m => !m.is_read).length, icon: <FaEnvelope />, color: '#ff3333' },
        ];

        return (
            <div className="dashboard-overview">
                <Row className="g-4 mb-5">
                    {stats.map((stat, idx) => (
                        <Col key={idx} md={6} lg={3}>
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="glass-card p-4 h-100 d-flex flex-column align-items-center text-center"
                            >
                                <div className="fs-1 mb-3" style={{ color: stat.color }}>{stat.icon}</div>
                                <h2 className="display-5 fw-bold text-white mb-1">{stat.value}</h2>
                                <p className="text-secondary text-uppercase small spacing-2 mb-0">{stat.label}</p>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
                
                <Row className="g-4">
                    <Col lg={8}>
                        <div className="glass-card p-4 mb-4">
                            <h4 className="fw-bold mb-4">Recent <span className="text-orange">Messages</span></h4>
                            {messages.slice(0, 5).map(msg => (
                                <div key={msg.id} className="d-flex align-items-center gap-3 p-3 rounded-3 border border-secondary border-opacity-10 mb-2 hover-bg-dark transition-all" style={{ cursor: 'pointer' }} onClick={() => handleViewMessage(msg)}>
                                    <div className={`p-2 rounded-circle ${msg.is_read ? 'bg-secondary opacity-25' : 'bg-orange pulse-dot'}`} style={{ width: '10px', height: '10px' }}></div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0 fw-bold">{msg.name}</h6>
                                        <p className="small text-secondary mb-0 text-truncate" style={{ maxWidth: '300px' }}>{msg.subject}</p>
                                    </div>
                                    <small className="text-secondary opacity-50">{new Date(msg.created_at).toLocaleDateString()}</small>
                                </div>
                            ))}
                            <Button variant="link" className="text-orange text-decoration-none p-0 mt-3" onClick={() => setActiveTab('messages')}>View all messages</Button>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="glass-card p-4">
                            <h4 className="fw-bold mb-4">Quick <span className="text-orange">Actions</span></h4>
                            <div className="d-grid gap-2">
                                <Button variant="outline-light" className="text-start py-3 px-4 rounded-3 border-secondary border-opacity-25" onClick={() => { setActiveTab('videos'); handleAddTrigger(); }}>
                                    <FaPlus className="me-2 text-orange" /> Add New Video
                                </Button>
                                <Button variant="outline-light" className="text-start py-3 px-4 rounded-3 border-secondary border-opacity-25" onClick={() => { setActiveTab('blog'); handleAddTrigger(); }}>
                                    <FaPlus className="me-2 text-orange" /> New Blog Post
                                </Button>
                                <Button variant="outline-light" className="text-start py-3 px-4 rounded-3 border-secondary border-opacity-25" onClick={() => setShowNewsletterModal(true)}>
                                    <FaEnvelope className="me-2 text-orange" /> Broadcast Newsletter
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <Container fluid className="pt-5 mt-5 min-vh-100 px-lg-5">
            <Row>
                {/* Sidebar */}
                <Col lg={2} md={3} className="mb-4">
                    <div className="glass-card p-3 sticky-top" style={{ top: '100px', zIndex: 10 }}>
                        <div className="mb-4 px-2 text-center">
                            <img 
                                src={logoOrange} 
                                alt="XMP Logo" 
                                width="60" 
                                className="mb-3"
                            />
                            <h5 className="fw-bold text-orange mb-1">CMS</h5>
                            <p className="small text-secondary mb-0">Dashboard</p>
                        </div>
                        <Nav variant="pills" className="flex-column gap-2">
                            {sidebarItems.map(item => (
                                <Nav.Item key={item.id}>
                                    <Nav.Link 
                                        onClick={() => setActiveTab(item.id)}
                                        className={`rounded-3 py-2 px-3 d-flex align-items-center gap-3 transition-all ${
                                            activeTab === item.id ? 'bg-orange text-white' : 'text-secondary hover-bg-dark'
                                        }`}
                                    >
                                        <span className="fs-6">{item.icon}</span>
                                        <span className="fw-medium">{item.label}</span>
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                        <div className="mt-5 pt-5 border-top border-secondary border-opacity-10 px-2 d-none d-md-block">
                            <p className="small text-secondary mb-0 opacity-50">Xclusvs Motion Pictures</p>
                            <p className="x-small text-secondary opacity-25">© 2025</p>
                        </div>
                    </div>
                </Col>

                {/* Main Content */}
                <Col lg={10} md={9}>
                    {activeTab !== 'dashboard' && (
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
                            <div>
                                <h2 className="fw-bold mb-1 h3 text-white">
                                    {sidebarItems.find(i => i.id === activeTab)?.label} <span className="text-orange">Management</span>
                                </h2>
                                <p className="text-secondary small mb-0">Total items: {totalCount}</p>
                            </div>
                            <div className="d-flex gap-3 align-items-center flex-wrap">
                                <div className="position-relative">
                                    <Form.Control
                                        type="text"
                                        placeholder={`Search ${sidebarItems.find(i => i.id === activeTab)?.label?.toLowerCase()}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-dark border-secondary text-white rounded-pill px-4 py-2 small search-input-cms"
                                        style={{ minWidth: '250px' }}
                                    />
                                    {searchTerm && (
                                        <FaTimesCircle 
                                            className="position-absolute translate-middle-y end-0 me-3 text-secondary cursor-pointer" 
                                            style={{ top: '50%' }}
                                            onClick={() => setSearchTerm('')}
                                        />
                                    )}
                                </div>
                                {activeTab !== 'messages' && activeTab !== 'newsletter' && (
                                    <Button variant="brand" className="px-4 py-2" onClick={handleAddTrigger}>
                                        <FaPlus className="me-2" /> Add {activeTab === 'videos' ? 'Video' : activeTab === 'photos' ? 'Photo' : activeTab === 'brands' ? 'Brand' : activeTab === 'testimonials' ? 'Testimonial' : activeTab === 'blog' ? 'Blog Post' : activeTab === 'team' ? 'Team Member' : activeTab === 'pricing' ? 'Pricing Plan' : 'Live Stream'}
                                    </Button>
                                )}
                                {activeTab === 'newsletter' && (
                                    <Button variant="brand" className="px-4 py-2" onClick={() => setShowNewsletterModal(true)}>
                                        <FaEnvelope className="me-2" /> Broadcast Newsletter
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'dashboard' ? (
                        <>
                            <div className="mb-5">
                                <h2 className="fw-bold mb-1 h3 text-white">Dashboard <span className="text-orange">Overview</span></h2>
                                <p className="text-secondary small mb-0">Welcome back, Administrator.</p>
                            </div>
                            {renderDashboardOverview()}
                        </>
                    ) : (
                        <>
                            <DashboardTable 
                                activeTab={activeTab}
                                data={(() => {
                                    const rawData = {
                                        'videos': videos,
                                        'photos': photos,
                                        'brands': brands,
                                        'messages': messages,
                                        'testimonials': testimonials,
                                        'blog': blogPosts,
                                        'live': liveStreams,
                                        'team': team,
                                        'pricing': pricingPlans,
                                        'newsletter': subscribers
                                    }[activeTab] || [];
                                    
                                    if (!searchTerm) return rawData;
                                    
                                    const term = searchTerm.toLowerCase();
                                    return rawData.filter(item => 
                                        (item.title?.toLowerCase().includes(term)) || 
                                        (item.name?.toLowerCase().includes(term)) || 
                                        (item.client_name?.toLowerCase().includes(term)) ||
                                        (item.plan_name?.toLowerCase().includes(term)) ||
                                        (item.subject?.toLowerCase().includes(term)) ||
                                        (item.message?.toLowerCase().includes(term))
                                    );
                                })()}
                                onDelete={handleDeleteTrigger}
                                onToggleFeatured={handleToggleFeatured}
                                onToggleLive={handleToggleLive}
                                onPreview={(stream) => { setPreviewStream(stream); setShowPreviewModal(true); }}
                                onEdit={handleEditTrigger}
                            />

                            <Pagination 
                                currentPage={currentPage}
                                totalCount={totalCount}
                                pageSize={pageSize}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        </>
                    )}
                </Col>
            </Row>

            <style>{`
                .transition-all {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hover-bg-dark:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white !important;
                }
                .x-small {
                    font-size: 0.7rem;
                }
            `}</style>

            {/* Dashboard Modal */}
            <DashboardModal 
                show={showModal}
                onHide={() => setShowModal(false)}
                activeTab={activeTab}
                isEditing={isEditing}
                newItem={newItem}
                setNewItem={setNewItem}
                categories={categories}
                validationErrors={validationErrors}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                formatFileSize={formatFileSize}
            />

            {/* Delete Confirmation Modal */}
            <Modal 
                show={showDeleteModal} 
                onHide={() => setShowDeleteModal(false)} 
                centered 
                size="sm"
                contentClassName="xmp-modal"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-6 opacity-50 text-uppercase spacing-2">Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4 px-4">
                    <div className="text-orange mb-4" style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 15px rgba(255,102,0,0.4))' }}>
                        <FaTrash />
                    </div>
                    <h4 className="fw-bold mb-3">Delete Permanent?</h4>
                    <p className="text-secondary small mb-0 px-2">
                        You are about to remove <span className="text-white fw-bold">{itemToDelete?.title || itemToDelete?.name || 'this item'}</span>. 
                        This action is irreversible.
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4 pt-0 gap-2">
                    <Button variant="outline-light" className="flex-grow-1 rounded-pill" onClick={() => setShowDeleteModal(false)}>
                        CANCEL
                    </Button>
                    <Button variant="brand" className="flex-grow-1 rounded-pill" onClick={handleConfirmDelete}>
                        DELETE
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Preview Modal */}
            <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} centered size="lg" className="glass-modal">
                <Modal.Header closeButton className="bg-dark text-white border-secondary">
                    <Modal.Title className="fw-bold">Preview: {previewStream?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark p-0">
                    <div className="ratio ratio-16x9">
                        {previewStream && (
                            <iframe 
                                src={getEmbedUrl(previewStream.stream_url)} 
                                title="Broadcast Preview"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>Close Preview</Button>
                    <Button 
                        variant={previewStream?.is_live ? "warning" : "danger"} 
                        onClick={() => { handleToggleLive(previewStream); setShowPreviewModal(false); }}
                    >
                        {previewStream?.is_live ? "End Broadcast" : "Launch Broadcast"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Message Modal */}
            <Modal 
                show={showViewMessageModal} 
                onHide={() => setShowViewMessageModal(false)} 
                centered 
                contentClassName="xmp-modal"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-6 opacity-50 text-uppercase spacing-2">Message Inquiry</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4 px-4">
                    <div className="mb-4">
                        <label className="text-orange small fw-bold text-uppercase d-block mb-1">From</label>
                        <h4 className="fw-bold mb-0 text-white">{selectedMessage?.name}</h4>
                        <p className="text-secondary small">{selectedMessage?.email}</p>
                    </div>
                    
                    <div className="mb-4">
                        <label className="text-orange small fw-bold text-uppercase d-block mb-1">Subject</label>
                        <h5 className="fw-bold text-white">{selectedMessage?.subject}</h5>
                    </div>

                    <div className="bg-black bg-opacity-50 p-4 rounded-3 border border-secondary border-opacity-25 mb-4">
                        <label className="text-orange small fw-bold text-uppercase d-block mb-2">Message Content</label>
                        <p className="text-white-50 mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {selectedMessage?.message}
                        </p>
                    </div>
                    
                    {selectedMessage?.response_content && (
                        <div className="bg-success bg-opacity-10 p-4 rounded-3 border border-success border-opacity-25 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="text-success small fw-bold text-uppercase d-block mb-0">Your Response</label>
                                <small className="text-success opacity-75">{new Date(selectedMessage.responded_at).toLocaleString()}</small>
                            </div>
                            <p className="text-white mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                {selectedMessage.response_content}
                            </p>
                        </div>
                    )}

                    {!selectedMessage?.response_content && (
                        <div className="mt-4">
                            <Form.Group>
                                <Form.Label className="text-orange small fw-bold text-uppercase">Reply to {selectedMessage?.name}</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={4} 
                                    className="bg-dark border-secondary text-white p-3"
                                    placeholder="Type your response here..."
                                    value={responseContent}
                                    onChange={(e) => setResponseContent(e.target.value)}
                                    disabled={isResponding}
                                />
                            </Form.Group>
                            <Button 
                                variant="brand" 
                                className="mt-3 w-100 rounded-pill py-2"
                                onClick={handleSendResponse}
                                disabled={isResponding || !responseContent.trim()}
                            >
                                {isResponding ? 'SENDING...' : 'SEND REPLY'}
                            </Button>
                        </div>
                    )}
                    
                    <div className="mt-4 text-end">
                        <small className="text-secondary">Received on {selectedMessage && new Date(selectedMessage.created_at).toLocaleString()}</small>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4 pt-0">
                    <Button variant="outline-light" className="w-100 rounded-pill py-2" onClick={() => setShowViewMessageModal(false)}>
                        CLOSE
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Newsletter Broadcast Modal */}
            <Modal 
                show={showNewsletterModal} 
                onHide={() => setShowNewsletterModal(false)} 
                centered 
                size="lg"
                contentClassName="xmp-modal"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fs-6 opacity-50 text-uppercase spacing-2">Newsletter Broadcast</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4 px-4">
                    <p className="text-secondary small mb-4">
                        This will send an email to all <span className="text-white fw-bold">{totalCount}</span> active subscribers.
                    </p>
                    
                    <Form.Group className="mb-4">
                        <Form.Label className="text-orange small fw-bold text-uppercase">Email Subject</Form.Label>
                        <Form.Control 
                            type="text" 
                            className="bg-dark border-secondary text-white p-3"
                            placeholder="e.g. Monthly Update - January 2026"
                            value={newsletterSubject}
                            onChange={(e) => setNewsletterSubject(e.target.value)}
                            disabled={isBroadcasting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="text-orange small fw-bold text-uppercase">Newsletter Content</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={10} 
                            className="bg-dark border-secondary text-white p-3"
                            placeholder="Write your newsletter content here..."
                            value={newsletterContent}
                            onChange={(e) => setNewsletterContent(e.target.value)}
                            disabled={isBroadcasting}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4 pt-0 gap-3">
                    <Button variant="outline-light" className="flex-grow-1 rounded-pill py-2" onClick={() => setShowNewsletterModal(false)}>
                        CANCEL
                    </Button>
                    <Button 
                        variant="brand" 
                        className="flex-grow-2 rounded-pill py-2 px-5"
                        onClick={handleBroadcastNewsletter}
                        disabled={isBroadcasting || !newsletterSubject.trim() || !newsletterContent.trim()}
                    >
                        {isBroadcasting ? 'SENDING BROADCAST...' : 'SEND TO ALL SUBSCRIBERS'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;

import React, { memo } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaTrash, FaStar, FaPlay, FaStop, FaEye, FaEdit } from 'react-icons/fa';
import VideoThumbnail from './VideoThumbnail';

// Memoized Row Component
const DashboardRow = memo(({ 
    item, 
    activeTab, 
    onDelete, 
    onToggleFeatured, 
    onToggleLive, 
    onPreview, 
    onEdit 
}) => {
    return (
        <tr>
            <td className="bg-transparent align-middle text-secondary">{item.id}</td>
            
            {/* Videos and Photos */}
            {(activeTab === 'videos' || activeTab === 'photos') && (
                <>
                    <td className="bg-transparent align-middle">
                        <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '8px', background: '#000' }}>
                            {activeTab === 'photos' ? (
                                <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover" loading="lazy" />
                            ) : (
                                <VideoThumbnail video={item} className="w-100 h-100 object-fit-cover" />
                            )}
                        </div>
                    </td>
                    <td className="bg-transparent align-middle fw-bold">{item.title}</td>
                    <td className="bg-transparent align-middle"><Badge bg="dark" className="border border-secondary text-secondary fw-normal">{item.category?.name || 'Uncategorized'}</Badge></td>
                    {activeTab === 'videos' && (
                        <td className="bg-transparent align-middle text-truncate" style={{maxWidth: '200px'}}>
                            <a href={item.video_url} target="_blank" rel="noreferrer" className="text-orange">{item.video_url}</a>
                        </td>
                    )}
                    <td className="bg-transparent align-middle">
                        <Button variant="link" className="p-0 text-decoration-none" onClick={() => onToggleFeatured(item.id, item.is_featured)} aria-label="Toggle featured status">
                            {item.is_featured ? (
                                <span className="text-orange small fw-bold"><FaStar /> Yes</span>
                            ) : (
                                <span className="text-secondary small opacity-25"><FaStar /> No</span>
                            )}
                        </Button>
                    </td>
                </>
            )}

            {/* Brands */}
            {activeTab === 'brands' && (
                <>
                    <td className="bg-transparent align-middle">
                        <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '8px', background: '#fff', padding: '5px' }}>
                            <img src={item.logo} alt={item.name} className="w-100 h-100 object-fit-contain" loading="lazy" />
                        </div>
                    </td>
                    <td className="bg-transparent align-middle fw-bold">{item.name}</td>
                    <td className="bg-transparent align-middle text-truncate" style={{maxWidth: '200px'}}>
                        {item.website_url ? <a href={item.website_url} target="_blank" rel="noreferrer" className="text-orange">{item.website_url}</a> : '-'}
                    </td>
                </>
            )}

            {/* Messages */}
            {activeTab === 'messages' && (
                <>
                    <td className="bg-transparent align-middle">
                        <div className="fw-bold text-white">
                            {!item.is_read && <span className="unread-dot" title="Unread"></span>}
                            {item.name}
                        </div>
                        <div className="small text-secondary">{item.email}</div>
                    </td>
                    <td className="bg-transparent align-middle">
                        <div className="fw-bold">
                            {item.subject}
                            {item.response_content && <span className="badge bg-success ms-2 small" style={{fontSize: '10px'}}>RESPONDED</span>}
                        </div>
                        <div className="small text-secondary text-truncate" style={{maxWidth: '300px'}}>{item.message}</div>
                    </td>
                    <td className="bg-transparent align-middle text-secondary small">
                        {new Date(item.created_at).toLocaleDateString()}
                    </td>
                </>
            )}

            {activeTab === 'newsletter' && (
                <>
                    <td className="bg-transparent align-middle py-3">
                        <div className="fw-bold text-white">{item.email}</div>
                    </td>
                    <td className="bg-transparent align-middle py-3">
                        <span className={`badge ${item.is_active ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td className="bg-transparent align-middle py-3 text-secondary small">
                        {new Date(item.created_at).toLocaleDateString()}
                    </td>
                </>
            )}

            {/* Testimonials */}
            {activeTab === 'testimonials' && (
                <>
                    <td className="bg-transparent align-middle">
                        <div className="d-flex align-items-center gap-3">
                            {item.client_image ? (
                                <img src={item.client_image} alt={item.client_name} className="rounded-circle object-fit-cover" width="40" height="40" loading="lazy" />
                            ) : (
                                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}><FaStar size={12}/></div>
                            )}
                            <div>
                                <div className="fw-bold text-white">{item.client_name}</div>
                                <div className="small text-secondary">{item.client_role || 'Client'}</div>
                            </div>
                        </div>
                    </td>
                    <td className="bg-transparent align-middle">
                        <div className="small text-secondary text-truncate" style={{maxWidth: '400px'}} title={item.content}>"{item.content}"</div>
                    </td>
                    <td className="bg-transparent align-middle text-secondary small">
                        {new Date(item.created_at).toLocaleDateString()}
                    </td>
                </>
            )}

            {/* Blog */}
            {activeTab === 'blog' && (
                <>
                    <td className="bg-transparent align-middle">
                        <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '8px' }}>
                            <img src={item.featured_image} alt={item.title} className="w-100 h-100 object-fit-cover" loading="lazy" />
                        </div>
                    </td>
                    <td className="bg-transparent align-middle fw-bold">{item.title}</td>
                    <td className="bg-transparent align-middle text-secondary">{item.author_name}</td>
                    <td className="bg-transparent align-middle">
                        <Badge bg={item.is_published ? "success" : "secondary"}>{item.is_published ? 'Published' : 'Draft'}</Badge>
                    </td>
                    <td className="bg-transparent align-middle text-secondary small">
                        {new Date(item.created_at).toLocaleDateString()}
                    </td>
                </>
            )}

            {/* Live */}
            {activeTab === 'live' && (
                <>
                    <td className="bg-transparent align-middle fw-bold">{item.title}</td>
                    <td className="bg-transparent align-middle">
                        <Badge bg={item.is_live ? "danger" : "secondary"}>{item.is_live ? 'LIVE' : 'Offline'}</Badge>
                    </td>
                    <td className="bg-transparent align-middle text-secondary small">
                        {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : '-'}
                    </td>
                    <td className="bg-transparent align-middle text-secondary small">
                        {new Date(item.created_at).toLocaleDateString()}
                    </td>
                </>
            )}

            {/* Team */}
            {activeTab === 'team' && (
                <>
                    <td className="bg-transparent align-middle">
                        <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '50%', background: '#333' }}>
                            <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" loading="lazy" />
                        </div>
                    </td>
                    <td className="bg-transparent align-middle fw-bold">{item.name}</td>
                    <td className="bg-transparent align-middle">{item.role}</td>
                </>
            )}
            
            {/* Pricing */}
            {activeTab === 'pricing' && (
                <>
                    <td className="bg-transparent align-middle fw-bold">{item.plan_name}</td>
                    <td className="bg-transparent align-middle text-capitalize">{item.service_type}</td>
                    <td className="bg-transparent align-middle text-orange fw-bold">${item.price}</td>
                    <td className="bg-transparent align-middle">
                        <Badge bg={item.is_popular ? "orange" : "secondary"}>{item.is_popular ? 'Yes' : 'No'}</Badge>
                    </td>
                    <td className="bg-transparent align-middle">{item.order}</td>
                </>
            )}

            <td className="bg-transparent align-middle text-end">
                <div className="d-flex justify-content-end gap-2">
                    {activeTab === 'live' && (
                        <>
                           <Button 
                               variant="link" 
                               className={`table-action-btn ${item.is_live ? 'text-warning' : 'text-success'}`}
                               title={item.is_live ? 'End Stream' : 'Go Live'}
                                aria-label={item.is_live ? 'End Stream' : 'Go Live'}
                                onClick={() => onToggleLive(item)}
                            >
                                {item.is_live ? <FaStop /> : <FaPlay />}
                            </Button>
                           <Button 
                               variant="link" 
                               className="table-action-btn text-info" 
                               title="Preview Feed"
                                aria-label="Preview Feed"
                                onClick={() => onPreview(item)}
                            >
                                <FaEye />
                            </Button>
                        </>
                    )}

                    {activeTab === 'messages' && (
                       <Button 
                           variant="link" 
                           className="table-action-btn text-info" 
                           title="View Message"
                            aria-label="View Message"
                            onClick={() => onEdit(item)}
                        >
                            <FaEye />
                        </Button>
                    )}
                    {activeTab !== 'messages' && (
                       <Button 
                           variant="link" 
                           className="table-action-btn text-white" 
                           title="Edit Details"
                            aria-label="Edit Details"
                            onClick={() => onEdit(item)}
                        >
                            <FaEdit />
                        </Button>
                    )}
                   <Button variant="link" className="table-action-btn text-danger" onClick={() => onDelete(item)} aria-label="Delete item">
                        <FaTrash />
                    </Button>
                </div>
            </td>
        </tr>
    );
});

/**
 * DashboardTable component for displaying content in the Admin Dashboard.
 * Optimized with React.memo for performance.
 */
const DashboardTable = memo(({ 
    activeTab, 
    data, 
    onDelete, 
    onToggleFeatured, 
    onToggleLive, 
    onPreview, 
    onEdit 
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-5 text-secondary admin-sidebar-card border-0 rounded-4">
                {activeTab === 'messages' ? 'No messages yet.' : 
                 activeTab === 'brands' ? 'No client brands added yet.' : 
                 activeTab === 'testimonials' ? 'No testimonials added yet.' : 
                 activeTab === 'blog' ? 'No blog posts yet.' : 
                 activeTab === 'live' ? 'No live streams added yet.' : 
                 activeTab === 'pricing' ? 'No pricing plans added yet.' : 
                 'No content found. Click "Add New" to get started.'}
            </div>
        );
    }

    return (
        <div className="admin-sidebar-card p-0 overflow-hidden border-0 shadow-lg rounded-4">
            <Table hover variant="dark" responsive className="mb-0 bg-transparent admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        {activeTab === 'messages' ? (
                            <>
                                <th className="bg-transparent text-secondary">Sender</th>
                                <th className="bg-transparent text-secondary">Message Content</th>
                                <th className="bg-transparent text-secondary">Date</th>
                            </>
                        ) : activeTab === 'team' ? (
                            <>
                                <th className="bg-transparent text-secondary">Image</th>
                                <th className="bg-transparent text-secondary">Name</th>
                                <th className="bg-transparent text-secondary">Role</th>
                            </>
                        ) : activeTab === 'testimonials' ? (
                            <>
                                <th className="bg-transparent text-secondary">Client</th>
                                <th className="bg-transparent text-secondary">Feedback</th>
                                <th className="bg-transparent text-secondary">Date</th>
                            </>
                        ) : activeTab === 'blog' ? (
                            <>
                                <th className="bg-transparent text-secondary">Preview</th>
                                <th className="bg-transparent text-secondary">Title</th>
                                <th className="bg-transparent text-secondary">Author</th>
                                <th className="bg-transparent text-secondary">Status</th>
                                <th className="bg-transparent text-secondary">Date</th>
                            </>
                        ) : activeTab === 'live' ? (
                            <>
                                <th className="bg-transparent text-secondary">Stream Title</th>
                                <th className="bg-transparent text-secondary">Status</th>
                                 <th className="bg-transparent text-secondary">Scheduled</th>
                                <th className="bg-transparent text-secondary">Date</th>
                            </>
                        ) : activeTab === 'pricing' ? (
                            <>
                                <th className="bg-transparent text-secondary">Plan Name</th>
                                <th className="bg-transparent text-secondary">Service</th>
                                <th className="bg-transparent text-secondary">Price</th>
                                <th className="bg-transparent text-secondary">Popular</th>
                                <th className="bg-transparent text-secondary">Order</th>
                            </>
                        ) : activeTab === 'newsletter' ? (
                            <>
                                <th className="bg-transparent text-secondary">Subscriber</th>
                                <th className="bg-transparent text-secondary">Status</th>
                                <th className="bg-transparent text-secondary">Joined</th>
                            </>
                        ) : (
                            <>
                                <th className="bg-transparent text-secondary">Preview</th>
                                <th className="bg-transparent text-secondary">{activeTab === 'brands' ? 'Brand Name' : 'Title'}</th>
                                {activeTab !== 'brands' && <th className="bg-transparent text-secondary">Category</th>}
                                {activeTab === 'videos' && <th className="bg-transparent text-secondary">URL</th>}
                                {activeTab === 'brands' && <th className="bg-transparent text-secondary">Website</th>}
                                {activeTab !== 'brands' && <th className="bg-transparent text-secondary">Featured</th>}
                            </>
                        )}
                        <th className="bg-transparent text-secondary text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <DashboardRow 
                            key={item.id}
                            item={item}
                            activeTab={activeTab}
                            onDelete={onDelete}
                            onToggleFeatured={onToggleFeatured}
                            onToggleLive={onToggleLive}
                            onPreview={onPreview}
                            onEdit={onEdit}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
});

export default DashboardTable;

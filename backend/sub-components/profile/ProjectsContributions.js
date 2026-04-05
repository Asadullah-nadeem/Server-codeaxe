import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Col, Card, Dropdown, Image, Spinner, Modal, Badge, Button } from 'react-bootstrap';
import { MoreVertical, User } from 'react-feather';
import { fetchApi } from "utils/api";
import { Eye } from 'react-bootstrap-icons';

const ProjectsContributions = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, profRes] = await Promise.all([
                    fetchApi("/admin/portfolio/items"),
                    fetchApi("/admin/profile")
                ]);
                
                if (projRes.success) setProjects(projRes.data.slice(0, 5));
                if (profRes.success) setProfile(profRes.value || profRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        (<Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover">
            {children}
        </Link>)
    ));

    CustomToggle.displayName = 'CustomToggle';

    const ActionMenu = () => {
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <MoreVertical size="15px" className="text-muted" />
                </Dropdown.Toggle>
                <Dropdown.Menu align={'end'}>
                    <Dropdown.Item eventKey="1">View Project</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Edit</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-sm mb-6">
                <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </Card.Body>
            </Card>
        );
    }

    const getIconStyle = (title, index) => {
        const colors = [
            { bg: '#eef2ff', color: '#4f46e5', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
            { bg: '#fff7ed', color: '#ea580c', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
            { bg: '#f0fdf4', color: '#16a34a', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
            { bg: '#faf5ff', color: '#9333ea', gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
            { bg: '#fdf2f8', color: '#db2777', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }
        ];
        return colors[index % colors.length];
    };

    return (
        <Card className="border-0 shadow-sm mb-6 pb-2">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Card.Title as="h4" className="mb-0 fw-bold">Projects Management</Card.Title>
                    <Link href="/cms/work" className="btn btn-link link-primary p-0 text-decoration-none small fw-bold">View All</Link>
                </div>
                {projects.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted small mb-0">No active projects found in portfolio.</p>
                    </div>
                ) : (
                    projects.map((item, index) => {
                        const style = getIconStyle(item.title, index);
                        return (
                            <div className="d-md-flex justify-content-between align-items-center mb-4" key={index}>
                                <div className="d-flex align-items-center">
                                    <div 
                                        className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                                        style={{ 
                                            width: '52px', 
                                            height: '52px', 
                                            backgroundColor: style.bg,
                                            border: `1px solid ${style.bg}` 
                                        }}
                                    >
                                        {item.image_url ? (
                                            <Image src={item.image_url} alt="" width="32" height="32" className="rounded-2" style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div className="text-white d-flex align-items-center justify-content-center rounded-2" style={{ width: '32px', height: '32px', background: style.gradient, fontSize: '14px', fontWeight: 'bold' }}>
                                                {item.title.substring(0, 1).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ms-3">
                                        <h5 className="mb-1">
                                            <Link href="#" className="text-inherit fw-bold">{item.title}</Link>
                                        </h5>
                                        <p className="mb-0 fs-6 text-muted" style={{ maxWidth: '280px' }}>{item.description.substring(0, 55)}...</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center ms-10 ms-md-0 mt-3 mt-md-0">
                                    <div className="avatar-group me-3 cursor-pointer" onClick={() => setShowProfileModal(true)} title="View Contributor Profile">
                                         <span className="avatar avatar-sm border border-2 border-white rounded-circle shadow-sm">
                                             {profile?.photo ? (
                                                 <Image alt="avatar" src={profile.photo} className="rounded-circle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                             ) : (
                                                 <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '100%', height: '100%', fontWeight: 'bold', fontSize: '10px' }}>
                                                     {profile?.name ? profile.name.charAt(0) : 'A'}
                                                 </div>
                                             )}
                                         </span>
                                     </div>
                                     <ActionMenu/>
                                 </div>
                            </div>
                        );
                    })
                )}

                {/* Profile Preview Modal (Mini Profile) */}
                <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered size="sm">
                    <Modal.Body className="p-0 overflow-hidden rounded-4 shadow-lg border-0">
                        <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                            <div className="mb-3">
                                {profile?.photo ? (
                                    <Image src={profile.photo} className="rounded-circle border border-3 border-white shadow" width={80} height={80} style={{objectFit: 'cover'}} />
                                ) : (
                                    <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center mx-auto shadow" style={{width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold'}}>
                                        {profile?.name?.charAt(0) || 'A'}
                                    </div>
                                )}
                            </div>
                            <h5 className="text-white mb-0 fw-bold">{profile?.name}</h5>
                            <p className="text-white opacity-75 small mb-0">@{profile?.username}</p>
                        </div>
                        <div className="p-4 bg-white">
                            <div className="mb-3">
                                <label className="text-muted x-small fw-bold text-uppercase mb-1">Assigned Role</label>
                                <p className="mb-0 fw-bold text-dark">{profile?.role}</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-muted x-small fw-bold text-uppercase mb-1">Email Endpoint</label>
                                <p className="mb-0 small text-truncate">{profile?.email}</p>
                            </div>
                            <Button variant="primary" className="w-100 rounded-pill py-2 shadow-sm" onClick={() => setShowProfileModal(false)}>
                                Close Preview
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    );
};

export default ProjectsContributions;
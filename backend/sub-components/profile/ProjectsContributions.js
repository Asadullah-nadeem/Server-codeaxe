// import node module libraries
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Col, Card, Dropdown, Image, Spinner } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import { fetchApi } from "utils/api";

const ProjectsContributions = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await fetchApi("/admin/portfolio/items");
                if (data.success) {
                    setProjects(data.data.slice(0, 5));
                }
            } catch (err) {
                console.error("Failed to fetch projects", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
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
                                    <div className="avatar-group me-3">
                                        <span className="avatar avatar-sm border border-2 border-white rounded-circle shadow-sm">
                                            <Image alt="avatar" src={`/images/avatar/avatar-${(index % 10) + 1}.jpg`} className="rounded-circle" />
                                        </span>
                                    </div>
                                    <ActionMenu/>
                                </div>
                            </div>
                        );
                    })
                )}
            </Card.Body>
        </Card>
    );
};

export default ProjectsContributions;
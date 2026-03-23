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
            <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
                <Card>
                    <Card.Body className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            <Card>
                <Card.Body>
                    <Card.Title as="h4">Projects Management</Card.Title>
                    {projects.length === 0 ? (
                        <p className="text-muted small">No projects found.</p>
                    ) : (
                        projects.map((item, index) => (
                            <div className="d-md-flex justify-content-between align-items-center mb-4" key={index}>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className={`icon-shape icon-md border p-4 rounded-1 bg-light`}>
                                            <Image src={item.image_url || '/images/brand/layers-logo.svg'} alt="" width="24" height="24" />
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <h5 className="mb-1">
                                            <Link href="#" className="text-inherit">{item.title}</Link>
                                        </h5>
                                        <p className="mb-0 fs-5 text-muted">{item.description.substring(0, 60)}...</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center ms-10 ms-md-0 mt-3">
                                    <div className="avatar-group me-2">
                                        <span className="avatar avatar-sm">
                                            <Image alt="avatar" src={`/images/avatar/avatar-${(index % 10) + 1}.jpg`} className="rounded-circle" />
                                        </span>
                                    </div>
                                    <ActionMenu/>
                                </div>
                            </div>
                        ))
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ProjectsContributions;
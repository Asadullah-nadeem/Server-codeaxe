import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Alert } from 'react-bootstrap';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '../../utils/api';

const NavigationCMS = () => {
    const [navItems, setNavItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, type: 'main', label: '', path: '', icon: '' });
    const [settings, setSettings] = useState({});
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settingsForm, setSettingsForm] = useState({
        nav_portfolio_label: '',
        nav_info_label: '',
        nav_btn_send_request: '',
        nav_btn_dashboard: '',
        nav_btn_login: '',
        nav_btn_signup: '',
        nav_btn_profile: ''
    });

    const fetchNavItems = async () => {
        try {
            setLoading(true);
            const { data } = await fetchApi('/admin/nav');
            // Assuming response has mainItems, portfolioItems, infoItems
            const allItems = [
                ...(data.mainItems || []),
                ...(data.portfolioItems || []),
                ...(data.infoItems || [])
            ];
            setNavItems(allItems);
            setSettings(data.settings || {});
        } catch (error) {
            console.error(error);
            alert('Failed to fetch navigation items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNavItems();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setFormData({ id: null, type: 'main', label: '', path: '', icon: '' });
    };

    const handleShow = (item = null) => {
        if (item) {
            setFormData(item);
        } else {
            setFormData({ id: null, type: 'main', label: '', path: '', icon: '' });
        }
        setShowModal(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                // Update
                await fetchApi(`/admin/nav/${formData.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData),
                });
            } else {
                // Create
                await fetchApi('/admin/nav', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });
            }
            handleClose();
            fetchNavItems();
        } catch (error) {
            alert(error.message || 'Failed to save navigation item.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this specific navigation item?')) return;
        try {
            await fetchApi(`/admin/nav/${id}`, { method: 'DELETE' });
            fetchNavItems();
        } catch (error) {
            alert(error.message || 'Failed to delete navigation item.');
        }
    };

    const handleSettingsShow = () => {
        setSettingsForm({
            nav_portfolio_label: settings.nav_portfolio_label || '',
            nav_info_label: settings.nav_info_label || '',
            nav_btn_send_request: settings.nav_btn_send_request || '',
            nav_btn_dashboard: settings.nav_btn_dashboard || '',
            nav_btn_login: settings.nav_btn_login || '',
            nav_btn_signup: settings.nav_btn_signup || '',
            nav_btn_profile: settings.nav_btn_profile || ''
        });
        setShowSettingsModal(true);
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/nav/settings', { method: 'PUT', body: JSON.stringify(settingsForm) });
            setShowSettingsModal(false);
            fetchNavItems();
        } catch (error) {
            alert(error.message || 'Failed to save header & SEO settings.');
        }
    };

    return (
        <Container fluid className="px-6 py-4">
            <NextSeo 
                title="Nav" 
                description="Navigation Management Page" 
            />
            <Row className="mb-4">
                <Col className="d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Header & Nav Management</h2>
                    <Button variant="primary" onClick={() => handleShow()}>Add New Link</Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Global Header & SEO Settings</h5>
                            <Button variant="light" size="sm" onClick={handleSettingsShow}>Edit Settings</Button>
                        </Card.Header>
                        <Card.Body>
                            {loading ? <p>Loading...</p> : (
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>SEO Tags</h6>
                                        <div className="bg-light p-3 rounded border">
                                            <p className="mb-0 text-muted small">Manage global SEO settings and founder information in the <Link href="/cms/rewrites">SEO & Rewrites</Link> section.</p>
                                        </div>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Branding</h6>
                                        <div className="d-flex align-items-center mb-2">
                                            {settings.site_logo_url ? (
                                                <Image 
                                                    src={settings.site_logo_url} 
                                                    alt="Logo" 
                                                    width={32}
                                                    height={32}
                                                    style={{ height: '32px', width: 'auto', marginRight: '12px' }} 
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                    unoptimized
                                                />
                                            ) : null}
                                            <span className="fs-5 fw-bold">
                                                {settings.site_name_prefix || 'Code'} <span className="text-primary">{settings.site_name_accent || 'Axe'}</span>
                                            </span>
                                        </div>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Nav Dropdown Labels</h6>
                                        <p className="mb-1"><strong>Portfolio:</strong> {settings.nav_portfolio_label || '-'}</p>
                                        <p className="mb-0"><strong>Info:</strong> {settings.nav_info_label || '-'}</p>
                                    </Col>
                                    <Col md={12} className="mt-2 pt-3 border-top">
                                        <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Nav Buttons</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            <span className="badge bg-secondary">Request: {settings.nav_btn_send_request || '-'}</span>
                                            <span className="badge bg-secondary">Dashboard: {settings.nav_btn_dashboard || '-'}</span>
                                            <span className="badge bg-secondary">Login: {settings.nav_btn_login || '-'}</span>
                                            <span className="badge bg-secondary">Signup: {settings.nav_btn_signup || '-'}</span>
                                            <span className="badge bg-secondary">Profile: {settings.nav_btn_profile || '-'}</span>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            {loading ? (
                                <p>Loading navigation items...</p>
                            ) : (
                                <Table responsive hover>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Type</th>
                                            <th>Label</th>
                                            <th>Path / URL</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {navItems.length === 0 ? (
                                            <tr><td colSpan="4">No links found.</td></tr>
                                        ) : navItems.map(item => (
                                            <tr key={item.id}>
                                                <td><span className="badge bg-secondary">{item.type}</span></td>
                                                <td>{item.label}</td>
                                                <td>{item.path}</td>
                                                <td>
                                                    <Button size="sm" variant="info" className="me-2" onClick={() => handleShow(item)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{formData.id ? 'Edit Link' : 'Add New Link'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Menu Type</Form.Label>
                            <Form.Select name="type" value={formData.type} onChange={handleChange}>
                                <option value="main">Main Nav</option>
                                <option value="portfolio">Portfolio Filters</option>
                                <option value="info">Info / Footer</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Label Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="label" 
                                required 
                                value={formData.label} 
                                onChange={handleChange} 
                                placeholder="e.g. Services" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Path / URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="path" 
                                required 
                                value={formData.path} 
                                onChange={handleChange} 
                                placeholder="e.g. /services" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Icon (e.g., from lucide-react)</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="icon" 
                                value={formData.icon || ''} 
                                onChange={handleChange} 
                                placeholder="e.g. Github, Twitter, Mail" 
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit">Save Changes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Header & SEO Settings Modal */}
            <Modal show={showSettingsModal} size="lg" onHide={() => setShowSettingsModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit Header & SEO Settings</Modal.Title></Modal.Header>
                <Form onSubmit={handleSettingsSubmit}>
                    <Modal.Body>
                        <Alert variant="info" className="mb-4 small">
                            Branding, SEO, and Founder settings are now managed in the <Link href="/cms/rewrites" className="fw-bold text-primary">SEO & Rewrites</Link> section.
                        </Alert>
                        
                        <h6 className="mt-2 mb-3 text-primary border-bottom pb-2">Nav Dropdown Labels</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Portfolio Label</Form.Label>
                                    <Form.Control type="text" value={settingsForm.nav_portfolio_label} onChange={e => setSettingsForm({...settingsForm, nav_portfolio_label: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Info Label</Form.Label>
                                    <Form.Control type="text" value={settingsForm.nav_info_label} onChange={e => setSettingsForm({...settingsForm, nav_info_label: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="mt-2 mb-3 text-primary border-bottom pb-2">Header Buttons</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2"><Form.Label>Send Request Button</Form.Label><Form.Control type="text" value={settingsForm.nav_btn_send_request} onChange={e => setSettingsForm({...settingsForm, nav_btn_send_request: e.target.value})} /></Form.Group>
                                <Form.Group className="mb-2"><Form.Label>Login Button</Form.Label><Form.Control type="text" value={settingsForm.nav_btn_login} onChange={e => setSettingsForm({...settingsForm, nav_btn_login: e.target.value})} /></Form.Group>
                                <Form.Group className="mb-2"><Form.Label>Profile Button</Form.Label><Form.Control type="text" value={settingsForm.nav_btn_profile} onChange={e => setSettingsForm({...settingsForm, nav_btn_profile: e.target.value})} /></Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2"><Form.Label>Dashboard Button</Form.Label><Form.Control type="text" value={settingsForm.nav_btn_dashboard} onChange={e => setSettingsForm({...settingsForm, nav_btn_dashboard: e.target.value})} /></Form.Group>
                                <Form.Group className="mb-2"><Form.Label>Signup Button</Form.Label><Form.Control type="text" value={settingsForm.nav_btn_signup} onChange={e => setSettingsForm({...settingsForm, nav_btn_signup: e.target.value})} /></Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>Close</Button>
                        <Button variant="primary" type="submit">Save Settings</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default NavigationCMS;

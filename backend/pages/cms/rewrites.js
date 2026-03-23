import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Badge, Alert } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';

const RewritesCMS = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ id: null, source: '', destination: '', description: '', sort_order: 0, is_active: 1 });
    const [settings, setSettings] = useState({});
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settingsForm, setSettingsForm] = useState({
        seo_title: '',
        seo_description: '',
        seo_google_analytics_id: '',
        seo_google_search_console_id: '',
        site_founder_name: '',
        site_founder_message: '',
        site_logo_url: '',
        site_name_prefix: '',
        site_name_accent: ''
    });

    const fetchRewrites = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/rewrites');
            if (res?.success) setData(res.data);
            
            // Also fetch global settings
            const settingsRes = await fetchApi('/admin/nav');
            if (settingsRes?.success) setSettings(settingsRes.data.settings || {});
        } catch (error) {
            console.error(error);
            alert('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRewrites(); }, []);

    const handleShow = (item = null) => {
        setForm(item ? item : { id: null, source: '', destination: '', description: '', sort_order: 0, is_active: 1 });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await fetchApi(`/admin/rewrites/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
            } else {
                await fetchApi('/admin/rewrites', { method: 'POST', body: JSON.stringify(form) });
            }
            setShowModal(false);
            fetchRewrites();
        } catch (error) { alert("Failed to save rewrite rule."); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetchApi(`/admin/rewrites/${id}`, { method: 'DELETE' });
            fetchRewrites();
        } catch (error) { alert("Failed to delete rule."); }
    };

    const handleSettingsShow = () => {
        setSettingsForm({
            seo_title: settings.seo_title || '',
            seo_description: settings.seo_description || '',
            seo_google_analytics_id: settings.seo_google_analytics_id || '',
            seo_google_search_console_id: settings.seo_google_search_console_id || '',
            site_founder_name: settings.site_founder_name || '',
            site_founder_message: settings.site_founder_message || '',
            site_logo_url: settings.site_logo_url || '',
            site_name_prefix: settings.site_name_prefix || '',
            site_name_accent: settings.site_name_accent || ''
        });
        setShowSettingsModal(true);
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/nav/settings', { method: 'PUT', body: JSON.stringify(settingsForm) });
            setShowSettingsModal(false);
            fetchRewrites();
        } catch (error) {
            alert('Failed to save SEO settings.');
        }
    };

    if (loading) return <Container fluid className="p-4"><p>Loading rewrites...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">SEO & Route Rewrites</h2>
            
            <Alert variant="info" className="mb-4">
                <strong>Note:</strong> Route rewrites allow you to map custom URLs to internal paths. Global SEO settings below apply to your entire site.
            </Alert>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-white">Global SEO & Founder Settings</h5>
                            <Button variant="light" size="sm" onClick={handleSettingsShow}>Edit SEO Settings</Button>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4} className="mb-3">
                                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Search Optimization</h6>
                                    <div className="bg-light p-3 rounded border">
                                        <p className="mb-1 fw-bold">{settings.seo_title || 'No Title Set'}</p>
                                        <p className="mb-1 text-muted small">{settings.seo_description || 'No Meta Description'}</p>
                                        {settings.seo_google_analytics_id && <p className="mb-1 text-info small"><strong>GA:</strong> {settings.seo_google_analytics_id}</p>}
                                        {settings.seo_google_search_console_id && <p className="mb-0 text-success small"><strong>GSC:</strong> {settings.seo_google_search_console_id}</p>}
                                    </div>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Site Branding</h6>
                                    <div className="bg-light p-3 rounded border">
                                        {settings.site_logo_url && <img src={settings.site_logo_url} alt="Logo" style={{ height: '24px', marginBottom: '8px' }} />}
                                        <p className="mb-0 fw-bold">{settings.site_name_prefix || 'Code'}<span className="text-primary">{settings.site_name_accent || 'Axe'}</span></p>
                                        <p className="mb-0 small text-muted">Logo: {settings.site_logo_url ? 'Configured' : 'Not Set'}</p>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Founder Hub</h6>
                                    <div className="bg-light p-3 rounded border">
                                        <p className="mb-1 fw-bold">{settings.site_founder_name || 'No Founder Name'}</p>
                                        <p className="mb-0 text-muted small italic line-clamp-2">"{settings.site_founder_message || 'No quote set.'}"</p>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Active Rewrite Rules</h5>
                    <Button variant="light" size="sm" onClick={() => handleShow()}>Add New Rule</Button>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead className="table-light">
                            <tr><th>Sort</th><th>Browser URL (Source)</th><th>Internal Path (Destination)</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {data.map(r => (
                                <tr key={r.id}>
                                    <td>{r.sort_order}</td>
                                    <td><code>{r.source}</code></td>
                                    <td><code>{r.destination}</code></td>
                                    <td><Badge bg={r.is_active ? 'success' : 'secondary'}>{r.is_active ? 'Active' : 'Disabled'}</Badge></td>
                                    <td>
                                        <Button size="sm" variant="info" className="me-2" onClick={() => handleShow(r)}>Edit</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{form.id ? 'Edit' : 'Add'} Rewrite Rule</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Browser URL (Incoming Path)</Form.Label>
                            <Form.Control type="text" placeholder="/web-services" value={form.source} onChange={e => setForm({...form, source: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Internal Path (Destination)</Form.Label>
                            <Form.Control type="text" placeholder="/service/web-dev" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Sort Order</Form.Label>
                            <Form.Control type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)})} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Description (internal notes)</Form.Label>
                            <Form.Control as="textarea" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                        </Form.Group>
                        <Form.Check type="switch" label="Active" checked={form.is_active === 1} onChange={e => setForm({...form, is_active: e.target.checked ? 1 : 0})} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Rule</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Global SEO Settings Modal */}
            <Modal show={showSettingsModal} size="lg" onHide={() => setShowSettingsModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit Global SEO & Branding</Modal.Title></Modal.Header>
                <Form onSubmit={handleSettingsSubmit}>
                    <Modal.Body>
                        <h6 className="mb-3 text-primary border-bottom pb-2">Meta Tags</h6>
                        <Form.Group className="mb-3">
                            <Form.Label>Meta Title</Form.Label>
                            <Form.Control type="text" value={settingsForm.seo_title} onChange={e => setSettingsForm({...settingsForm, seo_title: e.target.value})} placeholder="e.g. CodeAxe Web Agency" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Meta Description</Form.Label>
                            <Form.Control as="textarea" rows={2} value={settingsForm.seo_description} onChange={e => setSettingsForm({...settingsForm, seo_description: e.target.value})} />
                        </Form.Group>
                        
                        <h6 className="mt-4 mb-3 text-primary border-bottom pb-2">Search & Analytics</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Google Analytics ID</Form.Label>
                                    <Form.Control type="text" value={settingsForm.seo_google_analytics_id} onChange={e => setSettingsForm({...settingsForm, seo_google_analytics_id: e.target.value})} placeholder="GT-XXXXXXXXX" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Search Console ID</Form.Label>
                                    <Form.Control type="text" value={settingsForm.seo_google_search_console_id} onChange={e => setSettingsForm({...settingsForm, seo_google_search_console_id: e.target.value})} placeholder="verification code" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="mt-4 mb-3 text-primary border-bottom pb-2">Branding Information</h6>
                        <Form.Group className="mb-3">
                            <Form.Label>Logo URL (Full Path)</Form.Label>
                            <Form.Control type="text" value={settingsForm.site_logo_url} onChange={e => setSettingsForm({...settingsForm, site_logo_url: e.target.value})} placeholder="/images/logo.png" />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Site Name Prefix</Form.Label>
                                    <Form.Control type="text" value={settingsForm.site_name_prefix} onChange={e => setSettingsForm({...settingsForm, site_name_prefix: e.target.value})} placeholder="Code" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Site Name Accent</Form.Label>
                                    <Form.Control type="text" value={settingsForm.site_name_accent} onChange={e => setSettingsForm({...settingsForm, site_name_accent: e.target.value})} placeholder="Axe" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="mt-4 mb-3 text-primary border-bottom pb-2">Founder Identity</h6>
                        <Form.Group className="mb-3">
                            <Form.Label>Founder Name</Form.Label>
                            <Form.Control type="text" value={settingsForm.site_founder_name} onChange={e => setSettingsForm({...settingsForm, site_founder_name: e.target.value})} placeholder="e.g. Asadullah Nadeem" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Founder Message / Quote</Form.Label>
                            <Form.Control as="textarea" rows={3} value={settingsForm.site_founder_message} onChange={e => setSettingsForm({...settingsForm, site_founder_message: e.target.value})} placeholder="Crafting digital experiences..." />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save SEO Settings</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default RewritesCMS;

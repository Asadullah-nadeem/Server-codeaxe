import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Nav, Tab, Badge, Alert } from 'react-bootstrap';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const FooterCMS = () => {
    const [sections, setSections] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    
    const [showModal, setShowModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    
    // Default link form
    const [linkForm, setLinkForm] = useState({ 
        id: null, 
        section_id: '', 
        label: '', 
        url: '', 
        is_external: 0,
        icon: ''
    });

    const [settingsForm, setSettingsForm] = useState({
        footer_title: '',
        footer_subtitle: '',
        footer_contact_email: '',
        footer_contact_phone: '',
        footer_copyright: '',
        footer_is_visible: 1
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/footer');
            setSections(res.data?.sections || []);
            setSettings(res.data?.settings || {});
        } catch (error) {
            console.error(error);
            alert('Failed to fetch footer data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShow = (link = null, sectionId = '') => {
        if (link) {
            setLinkForm({ ...link });
        } else {
            setLinkForm({ 
                id: null, 
                section_id: sectionId, 
                label: '', 
                url: '', 
                is_external: 0,
                icon: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (linkForm.id) {
                await fetchApi(`/admin/footer/links/${linkForm.id}`, { method: 'PUT', body: JSON.stringify(linkForm) });
            } else {
                await fetchApi('/admin/footer/links', { method: 'POST', body: JSON.stringify(linkForm) });
            }
            setShowModal(false);
            fetchData();
        } catch (error) { 
            alert(error.message || 'Failed to save footer link.'); 
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this footer link?')) return;
        try {
            await fetchApi(`/admin/footer/links/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) { 
            alert(error.message || 'Failed to delete footer link.'); 
        }
    };

    const handleSettingsShow = () => {
        setSettingsForm({
            footer_title: settings.footer_title || '',
            footer_subtitle: settings.footer_subtitle || '',
            footer_contact_email: settings.footer_contact_email || '',
            footer_contact_phone: settings.footer_contact_phone || '',
            footer_copyright: settings.footer_copyright || '',
            footer_is_visible: settings.footer_is_visible !== undefined ? settings.footer_is_visible : 1
        });
        setShowSettingsModal(true);
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/footer/settings', { method: 'PUT', body: JSON.stringify(settingsForm) });
            setShowSettingsModal(false);
            fetchData();
        } catch (error) {
            alert(error.message || 'Failed to save footer settings.');
        }
    };

    return (
        <Container fluid className="px-6 py-4">
            <NextSeo 
                title="Footer" 
                description="Footer Management Page" 
            />
            <h2 className="mb-4">Footer Management</h2>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Global Footer Settings</h5>
                            <Button variant="light" size="sm" onClick={handleSettingsShow}>Edit Settings</Button>
                        </Card.Header>
                        <Card.Body>
                            {loading ? <LoadingSpinner text="Loading footer settings..." fluid={false} /> : (
                                <Row>
                                    <Col md={3} className="mb-3">
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
                                    <Col md={3} className="mb-3">
                                        <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Contact Details</h6>
                                        <p className="mb-1 text-truncate" title={settings.footer_contact_email}><i className="bi bi-envelope me-2 text-primary"></i> <a href={`mailto:${settings.footer_contact_email}`} className="text-decoration-none text-body">{settings.footer_contact_email || '-'}</a></p>
                                        <p className="mb-0 text-truncate" title={settings.footer_contact_phone}><i className="bi bi-telephone me-2 text-primary"></i> {settings.footer_contact_phone || '-'}</p>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Visibility</h6>
                                        <Badge bg={settings.footer_is_visible ? 'success' : 'danger'} className="px-3 py-2">
                                            {settings.footer_is_visible ? 'PUBLICLY VISIBLE' : 'HIDDEN'}
                                        </Badge>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Footer Text Area</h6>
                                        <div className="bg-light p-3 rounded border">
                                            <p className="mb-1 fw-bold">{settings.footer_title || 'No Title'}</p>
                                            <p className="mb-0 text-muted small">{settings.footer_subtitle || 'No Subtitle'}</p>
                                        </div>
                                    </Col>
                                    <Col md={3} className="mb-3">
                                        <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>SEO & Branding</h6>
                                        <div className="bg-light p-3 rounded border">
                                            <p className="mb-0 text-muted small">Manage global SEO settings and founder information in the <Link href="/cms/rewrites">SEO & Rewrites</Link> section.</p>
                                        </div>
                                    </Col>
                                    <Col md={12} className="mt-3 pt-3 border-top">
                                        <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Copyright Notice</h6>
                                        <div className="p-2 border rounded bg-light font-monospace small" dangerouslySetInnerHTML={{ __html: settings.footer_copyright || '-' }}></div>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Tab.Container defaultActiveKey={sections.length > 0 ? `section-${sections[0].id}` : 'loading'}>
                {sections.length > 0 && (
                    <Nav variant="tabs" className="mb-4">
                        {sections.map(section => (
                            <Nav.Item key={`nav-${section.id}`}>
                                <Nav.Link eventKey={`section-${section.id}`}>{section.title}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                )}

                <Tab.Content>
                    {sections.length === 0 && !loading && <p>No footer sections found in database.</p>}
                    {sections.map(section => (
                        <Tab.Pane eventKey={`section-${section.id}`} key={`pane-${section.id}`}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="mb-0">{section.title}</h4>
                                    <Badge bg="secondary">Type: {section.type}</Badge>
                                </div>
                                <Button variant="primary" onClick={() => handleShow(null, section.id)}>Add Link</Button>
                            </div>
                            
                            <Card>
                                <Card.Body>
                                    <Table hover responsive>
                                        <thead className="table-light">
                                            <tr>
                                                <th>Label</th>
                                                <th>URL</th>
                                                <th>External?</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section.links && section.links.length === 0 ? (
                                                <tr><td colSpan="4">No links in this section.</td></tr>
                                            ) : (
                                                section.links?.map(link => (
                                                    <tr key={link.id}>
                                                        <td><strong>{link.label}</strong></td>
                                                        <td><code>{link.url}</code></td>
                                                        <td>
                                                            <Badge bg={link.is_external ? 'info' : 'secondary'}>
                                                                {link.is_external ? 'Yes' : 'No'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Button size="sm" variant="info" className="me-2" onClick={() => handleShow(link, section.id)}>Edit</Button>
                                                            <Button size="sm" variant="danger" onClick={() => handleDelete(link.id)}>Delete</Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>

            {/* Link Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{linkForm.id ? 'Edit Footer Link' : 'New Footer Link'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Section</Form.Label>
                            <Form.Select value={linkForm.section_id} onChange={e => setLinkForm({...linkForm, section_id: e.target.value})} required>
                                <option value="">Select Section...</option>
                                {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.title}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Label</Form.Label>
                            <Form.Control type="text" value={linkForm.label} onChange={e => setLinkForm({...linkForm, label: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL / Path</Form.Label>
                            <Form.Control type="text" value={linkForm.url} onChange={e => setLinkForm({...linkForm, url: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Icon (e.g., from lucide-react)</Form.Label>
                            <Form.Control type="text" value={linkForm.icon || ''} onChange={e => setLinkForm({...linkForm, icon: e.target.value})} placeholder="e.g. Github, Twitter, Mail" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check type="checkbox" label="Open in new tab (External Link)?" checked={linkForm.is_external == 1} onChange={e => setLinkForm({...linkForm, is_external: e.target.checked ? 1 : 0})} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" type="submit">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Settings Modal */}
            <Modal show={showSettingsModal} size="lg" onHide={() => setShowSettingsModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit Global Footer Settings</Modal.Title></Modal.Header>
                <Form onSubmit={handleSettingsSubmit}>
                    <Modal.Body>
                        <Alert variant="info" className="mb-4 small">
                            Branding, SEO, and Founder settings are now managed in the <Link href="/cms/rewrites" className="fw-bold text-primary">SEO & Rewrites</Link> section.
                        </Alert>

                        <h6 className="mt-2 mb-3 text-primary border-bottom pb-2">Footer General Details</h6>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-4">
                                    <Form.Check 
                                        type="switch" 
                                        id="footer-visibility-switch" 
                                        label="Show Footer on Public Website" 
                                        checked={settingsForm.footer_is_visible == 1} 
                                        onChange={e => setSettingsForm({...settingsForm, footer_is_visible: e.target.checked ? 1 : 0})} 
                                        className="fw-bold text-primary"
                                    />
                                    <Form.Text className="text-muted small">Disable this to hide the footer and branding section completely from the frontend.</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Footer Title</Form.Label>
                                    <Form.Control type="text" value={settingsForm.footer_title} onChange={e => setSettingsForm({...settingsForm, footer_title: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Footer Subtitle</Form.Label>
                                    <Form.Control type="text" value={settingsForm.footer_subtitle} onChange={e => setSettingsForm({...settingsForm, footer_subtitle: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Email</Form.Label>
                                    <Form.Control type="email" value={settingsForm.footer_contact_email} onChange={e => setSettingsForm({...settingsForm, footer_contact_email: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Phone</Form.Label>
                                    <Form.Control type="text" value={settingsForm.footer_contact_phone} onChange={e => setSettingsForm({...settingsForm, footer_contact_phone: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Copyright Text (HTML allowed)</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={settingsForm.footer_copyright} onChange={e => setSettingsForm({...settingsForm, footer_copyright: e.target.value})} />
                                </Form.Group>
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

export default FooterCMS;

import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Badge, Alert, Spinner, InputGroup } from 'react-bootstrap';
import Image from 'next/image';
import { fetchApi } from '../../utils/api';

// ─── Default Section Definitions ───────────────────────────────────────────
const SECTION_DEFS = [
    { key: 'hero',          label: 'Hero Banner',        page: 'Home',   desc: 'Main landing hero with CTA buttons.' },
    { key: 'stats',         label: 'Company Stats',      page: 'Home',   desc: 'Achievement numbers on homepage.' },
    { key: 'partners',      label: 'Partners / Clients', page: 'Home',   desc: 'Partner logo strip.' },
    { key: 'services',      label: 'Services',           page: 'Home',   desc: 'Core services showcase cards.' },
    { key: 'projects',      label: 'Featured Projects',  page: 'Home',   desc: 'Portfolio highlights on homepage.' },
    { key: 'principles',    label: 'Why CodeAxe',        page: 'Home',   desc: 'Core values and principles.' },
    { key: 'technologies',  label: 'Technologies',       page: 'Home',   desc: 'Tech stack logos carousel.' },
    { key: 'system_status', label: 'System Status',      page: 'Home',   desc: 'Live uptime panel in hero sidebar.' },
    { key: 'cta',           label: 'Call To Action',     page: 'Home',   desc: 'Bottom CTA conversion banner.' },
    { key: 'navigation',    label: 'Navigation Bar',     page: 'Global', desc: 'Top navbar shown on all pages.' },
    { key: 'footer',        label: 'Footer',             page: 'Global', desc: 'Bottom footer on all pages.' },
    { key: 'about_hero',    label: 'About Hero',         page: 'About',  desc: 'About page hero header.' },
    { key: 'about_team',    label: 'Team Members',       page: 'About',  desc: 'Team member cards grid.' },
    { key: 'portfolio',     label: 'Portfolio Grid',     page: 'Portfolio', desc: 'Full portfolio project grid.' },
    { key: 'contact_form',  label: 'Contact Form',       page: 'Contact', desc: 'Main contact form.' },
    { key: 'legal',         label: 'Legal Pages',        page: 'Global', desc: 'Privacy, Terms, Refund pages.' },
];

const PAGE_GROUPS = ['All', 'Home', 'Global', 'About', 'Portfolio', 'Contact'];

const RewritesCMS = () => {
    // ── Rewrites ──
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ id: null, source: '', destination: '', description: '', sort_order: 0, is_active: 1 });

    // ── Global SEO Settings ──
    const [settings, setSettings] = useState({});
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settingsForm, setSettingsForm] = useState({
        seo_title: '', seo_description: '', seo_google_analytics_id: '',
        seo_google_search_console_id: '', site_founder_name: '', site_founder_message: '',
        site_logo_url: '', site_name_prefix: '', site_name_accent: '',
        site_favicon_url: '', site_apple_icon_url: '', site_footer_logo_url: '', seo_keywords: '',
        social_facebook: '', social_instagram: '', social_linkedin: '', social_twitter: ''
    });

    // ── Section Visibility ──
    const [sectionMap, setSectionMap] = useState({});   // { hero: true, services: false, ... }
    const [sectionsLoading, setSectionsLoading] = useState(true);
    const [sectionSaving, setSectionSaving] = useState(null); // key of section being saved
    const [pageFilter, setPageFilter] = useState('All');
    const [sectionSuccess, setSectionSuccess] = useState('');
    // ── Media Selector ──
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaItems, setMediaItems] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [activeField, setActiveField] = useState('site_logo_url');

    const fetchMediaItems = async () => {
        try {
            setMediaLoading(true);
            const res = await fetchApi('/admin/dms/media');
            if (res?.success) setMediaItems(res.data);
        } catch (error) { console.error(error); }
        finally { setMediaLoading(false); }
    };

    const handleMediaSelect = (path) => {
        setSettingsForm({ ...settingsForm, [activeField]: path });
        setShowMediaModal(false);
    };

    const openMediaPicker = (field) => {
        setActiveField(field);
        fetchMediaItems();
        setShowMediaModal(true);
    };

    // ────────────────────────────────────────────────────────────────────────
    const fetchAll = async () => {
        try {
            setLoading(true);
            const [rewriteRes, navRes] = await Promise.all([
                fetchApi('/admin/rewrites'),
                fetchApi('/admin/nav'),
            ]);
            if (rewriteRes?.success) setData(rewriteRes.data);
            if (navRes?.success) setSettings(navRes.data.settings || {});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async () => {
        try {
            setSectionsLoading(true);
            const res = await fetchApi('/admin/sections');
            if (res?.success && Array.isArray(res.data)) {
                const map = {};
                res.data.forEach(s => { map[s.section_key] = Boolean(s.is_enabled); });
                setSectionMap(map);
            }
        } catch (err) {
            console.error('Failed fetching sections', err);
        } finally {
            setSectionsLoading(false);
        }
    };

    useEffect(() => { fetchAll(); fetchSections(); }, []);

    // ── Rewrite handlers ───────────────────────────────────────────────────
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
            fetchAll();
        } catch { alert('Failed to save rewrite rule.'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetchApi(`/admin/rewrites/${id}`, { method: 'DELETE' });
            fetchAll();
        } catch { alert('Failed to delete rule.'); }
    };

    // ── Settings handlers ──────────────────────────────────────────────────
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
            site_name_accent: settings.site_name_accent || '',
            site_favicon_url: settings.site_favicon_url || '',
            site_apple_icon_url: settings.site_apple_icon_url || '',
            site_footer_logo_url: settings.site_footer_logo_url || '',
            seo_keywords: settings.seo_keywords || '',
            social_facebook: settings.social_facebook || '',
            social_instagram: settings.social_instagram || '',
            social_linkedin: settings.social_linkedin || '',
            social_twitter: settings.social_twitter || '',
        });
        setShowSettingsModal(true);
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/nav/settings', { method: 'PUT', body: JSON.stringify(settingsForm) });
            setShowSettingsModal(false);
            fetchAll();
        } catch { alert('Failed to save SEO settings.'); }
    };

    // ── Section toggle ──────────────────────────────────────────────────────
    const toggleSection = async (key, currentValue) => {
        const newValue = !currentValue;
        setSectionMap(prev => ({ ...prev, [key]: newValue }));
        setSectionSaving(key);
        try {
            await fetchApi('/admin/sections', {
                method: 'POST',
                body: JSON.stringify({ section_key: key, is_enabled: newValue }),
            });
            setSectionSuccess(`"${SECTION_DEFS.find(s => s.key === key)?.label}" ${newValue ? 'enabled' : 'disabled'}.`);
            setTimeout(() => setSectionSuccess(''), 3000);
        } catch {
            // revert on error
            setSectionMap(prev => ({ ...prev, [key]: currentValue }));
            alert('Failed to update section.');
        } finally {
            setSectionSaving(null);
        }
    };

    const filteredSections = SECTION_DEFS.filter(s => pageFilter === 'All' || s.page === pageFilter);

    if (loading) return <Container fluid className="p-4"><p>Loading...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">SEO &amp; Route Rewrites</h2>

            <Alert variant="info" className="mb-4">
                <strong>Note:</strong> Manage global SEO settings, route rewrites, and frontend section visibility from this page.
            </Alert>

            {/* ── Global SEO Settings ── */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Header className="bg-primary text-white py-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <h5 className="mb-0 text-white">Global SEO &amp; Brand Settings</h5>
                                <Button variant="light" size="sm" onClick={handleSettingsShow}>Edit SEO Settings</Button>
                            </div>
                            <small className="text-white-50">Changes here update the platform icons and metadata across all devices.</small>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4} className="mb-3">
                                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Global Meta &amp; Analytics</h6>
                                    <div className="bg-light p-3 rounded border">
                                        <p className="mb-1 fw-bold">{settings.seo_title || 'No Title Set'}</p>
                                        <p className="mb-2 text-muted small text-truncate">{settings.seo_description || 'No Meta Description'}</p>
                                        <div className="d-flex gap-2 mb-2">
                                            {settings.seo_google_analytics_id ? <Badge bg="info">GA ID: {settings.seo_google_analytics_id}</Badge> : <Badge bg="secondary">GA Not Set</Badge>}
                                            {settings.seo_google_search_console_id ? <Badge bg="success">GSC Active</Badge> : <Badge bg="secondary">GSC Not Set</Badge>}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Site Branding Assets</h6>
                                    <div className="bg-light p-3 rounded border">
                                        <div className="d-flex gap-4 mb-2">
                                            {settings.site_logo_url && <div><small className="d-block text-muted mb-1">Navbar</small><Image src={settings.site_logo_url} alt="Logo" width={48} height={24} style={{ height: '24px', width: 'auto' }} unoptimized /></div>}
                                            {settings.site_footer_logo_url && <div><small className="d-block text-muted mb-1">Footer</small><Image src={settings.site_footer_logo_url} alt="Logo" width={48} height={24} style={{ height: '24px', width: 'auto' }} unoptimized /></div>}
                                            {settings.site_favicon_url && <div><small className="d-block text-muted mb-1">Favicon</small><Image src={settings.site_favicon_url} alt="Logo" width={24} height={24} style={{ height: '24px', width: 'auto' }} unoptimized /></div>}
                                        </div>
                                        <p className="mb-0 fw-bold">{settings.site_name_prefix || 'Code'}<span className="text-primary">{settings.site_name_accent || 'Axe'}</span></p>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Founder Hub</h6>
                                    <div className="bg-light p-3 rounded border">
                                        <p className="mb-1 fw-bold">{settings.site_founder_name || 'No Founder Name'}</p>
                                        <p className="mb-0 text-muted small italic" style={{ fontSize: '0.7rem' }}>&quot;{settings.site_founder_message || 'No quote set.'}&quot;</p>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* ── Section Visibility ── */}
            <Card className="mb-4">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0 text-white">Frontend Section Visibility</h5>
                        <small className="text-white-50">Toggle which sections appear on the live website</small>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        {PAGE_GROUPS.map(g => (
                            <Button
                                key={g}
                                size="sm"
                                variant={pageFilter === g ? 'light' : 'outline-light'}
                                onClick={() => setPageFilter(g)}
                            >
                                {g}
                            </Button>
                        ))}
                    </div>
                </Card.Header>
                <Card.Body>
                    {sectionSuccess && <Alert variant="success" className="py-2 small mb-3">{sectionSuccess}</Alert>}
                    {sectionsLoading ? (
                        <div className="text-center py-4"><Spinner animation="border" size="sm" /></div>
                    ) : (
                        <Row className="g-3">
                            {filteredSections.map(s => {
                                const enabled = sectionMap[s.key] !== false;
                                const saving = sectionSaving === s.key;
                                return (
                                    <Col md={4} key={s.key}>
                                        <div className={`border rounded p-3 h-100 d-flex align-items-start gap-3 ${enabled ? 'border-success bg-light' : 'border-danger bg-light opacity-75'}`}>
                                            <div
                                                onClick={() => !saving && toggleSection(s.key, enabled)}
                                                style={{
                                                    width: 42, height: 24, borderRadius: 12, flexShrink: 0, cursor: saving ? 'not-allowed' : 'pointer',
                                                    backgroundColor: enabled ? '#198754' : '#dc3545',
                                                    position: 'relative', transition: 'background 0.2s', marginTop: 2,
                                                }}
                                            >
                                                <div style={{
                                                    width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
                                                    position: 'absolute', top: 3, transition: 'left 0.2s',
                                                    left: enabled ? 20 : 4,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,.3)',
                                                }} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="fw-semibold small">{s.label}</span>
                                                    <Badge bg={enabled ? 'success' : 'danger'} style={{ fontSize: '0.65rem' }}>
                                                        {saving ? '…' : enabled ? 'ON' : 'OFF'}
                                                    </Badge>
                                                    <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>{s.page}</Badge>
                                                </div>
                                                <p className="text-muted small mb-0 mt-1">{s.desc}</p>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </Card.Body>
            </Card>

            {/* ── Active Rewrite Rules ── */}
            <Card>
                <Card.Header className="bg-secondary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-white">Active Rewrite Rules</h5>
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
                            {data.length === 0 && (
                                <tr><td colSpan="5" className="text-center text-muted py-4">No rewrite rules yet. Add one above.</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* ── Rewrite Rule Modal ── */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{form.id ? 'Edit' : 'Add'} Rewrite Rule</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Browser URL (Incoming Path)</Form.Label>
                            <Form.Control type="text" placeholder="/web-services" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Internal Path (Destination)</Form.Label>
                            <Form.Control type="text" placeholder="/service/web-dev" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Sort Order</Form.Label>
                            <Form.Control type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) })} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Description (internal notes)</Form.Label>
                            <Form.Control as="textarea" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </Form.Group>
                        <Form.Check type="switch" label="Active" checked={form.is_active === 1} onChange={e => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Rule</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ── Global SEO Settings Modal ── */}
            <Modal show={showSettingsModal} size="lg" onHide={() => setShowSettingsModal(false)}>
                <Modal.Header closeButton className="bg-light pb-3">
                    <div>
                        <Modal.Title className="fw-bold fs-4">Global SEO &amp; Brand Settings</Modal.Title>
                        <small className="text-muted">Changes here update the platform icons and metadata across all devices.</small>
                    </div>
                </Modal.Header>
                <Form onSubmit={handleSettingsSubmit}>
                    <Modal.Body className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <h6 className="mb-3 text-primary border-bottom pb-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Core Metadata</h6>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Platform Meta Title</Form.Label>
                            <Form.Control type="text" value={settingsForm.seo_title} onChange={e => setSettingsForm({ ...settingsForm, seo_title: e.target.value })} placeholder="e.g. CodeAxe Web Agency" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Global SEO Description</Form.Label>
                            <Form.Control as="textarea" rows={2} value={settingsForm.seo_description} onChange={e => setSettingsForm({ ...settingsForm, seo_description: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Global SEO Keywords (comma separated)</Form.Label>
                            <Form.Control type="text" value={settingsForm.seo_keywords} onChange={e => setSettingsForm({ ...settingsForm, seo_keywords: e.target.value })} placeholder="e.g. web design, app development, agency" />
                        </Form.Group>

                        <h6 className="mt-4 mb-3 text-primary border-bottom pb-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Search &amp; Analytics</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="small fw-bold">Google Analytics Tracking ID</Form.Label>
                                    <Form.Control type="text" value={settingsForm.seo_google_analytics_id} onChange={e => setSettingsForm({ ...settingsForm, seo_google_analytics_id: e.target.value })} placeholder="G-XXXXXXXXXX" />
                                    <Form.Text className="x-small text-muted">Used for traffic tracking via Gtag.</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="small fw-bold">Google Search Console Verification</Form.Label>
                                    <Form.Control type="text" value={settingsForm.seo_google_search_console_id} onChange={e => setSettingsForm({ ...settingsForm, seo_google_search_console_id: e.target.value })} placeholder="Verification code" />
                                    <Form.Text className="x-small text-muted">HTML-tag based site ownership verification.</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="mt-4 mb-3 text-primary border-bottom pb-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Visual Branding Assets</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="small fw-bold">Navbar Logo (Primary)</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control type="text" value={settingsForm.site_logo_url} readOnly />
                                        <Button variant="outline-primary" size="sm" onClick={() => openMediaPicker('site_logo_url')}>Pick</Button>
                                    </div>
                                    <Form.Text className="x-small text-muted">Shown in top navigation.</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="small fw-bold">Footer Logo (Secondary)</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control type="text" value={settingsForm.site_footer_logo_url} readOnly />
                                        <Button variant="outline-primary" size="sm" onClick={() => openMediaPicker('site_footer_logo_url')}>Pick</Button>
                                    </div>
                                    <Form.Text className="x-small text-muted">Shown in bottom site footer.</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="small fw-bold">Favicon (.ico/.png)</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control type="text" value={settingsForm.site_favicon_url} readOnly />
                                        <Button variant="outline-primary" size="sm" onClick={() => openMediaPicker('site_favicon_url')}>Pick</Button>
                                    </div>
                                    <Form.Text className="x-small text-muted">Browser tab icon (16x16 or 32x32).</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="small fw-bold">Apple Web Icon (Mobile)</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control type="text" value={settingsForm.site_apple_icon_url} readOnly />
                                        <Button variant="outline-primary" size="sm" onClick={() => openMediaPicker('site_apple_icon_url')}>Pick</Button>
                                    </div>
                                    <Form.Text className="x-small text-muted">Homescreen icon for iOS (180x180).</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="mt-4 mb-3 text-primary border-bottom pb-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Identity Text</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="small fw-bold">Site Name Prefix</Form.Label>
                                    <Form.Control type="text" value={settingsForm.site_name_prefix} onChange={e => setSettingsForm({ ...settingsForm, site_name_prefix: e.target.value })} placeholder="Code" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="small fw-bold">Site Name Accent</Form.Label>
                                    <Form.Control type="text" value={settingsForm.site_name_accent} onChange={e => setSettingsForm({ ...settingsForm, site_name_accent: e.target.value })} placeholder="Technologies" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="mt-4 mb-3 text-primary border-bottom pb-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Founder Insight</h6>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Founder Display Name</Form.Label>
                            <Form.Control type="text" value={settingsForm.site_founder_name} onChange={e => setSettingsForm({ ...settingsForm, site_founder_name: e.target.value })} placeholder="Asadullah Nadeem" />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Leadership Message</Form.Label>
                            <Form.Control as="textarea" rows={2} value={settingsForm.site_founder_message} onChange={e => setSettingsForm({ ...settingsForm, site_founder_message: e.target.value })} />
                        </Form.Group>

                        <h6 className="mt-4 mb-3 text-primary border-bottom pb-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Social Media Connect</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Facebook URL</Form.Label>
                                    <Form.Control type="url" value={settingsForm.social_facebook} onChange={e => setSettingsForm({ ...settingsForm, social_facebook: e.target.value })} placeholder="https://facebook.com/..." />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Instagram URL</Form.Label>
                                    <Form.Control type="url" value={settingsForm.social_instagram} onChange={e => setSettingsForm({ ...settingsForm, social_instagram: e.target.value })} placeholder="https://instagram.com/..." />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">LinkedIn URL</Form.Label>
                                    <Form.Control type="url" value={settingsForm.social_linkedin} onChange={e => setSettingsForm({ ...settingsForm, social_linkedin: e.target.value })} placeholder="https://linkedin.com/..." />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Twitter / X URL</Form.Label>
                                    <Form.Control type="url" value={settingsForm.social_twitter} onChange={e => setSettingsForm({ ...settingsForm, social_twitter: e.target.value })} placeholder="https://x.com/..." />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" className="px-4">Update Platform Settings</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Media Picker Modal */}
            <Modal show={showMediaModal} size="xl" scrollable onHide={() => setShowMediaModal(false)}>
                <Modal.Header closeButton className="bg-light">
                    <div>
                        <Modal.Title className="fw-bold">Select or Upload Asset</Modal.Title>
                        <small className="text-muted">Pick an existing file from your cloud library or upload a new one.</small>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <Row className="g-0">
                        {/* Left Sidebar: Upload */}
                        <Col md={3} className="border-end bg-light p-4">
                            <h6 className="fw-bold mb-3 small text-uppercase">Direct Upload</h6>
                            <div 
                                className="border border-dashed p-4 text-center mb-3 bg-white rounded cursor-pointer"
                                onClick={() => document.getElementById('quickUpload').click()}
                            >
                                <i className="fe fe-upload-cloud fs-3 text-primary mb-2 d-block"></i>
                                <p className="mb-0 x-small fw-bold">Click to Upload</p>
                                <input 
                                    type="file" 
                                    id="quickUpload" 
                                    hidden 
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        try {
                                            setMediaLoading(true);
                                            const formData = new FormData();
                                            formData.append('photo', file);
                                            formData.append('storage_provider', 'imagekit');
                                            formData.append('username', 'admin');
                                            const res = await fetchApi('/admin/dms/media', { method: 'POST', body: formData });
                                            if (res?.success) {
                                                await fetchMediaItems();
                                                handleMediaSelect(res.url); // res.url is the path
                                            } else { alert(res?.message || 'Upload failed.'); }
                                        } catch (err) { alert('Upload error.'); }
                                        finally { setMediaLoading(false); }
                                    }} 
                                />
                            </div>
                            <div className="small text-muted mb-4" style={{ fontSize: '0.65rem' }}>
                                <i className="fe fe-info me-1"></i> Assets are synced to your primary cloud storage (ImageKit).
                            </div>
                        </Col>

                        {/* Right Section: Gallery */}
                        <Col md={9} className="p-4" style={{ backgroundColor: '#fff' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h6 className="fw-bold mb-0 small text-uppercase">Cloud Gallery</h6>
                                <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={fetchMediaItems}>
                                    <i className="fe fe-refresh-cw me-1"></i> Refresh
                                </Button>
                            </div>
                            {mediaLoading ? (
                                <div className="text-center py-5"><Spinner animation="border" size="sm" variant="primary" /></div>
                            ) : (
                                <Row className="g-3">
                                    {mediaItems.length === 0 ? (
                                        <Col className="text-center py-5 text-muted">No assets found in target cloud.</Col>
                                    ) : mediaItems.map(m => (
                                        <Col key={m.id} xs={6} sm={4} md={3}>
                                            <Card 
                                                className="h-100 border-0 shadow-sm cursor-pointer hover-card" 
                                                onClick={() => handleMediaSelect(m.path)}
                                                style={{transition: 'transform 0.2s', border: settingsForm[activeField] === m.path ? '2px solid #0d6efd !important' : 'none'}}
                                            >
                                                <div style={{height:'100px'}} className="bg-light d-flex align-items-center justify-content-center overflow-hidden rounded-3 border">
                                                    <Image 
                                                        src={m.path} 
                                                        alt={m.file_name} 
                                                        width={100} 
                                                        height={100}
                                                        className="mw-100 mh-100 object-fit-contain" 
                                                        unoptimized
                                                    />
                                                </div>
                                                <Card.Body className="p-2 text-center">
                                                    <div className="text-truncate x-small fw-bold">{m.file_name}</div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" size="sm" onClick={() => setShowMediaModal(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={() => window.open('/cms/media', '_blank')}>Open Full Manager</Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .cursor-pointer { cursor: pointer; }
                .hover-card:hover { transform: translateY(-5px); }
                .x-small { font-size: 11px; }
            `}</style>
        </Container>
    );
};

export default RewritesCMS;

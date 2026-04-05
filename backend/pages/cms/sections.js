import { useState, useEffect } from 'react';
import {
    Row, Col, Card, Button, Container, Badge, Spinner, Alert, Modal, Form
} from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { Eye, EyeOff, CheckCircle, XCircle, Settings, Layout, RefreshCw } from 'react-feather';
import LoadingSpinner from '../../components/LoadingSpinner';

// Default section definitions (frontend page sections)
const DEFAULT_SECTIONS = [
    { key: 'hero',          label: 'Hero / Banner',         page: 'Home',       description: 'Main landing hero banner with CTA buttons.' },
    { key: 'services',      label: 'Services',              page: 'Home',       description: 'Core services showcase cards.' },
    { key: 'projects',      label: 'Featured Projects',     page: 'Home',       description: 'Portfolio highlights on the homepage.' },
    { key: 'stats',         label: 'Company Stats',         page: 'Home',       description: 'Achievement numbers like clients, projects, etc.' },
    { key: 'principles',    label: 'Principles',            page: 'Home',       description: 'Core values and working principles.' },
    { key: 'technologies',  label: 'Technologies',          page: 'Home',       description: 'Tech stack / logos carousel.' },
    { key: 'system_status', label: 'System Status',         page: 'Home',       description: 'Live system uptime status panel.' },
    { key: 'partners',      label: 'Partners / Clients',    page: 'Home',       description: 'Partner logo strip.' },
    { key: 'cta',           label: 'Call To Action',        page: 'Home',       description: 'Bottom CTA banner to drive conversions.' },
    { key: 'about_hero',    label: 'About Hero',            page: 'About',      description: 'About page hero header section.' },
    { key: 'about_team',    label: 'Team Members',          page: 'About',      description: 'Team member cards grid.' },
    { key: 'portfolio',     label: 'Portfolio Grid',        page: 'Portfolio',  description: 'Full portfolio project grid.' },
    { key: 'contact_form',  label: 'Contact Form',          page: 'Contact',    description: 'Main contact us form.' },
    { key: 'navigation',    label: 'Navigation Bar',        page: 'Global',     description: 'Top navbar shown on all pages.' },
    { key: 'footer',        label: 'Footer',                page: 'Global',     description: 'Bottom site footer shown on all pages.' },
    { key: 'legal',         label: 'Legal Pages',           page: 'Legal',      description: 'Privacy, Terms, Refund policy pages.' },
];

const PAGE_COLORS = {
    Home:       'primary',
    About:      'info',
    Portfolio:  'success',
    Contact:    'warning',
    Global:     'dark',
    Legal:      'secondary',
};

const SectionsCMS = () => {
    const [sections, setSections]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [saving, setSaving]           = useState(null);   // key of section being toggled
    const [error, setError]             = useState(null);
    const [success, setSuccess]         = useState(null);
    const [filterPage, setFilterPage]   = useState('All');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem]       = useState(null);

    const fetchSections = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchApi('/admin/sections');
            if (res?.success) {
                // Merge backend data with default section definitions so new
                // sections are always shown even before they exist in the DB.
                const backendMap = {};
                (res.data || []).forEach(s => { backendMap[s.section_key] = s; });

                const merged = DEFAULT_SECTIONS.map(def => ({
                    ...def,
                    is_enabled:   backendMap[def.key] ? backendMap[def.key].is_enabled : 1,
                    custom_label: backendMap[def.key]?.custom_label || def.label,
                    custom_desc:  backendMap[def.key]?.custom_desc  || def.description,
                    db_id:        backendMap[def.key]?.id || null,
                }));
                setSections(merged);
            } else {
                // Backend not ready — show defaults all enabled
                setSections(DEFAULT_SECTIONS.map(d => ({ ...d, is_enabled: 1, custom_label: d.label, custom_desc: d.description, db_id: null })));
            }
        } catch {
            // If API is down, still show UI with defaults
            setSections(DEFAULT_SECTIONS.map(d => ({ ...d, is_enabled: 1, custom_label: d.label, custom_desc: d.description, db_id: null })));
            setError('Could not connect to API. Changes will not be saved until the backend is available.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSections(); }, []);

    const handleToggle = async (section) => {
        setSaving(section.key);
        setError(null);
        setSuccess(null);
        const newVal = section.is_enabled ? 0 : 1;
        try {
            await fetchApi('/admin/sections', {
                method: 'POST',
                body: JSON.stringify({
                    section_key:  section.key,
                    is_enabled:   newVal,
                    custom_label: section.custom_label,
                    custom_desc:  section.custom_desc,
                }),
            });
            setSections(prev =>
                prev.map(s => s.key === section.key ? { ...s, is_enabled: newVal } : s)
            );
            setSuccess(`"${section.custom_label}" has been ${newVal ? 'enabled' : 'disabled'}.`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(`Failed to update "${section.custom_label}". ${err.message}`);
        } finally {
            setSaving(null);
        }
    };

    const handleEditOpen = (section) => {
        setEditItem({ ...section });
        setShowEditModal(true);
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        setSaving(editItem.key);
        try {
            await fetchApi('/admin/sections', {
                method: 'POST',
                body: JSON.stringify({
                    section_key:  editItem.key,
                    is_enabled:   editItem.is_enabled,
                    custom_label: editItem.custom_label,
                    custom_desc:  editItem.custom_desc,
                }),
            });
            setSections(prev =>
                prev.map(s => s.key === editItem.key ? { ...s, ...editItem } : s)
            );
            setSuccess(`"${editItem.custom_label}" updated successfully.`);
            setTimeout(() => setSuccess(null), 3000);
            setShowEditModal(false);
        } catch (err) {
            setError(`Failed to save changes. ${err.message}`);
        } finally {
            setSaving(null);
        }
    };

    const pages = ['All', ...Array.from(new Set(DEFAULT_SECTIONS.map(s => s.page)))];
    const filtered = filterPage === 'All' ? sections : sections.filter(s => s.page === filterPage);

    const enabledCount  = sections.filter(s => s.is_enabled).length;
    const disabledCount = sections.length - enabledCount;


    return (
        <Container fluid className="px-6 py-4">

            {/* Page header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Section Visibility Control</h2>
                    <p className="text-muted mb-0 small">
                        Enable or disable individual website sections from appearing on the live frontend.
                    </p>
                </div>
                <Button variant="outline-secondary" size="sm" onClick={fetchSections} className="d-flex align-items-center gap-2">
                    <RefreshCw size={14} /> Refresh
                </Button>
            </div>

            {/* Alert feedback */}
            {error   && <Alert variant="danger"  dismissible onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

            {/* Summary stats bar */}
            <Row className="mb-5">
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #6366f1', borderRadius: 16 }}>
                        <Card.Body className="d-flex align-items-center gap-3 py-4">
                            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 56, height: 56, background: '#eef2ff' }}>
                                <Layout size={28} style={{ color: '#6366f1' }} />
                            </div>
                            <div>
                                <p className="text-muted mb-1 x-small fw-bold text-uppercase" style={{ letterSpacing: '0.8px' }}>Total Sections</p>
                                <h3 className="mb-0 fw-bold">{loading ? <Spinner animation="grow" size="sm" variant="primary" /> : sections.length}</h3>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #10b981', borderRadius: 16 }}>
                        <Card.Body className="d-flex align-items-center gap-3 py-4">
                            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 56, height: 56, background: '#ecfdf5' }}>
                                <CheckCircle size={28} style={{ color: '#10b981' }} />
                            </div>
                            <div>
                                <p className="text-muted mb-1 x-small fw-bold text-uppercase" style={{ letterSpacing: '0.8px' }}>Enabled</p>
                                <h3 className="mb-0 fw-bold text-success">{loading ? <Spinner animation="grow" size="sm" variant="success" /> : enabledCount}</h3>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #ef4444', borderRadius: 16 }}>
                        <Card.Body className="d-flex align-items-center gap-3 py-4">
                            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 56, height: 56, background: '#fef2f2' }}>
                                <XCircle size={28} style={{ color: '#ef4444' }} />
                            </div>
                            <div>
                                <p className="text-muted mb-1 x-small fw-bold text-uppercase" style={{ letterSpacing: '0.8px' }}>Disabled</p>
                                <h3 className="mb-0 fw-bold text-danger">{loading ? <Spinner animation="grow" size="sm" variant="danger" /> : disabledCount}</h3>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Page filter tabs */}
            <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
                <small className="text-muted fw-semibold me-1">Filter by page:</small>
                {pages.map(p => (
                    <Button
                        key={p}
                        size="sm"
                        variant={filterPage === p ? 'primary' : 'outline-secondary'}
                        onClick={() => setFilterPage(p)}
                        style={{ borderRadius: 20 }}
                        disabled={loading}
                    >
                        {p}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="py-5">
                    <LoadingSpinner text="Fetching site section configurations..." />
                </div>
            ) : (
                <Row>
                    {filtered.map(section => (
                        <Col xl={4} lg={6} md={12} key={section.key} className="mb-4">
                            <Card
                                className="h-100 border-0 shadow-sm"
                                style={{
                                    borderRadius: 14,
                                    opacity: section.is_enabled ? 1 : 0.7,
                                    transition: 'opacity 0.3s ease',
                                    borderLeft: `4px solid ${section.is_enabled ? '#198754' : '#adb5bd'}`,
                                }}
                            >
                                <Card.Body className="p-4">
                                    {/* Top row */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <Badge bg={PAGE_COLORS[section.page] || 'secondary'} style={{ borderRadius: 8 }}>
                                                {section.page}
                                            </Badge>
                                            <Badge
                                                bg={section.is_enabled ? 'success' : 'secondary'}
                                                style={{ borderRadius: 8 }}
                                            >
                                                {section.is_enabled ? '● Live' : '○ Hidden'}
                                            </Badge>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="light"
                                            className="border"
                                            onClick={() => handleEditOpen(section)}
                                            title="Edit label/description"
                                            style={{ borderRadius: 8 }}
                                        >
                                            <Settings size={13} />
                                        </Button>
                                    </div>

                                    {/* Title & description */}
                                    <h6 className="fw-bold mb-1">{section.custom_label}</h6>
                                    <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
                                        {section.custom_desc}
                                    </p>
                                    <code className="text-muted" style={{ fontSize: '0.72rem' }}>
                                        key: {section.key}
                                    </code>

                                    {/* Toggle button */}
                                    <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                                        <span className={`small fw-semibold ${section.is_enabled ? 'text-success' : 'text-secondary'}`}>
                                            {section.is_enabled ? 'Visible on site' : 'Hidden from site'}
                                        </span>
                                        <Button
                                            variant={section.is_enabled ? 'outline-danger' : 'outline-success'}
                                            size="sm"
                                            disabled={saving === section.key}
                                            onClick={() => handleToggle(section)}
                                            className="d-flex align-items-center gap-2"
                                            style={{ borderRadius: 8, minWidth: 110 }}
                                        >
                                            {saving === section.key ? (
                                                <><Spinner animation="border" size="sm" /> Saving...</>
                                            ) : section.is_enabled ? (
                                                <><EyeOff size={14} /> Disable</>
                                            ) : (
                                                <><Eye size={14} /> Enable</>
                                            )}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Quick reference info */}
            <Alert variant="info" className="mt-2">
                <strong>How it works:</strong> These settings are stored via the API endpoint{' '}
                <code>/admin/sections</code>. Your frontend can call{' '}
                <code>GET /admin/sections</code> and conditionally render each section based on its{' '}
                <code>is_enabled</code> value  (1 = show, 0 = hide).
            </Alert>

            {/* Edit label/desc modal */}
            {editItem && (
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Section Info — <code>{editItem.key}</code></Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleEditSave}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Display Label</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editItem.custom_label}
                                    onChange={e => setEditItem({ ...editItem, custom_label: e.target.value })}
                                    required
                                    placeholder="e.g. Hero Banner"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description / Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editItem.custom_desc}
                                    onChange={e => setEditItem({ ...editItem, custom_desc: e.target.value })}
                                    placeholder="Brief description of this section..."
                                />
                            </Form.Group>
                            <Form.Check
                                type="switch"
                                id="edit-enabled-switch"
                                label={editItem.is_enabled ? 'Section is Enabled (Live)' : 'Section is Disabled (Hidden)'}
                                checked={!!editItem.is_enabled}
                                onChange={e => setEditItem({ ...editItem, is_enabled: e.target.checked ? 1 : 0 })}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={saving === editItem.key}>
                                {saving === editItem.key ? <><Spinner animation="border" size="sm" /> Saving...</> : 'Save Changes'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            )}
            <style jsx>{`
                .x-small { font-size: 11px; }
            `}</style>
        </Container>
    );
};

export default SectionsCMS;

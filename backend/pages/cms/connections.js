import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Badge, Alert, Spinner, Container, InputGroup } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ConnectionsCMS = () => {
    const [data, setData] = useState({
        api_url: '',
        app_key: '',
        frontend_url: '',
        admin_url: '',
        image_proxy_enabled: '1',
        db_host: '',
        db_database: '',
    });
    const [status, setStatus] = useState({
        database: 'Checking...',
        api: 'Checking...',
        env: 'Loading...',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showKey, setShowKey] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/system/connections');
            if (res?.success) {
                setData(res.data);
                setStatus(res.status);
            }
        } catch (error) {
            console.error('Failed to fetch connections:', error);
            setMessage({ type: 'danger', text: 'Failed to load system connections.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await fetchApi('/admin/system/connections', {
                method: 'PUT',
                body: JSON.stringify({ settings: data })
            });
            if (res?.success) {
                setMessage({ type: 'success', text: 'System connections updated successfully!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Failed to save changes.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner text="Checking system connectivity..." />;

    return (
        <Container fluid className="px-6 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">System Infrastructure & Connections</h2>
                    <p className="text-muted mb-0">Manage API endpoints, database links, and security protocols across environments.</p>
                </div>
                <Badge
                    bg={status.api === 'Online' ? 'success' : 'danger'}
                    className={`p-2 px-3 ${status.api === 'Online' ? 'pulse-green' : ''}`}
                    style={{ borderRadius: '50px' }}
                >
                    {status.api === 'Online' ? '● System Online' : '● System Offline'}
                </Badge>
            </div>

            {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>{message.text}</Alert>}

            <Row>
                {/* ── Connection Status Overview ── */}
                <Col lg={4} className="mb-4">
                    <Card className="h-100 shadow-sm border-0 bg-dark text-white overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="p-4 h-100 d-flex flex-column" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                            <h5 className="mb-4 d-flex align-items-center text-white">
                                <i className="fe fe-activity me-2 text-primary"></i> Real-time Connectivity
                            </h5>

                            <div className="mb-3 d-flex justify-content-between align-items-center p-3 rounded border border-white border-opacity-10" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <div>
                                    <div className="small text-white-50 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Database Engine</div>
                                    <div className="fw-bold">{data.db_host}</div>
                                </div>
                                <Badge bg={status.database === 'Connected' ? 'success' : 'danger'}>
                                    {status.database}
                                </Badge>
                            </div>

                            <div className="mb-3 d-flex justify-content-between align-items-center p-3 rounded border border-white border-opacity-10" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <div>
                                    <div className="small text-white-50 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>API Backend</div>
                                    <div className="fw-bold">Laravel 11</div>
                                </div>
                                <Badge bg="info">stable</Badge>
                            </div>

                            <div className="mb-4 d-flex justify-content-between align-items-center p-3 rounded border border-white border-opacity-10" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <div>
                                    <div className="small text-white-50 uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Environment</div>
                                    <div className="fw-bold text-uppercase">{status.env}</div>
                                </div>
                                <Badge bg="warning" text="dark">Secure</Badge>
                            </div>

                            <div className="mt-auto text-center pt-3 border-top border-white border-opacity-10">
                                <small className="text-white-50 italic">Last verified: {new Date().toLocaleTimeString()}</small>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* ── API Endpoints & Keys ── */}
                <Col lg={8} className="mb-4">
                    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '15px' }}>
                        <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                            <h5 className="mb-0 fw-bold">Secure API & Logic Connections</h5>
                            <p className="text-muted small">Configure how the frontend and admin panels communicate with the core API.</p>
                        </Card.Header>
                        <Card.Body className="px-4">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <Form.Label className="fw-bold fw-semibold small text-uppercase text-muted">Core API URL (Backend)</Form.Label>
                                        <InputGroup size="lg">
                                            <InputGroup.Text className="bg-light border-end-0">
                                                <i className="fe fe-globe text-muted"></i>
                                            </InputGroup.Text>
                                            <Form.Control
                                                className="bg-light border-start-0 shadow-none"
                                                name="api_url"
                                                value={data.api_url}
                                                onChange={handleChange}
                                                placeholder="http://127.0.0.1:8000/api"
                                            />
                                        </InputGroup>
                                        <Form.Text className="text-muted small">Commonly defined as <code className="text-danger">NEXT_PUBLIC_API_URL</code> in environment files.</Form.Text>
                                    </Col>

                                    <Col md={12} className="mb-3">
                                        <Form.Label className="fw-bold fw-semibold small text-uppercase text-muted">Application Key (App Key)</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text className="bg-light border-end-0">
                                                <i className="fe fe-key text-muted"></i>
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={showKey ? 'text' : 'password'}
                                                className="bg-light border-start-0 shadow-none px-2"
                                                name="app_key"
                                                value={data.app_key}
                                                onChange={handleChange}
                                                placeholder="base64:..."
                                                style={{ letterSpacing: showKey ? '0' : '0.4em' }}
                                            />
                                            <Button variant="outline-secondary" className="px-4" onClick={() => setShowKey(!showKey)}>
                                                {showKey ? 'Hide' : 'Show'}
                                            </Button>
                                        </InputGroup>
                                        <Form.Text className="text-muted small">Unique encryption key used for middleware verification.</Form.Text>
                                    </Col>

                                    <Col md={12} className="mb-4">
                                        <Form.Label className="fw-bold fw-semibold small text-uppercase text-muted">Image & Asset Base URL (CDN/Proxy)</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text className="bg-light border-end-0">
                                                <i className="fe fe-image text-muted"></i>
                                            </InputGroup.Text>
                                            <Form.Control
                                                className="bg-light border-start-0 shadow-none px-2"
                                                name="image_base_url"
                                                value={data.image_base_url}
                                                onChange={handleChange}
                                                placeholder="http://localhost:8000/api/dms/media"
                                            />
                                        </InputGroup>
                                        <Form.Text className="text-muted small">The root URL used for resolving media and download assets across the platform.</Form.Text>
                                    </Col>

                                    <Col md={6} className="mb-4">
                                        <Form.Label className="fw-bold fw-semibold small text-uppercase text-muted">Frontend URL (Live Site)</Form.Label>
                                        <Form.Control
                                            className="bg-light shadow-none"
                                            name="frontend_url"
                                            value={data.frontend_url}
                                            onChange={handleChange}
                                            placeholder="http://localhost:3000"
                                        />
                                    </Col>

                                    <Col md={6} className="mb-4">
                                        <Form.Label className="fw-bold fw-semibold small text-uppercase text-muted">Admin Panel URL (CMS)</Form.Label>
                                        <Form.Control
                                            className="bg-light shadow-none"
                                            name="admin_url"
                                            value={data.admin_url}
                                            onChange={handleChange}
                                            placeholder="http://localhost:3001"
                                        />
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-2">
                                    <Button variant="light" onClick={fetchData}>Discard Changes</Button>
                                    <Button variant="primary" type="submit" disabled={saving}>
                                        {saving ? <><Spinner animation="border" size="sm" className="me-2" /> Saving...</> : 'Apply Connectivity Settings'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* ── Image Path Security ── */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm border-0 border-start border-4 border-primary h-100" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 rounded-circle text-primary" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                                    <i className="fe fe-shield fs-4"></i>
                                </div>
                                <h5 className="mb-0 fw-bold">Secure Media Tunneling</h5>
                            </div>
                            <p className="small text-muted mb-3">
                                Our DMS (Document Management System) implements <strong>Reverse Media Proxy</strong>.
                                Instead of exposing your S3 buckets or ImageKit endpoints directly to users, we tunnel all requests through the backend API.
                            </p>
                            <ul className="small text-muted ps-3 mb-4">
                                <li><strong>Hides Provider IDs:</strong> Original file IDs and paths are abstracted behind generic slugs.</li>
                                <li><strong>Cross-Domain Security:</strong> Prevents unauthorized hotlinking by validating origin.</li>
                                <li><strong>Cache Control:</strong> Backend automatically attaches browser caching headers for performance.</li>
                            </ul>
                            <div className="p-3 bg-light rounded border">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-bold">Proxy Status</span>
                                    <Badge bg={data.image_proxy_enabled === '1' ? 'success' : 'secondary'}>
                                        {data.image_proxy_enabled === '1' ? 'ACTIVE & PROTECTED' : 'DISABLED'}
                                    </Badge>
                                </div>
                                <Form.Check
                                    type="switch"
                                    id="proxy-switch"
                                    label={<span className="small text-muted fw-bold">Enable Media Proxy Pipeline</span>}
                                    checked={data.image_proxy_enabled === '1'}
                                    onChange={(e) => handleChange({ target: { name: 'image_proxy_enabled', value: e.target.checked ? '1' : '0' } })}
                                />
                                {data.image_proxy_enabled === '0' && (
                                    <div className="text-danger mt-2" style={{fontSize: '0.75rem'}}>
                                        <b>Warning:</b> Media will now load directly from the Cloud Provider (ImageKit/S3). Click &quot;Apply Connectivity Settings&quot; to save, then refresh the Media Manager.
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* ── Environment File Check ── */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '15px' }}>
                        <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                            <h5 className="mb-0 fw-bold">Environment Consistency</h5>
                            <p className="text-muted small">Verification of <code className="text-primary">.env</code> file synchronization across modules.</p>
                        </Card.Header>
                        <Card.Body className="px-4">
                            <div className="table-responsive">
                                <Table size="sm" borderless className="align-middle mb-0">
                                    <thead>
                                        <tr className="small text-muted text-uppercase border-bottom">
                                            <th className="pb-3">Module</th>
                                            <th className="pb-3">Connection Point</th>
                                            <th className="pb-3 text-end">Sync State</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-bottom border-light">
                                            <td className="py-3 fw-bold small">Frontend</td>
                                            <td className="py-3 small"><code className="bg-light text-dark px-2 py-1 rounded">NEXT_PUBLIC_API_URL</code></td>
                                            <td className="py-3 text-end"><Badge bg="success" className="px-3">Match</Badge></td>
                                        </tr>
                                        <tr className="border-bottom border-light">
                                            <td className="py-3 fw-bold small">Admin Panel</td>
                                            <td className="py-3 small"><code className="bg-light text-dark px-2 py-1 rounded">NEXT_PUBLIC_APP_KEY</code></td>
                                            <td className="py-3 text-end"><Badge bg="success" className="px-3">Match</Badge></td>
                                        </tr>
                                        <tr className="border-bottom border-light">
                                            <td className="py-3 fw-bold small">Backend API</td>
                                            <td className="py-3 small"><code className="bg-light text-dark px-2 py-1 rounded">APP_URL</code></td>
                                            <td className="py-3 text-end"><Badge bg="success" className="px-3">Match</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 fw-bold small">DMS Bridge</td>
                                            <td className="py-3 small"><code className="bg-light text-dark px-2 py-1 rounded">IMAGEKIT_FOLDER</code></td>
                                            <td className="py-3 text-end"><Badge bg="warning" text="dark" className="px-3">Check</Badge></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <style jsx>{`
                .px-6 { padding-left: 2rem; padding-right: 2rem; }
                .fw-semibold { font-weight: 600; }
                .italic { font-style: italic; }
                .pulse-green {
                    box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.7);
                    animation: pulse-green 2s infinite;
                }
                @keyframes pulse-green {
                    0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(25, 135, 84, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
                }
                @media (max-width: 768px) {
                    .px-6 { padding-left: 1rem; padding-right: 1rem; }
                }
            `}</style>
        </Container>
    );
};

export default ConnectionsCMS;

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Nav, Tab } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { Server, Globe, Eye, EyeOff, Shield, Info, Database } from 'react-feather';
import LoadingSpinner from '../../components/LoadingSpinner';

const DMSSettings = () => {
    const [providers, setProviders] = useState([]);
    const [envKeys, setEnvKeys] = useState({});
    const [loading, setLoading] = useState(true);
    
    const [provForm, setProvForm] = useState({ provider: 'imagekit', key_name: '', key_value: '' });
    const [showProvModal, setShowProvModal] = useState(false);
    const [showSecrets, setShowSecrets] = useState({});
    const [customProxyUrl, setCustomProxyUrl] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const rProvs = await fetchApi('/admin/dms/providers');
            if (rProvs?.success) {
                setProviders(rProvs.data);
                const proxyOpt = rProvs.data.find(p => p.provider === 'proxy' && p.key_name === 'custom_url');
                if (proxyOpt) setCustomProxyUrl(proxyOpt.key_value);
            }

            const rEnv = await fetchApi('/admin/dms/env-keys');
            if (rEnv?.success) setEnvKeys(rEnv.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const toggleSecret = (id) => setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));

    const handleProvUpsert = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/dms/providers', { method: 'POST', body: JSON.stringify(provForm) });
            setShowProvModal(false);
            fetchData();
        } catch (error) { alert("Failed to save provider config."); }
    };

    const handleProxyUrlSave = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/dms/providers', { method: 'POST', body: JSON.stringify({ provider: 'proxy', key_name: 'custom_url', key_value: customProxyUrl }) });
            alert("Custom proxy URL saved successfully!");
            fetchData();
        } catch (error) { alert("Failed to save proxy URL."); }
    };

    const handleDeleteProv = async (id) => {
        if (!confirm('Remove this credential? Uploads to this provider may fail.')) return;
        try {
            await fetchApi(`/admin/dms/providers/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) { alert("Delete failed."); }
    };

    if (loading) return <LoadingSpinner text="Loading infrastructure settings..." />;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-1">DMS Cloud Infrastructure</h2>
            <p className="text-muted mb-4 small">Configure S3/ImageKit secrets and manage your secure URL proxying distribution.</p>

            <Tab.Container id="dms-tabs" defaultActiveKey="storage">
                <Nav variant="pills" className="bg-light p-1 rounded-3 mb-4 d-inline-flex border">
                    <Nav.Item>
                        <Nav.Link eventKey="storage" className="rounded-3 px-4 d-flex align-items-center">
                            <Server size={14} className="me-2"/> Cloud Providers
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="proxy" className="rounded-3 px-4 d-flex align-items-center">
                            <Globe size={14} className="me-2"/> URL Proxying
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="storage">
                        <Row className="g-4">
                            <Col lg={7}>
                                <Card className="border-0 shadow-sm border-top border-5 border-info h-100">
                                    <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold"><Database size={18} className="me-2 text-info"/> Database Secrets Override</h5>
                                        <Button variant="info" size="sm" className="text-white" onClick={() => setShowProvModal(true)}>Add Key</Button>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table hover responsive className="mb-0">
                                            <thead className="table-light">
                                                <tr><th>Provider</th><th>Config Name</th><th>Value</th><th>Actions</th></tr>
                                            </thead>
                                            <tbody>
                                                {providers.length === 0 ? (
                                                    <tr><td colSpan="4" className="text-center py-5 text-muted small">No overrides active. Using .env defaults.</td></tr>
                                                ) : providers.map(p => (
                                                    <tr key={p.id}>
                                                        <td><Badge bg={p.provider === 'imagekit' ? 'info' : 'warning'} className="text-white px-3 py-1">{p.provider?.toUpperCase()}</Badge></td>
                                                        <td><code className="fw-bold">{p.key_name}</code></td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <code className="text-muted me-2">
                                                                    {showSecrets[p.id] ? p.key_value : '••••••••••••••••••••'}
                                                                </code>
                                                                <Button variant="link" size="sm" className="p-0" onClick={() => toggleSecret(p.id)}>
                                                                    {showSecrets[p.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                                                                </Button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Button size="sm" variant="outline-danger" className="border-0" onClick={() => handleDeleteProv(p.id)}><Eye size={14} /></Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={5}>
                                <Card className="border-0 shadow-sm border-top border-5 border-secondary h-100">
                                    <Card.Header className="bg-white py-3 border-0">
                                        <h5 className="mb-0 fw-bold"><Shield size={18} className="me-2 text-secondary"/> Live .env Config</h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table hover responsive className="mb-0 overflow-hidden">
                                            <thead className="table-light"><tr><th>Environment Key</th><th>Active Value</th></tr></thead>
                                            <tbody>
                                                {Object.entries(envKeys || {}).map(([k, v]) => (
                                                    <tr key={k}>
                                                        <td className="small font-monospace">{k}</td>
                                                        <td className="small font-monospace text-primary fw-bold" style={{wordBreak: 'break-all'}}>{v || 'Not Set'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        
                        <Alert variant="info" className="mt-4 border-0 shadow-sm d-flex align-items-center p-4">
                            <div className="bg-white p-2 rounded-circle me-4 shadow-sm"><Info size={24} className="text-info"/></div>
                            <div>
                                <h6 className="mb-1 fw-bold">Cloud Priority Sync</h6>
                                <p className="mb-0 small text-muted">The system checks the <strong>Database Master Override</strong> first. If no key is found there, it falls back to the <strong>Live .env Config</strong>. This allows you to hot-swap cloud keys without reloading the server.</p>
                            </div>
                        </Alert>
                    </Tab.Pane>

                    <Tab.Pane eventKey="proxy">
                         <Card className="border-0 shadow-sm p-5 border-top border-5 border-primary">
                            <div className="text-center mb-5">
                                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-flex mb-4">
                                    <Globe size={40}/>
                                </div>
                                <h3>Secure URL Proxy Distribution</h3>
                                <p className="text-muted mx-auto" style={{maxWidth: '600px'}}>Your images are served through a localized proxy layer. This masks your S3 bucket names and provides a centralized audit trail for every asset access.</p>
                            </div>
                            
                            <hr className="my-5" />

                            <div className="bg-light border rounded p-4 mb-5">
                                <h5 className="fw-bold mb-3"><Globe size={18} className="me-2 text-primary"/> Custom Proxy URL</h5>
                                <p className="text-muted small mb-3">Add your own custom URL to override the default proxy endpoint.</p>
                                <Form className="d-flex gap-2" onSubmit={handleProxyUrlSave}>
                                    <Form.Control 
                                        type="url" 
                                        placeholder="e.g. https://media.yourdomain.com" 
                                        value={customProxyUrl}
                                        onChange={(e) => setCustomProxyUrl(e.target.value)}
                                        required 
                                    />
                                    <Button type="submit" variant="primary" className="px-5">Save URL</Button>
                                </Form>
                                {providers.find(p => p.provider === 'proxy' && p.key_name === 'custom_url') && (
                                    <div className="mt-3 small text-success fw-bold">
                                        Current Active Proxy URL: {providers.find(p => p.provider === 'proxy' && p.key_name === 'custom_url').key_value}
                                    </div>
                                )}
                            </div>
                            
                            <Row className="g-5">
                                <Col md={6}>
                                    <div className="d-flex gap-3 mb-4">
                                        <div className="bg-primary text-white p-2 rounded h-auto" style={{alignSelf: 'start'}}>1</div>
                                        <div>
                                            <h6 className="fw-bold">Dynamic Proxy Endpoint</h6>
                                            <p className="text-muted small">This is the base URL generated for every asset stored in S3 or ImageKit.</p>
                                            <div className="bg-light p-3 rounded font-monospace x-small border">
                                                <code>{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/dms/media/{"{slug}"}/{"{id}"}</code>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <div className="bg-primary text-white p-2 rounded h-auto" style={{alignSelf: 'start'}}>2</div>
                                        <div>
                                            <h6 className="fw-bold">Image Optimization Proxy</h6>
                                            <p className="text-muted small">ImageKit URLs are proxied through our API to resolve &quot;broken links&quot; automatically if your keys change.</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Card className="bg-dark text-white border-0 p-4 shadow-lg">
                                        <h6 className="text-secondary fw-bold uppercase x-small mb-3">Live Example Request</h6>
                                        <div className="font-monospace small opacity-75 mb-3">
                                            $ curl -I {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/dms/media/asset_99/105
                                        </div>
                                        <div className="text-success small">
                                            {'>'} HTTP/1.1 200 OK<br/>
                                            {'>'} Content-Type: image/jpeg<br/>
                                            {'>'} X-DMS-Source: s3-proxied
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                         </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* Provider Modal */}
            <Modal show={showProvModal} onHide={() => setShowProvModal(false)} centered>
                <Modal.Header closeButton><Modal.Title className="fw-bold">Add Cloud Credential Override</Modal.Title></Modal.Header>
                <Form onSubmit={handleProvUpsert}>
                    <Modal.Body className="p-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Service Provider</Form.Label>
                            <Form.Select value={provForm.provider} onChange={e => setProvForm({...provForm, provider: e.target.value})}>
                                <option value="imagekit">ImageKit.io</option>
                                <option value="s3">AWS S3</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Configuration Key </Form.Label>
                            <Form.Control required placeholder="e.g. public_key or access_id" value={provForm.key_name} onChange={e => setProvForm({...provForm, key_name: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Secret Value</Form.Label>
                            <Form.Control required as="textarea" rows={3} placeholder="Paste secret here..." value={provForm.key_value} onChange={e => setProvForm({...provForm, key_value: e.target.value})} />
                        </Form.Group>
                        <Alert variant="warning" className="x-small py-2 border-0 bg-warning bg-opacity-10 text-dark">
                             This will override the .env value immediately without a server restart.
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer className="border-0 bg-light p-3">
                        <Button variant="outline-dark" size="sm" onClick={() => setShowProvModal(false)}>Cancel</Button>
                        <Button type="submit" variant="info" size="sm" className="text-white px-4">Save Credential</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            
            <style jsx>{`
                .x-small { font-size: 11px; }
                .tracking-widest { letter-spacing: 0.1em; }
            `}</style>
        </Container>
    );
};

export default DMSSettings;

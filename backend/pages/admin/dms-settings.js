import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, InputGroup, Nav, Tab } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { Key, Server, Plus, Trash, Globe, Eye, EyeOff, Shield, Info } from 'react-feather';

const DMSSettings = () => {
    const [keys, setKeys] = useState([]);
    const [providers, setProviders] = useState([]);
    const [envKeys, setEnvKeys] = useState({});
    const [loading, setLoading] = useState(true);
    
    const [keyForm, setKeyForm] = useState({ label: '', api_scope: 'upload', provider: 's3' });
    const [resKey, setResKey] = useState(null);
    const [showKeyModal, setShowKeyModal] = useState(false);

    const [provForm, setProvForm] = useState({ provider: 'imagekit', key_name: '', key_value: '' });
    const [showProvModal, setShowProvModal] = useState(false);
    const [showSecrets, setShowSecrets] = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            const rKeys = await fetchApi('/admin/dms/keys');
            if (rKeys?.success) setKeys(rKeys.data);
            
            const rProvs = await fetchApi('/admin/dms/providers');
            if (rProvs?.success) setProviders(rProvs.data);

            const rEnv = await fetchApi('/admin/dms/env-keys');
            if (rEnv?.success) setEnvKeys(rEnv.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const toggleSecret = (id) => setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));

    const handleKeyCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchApi('/admin/dms/keys', { method: 'POST', body: JSON.stringify(keyForm) });
            if (res.success) {
                setResKey(res.api_key);
                fetchData();
            }
        } catch (error) { alert("Failed to create API key."); }
    };

    const handleProvUpsert = async (e) => {
        e.preventDefault();
        try {
            await fetchApi('/admin/dms/providers', { method: 'POST', body: JSON.stringify(provForm) });
            setShowProvModal(false);
            fetchData();
        } catch (error) { alert("Failed to save provider config."); }
    };

    const handleRevokeKey = async (id) => {
        if (!confirm('Revoke this API Key? Devices using it will lose access.')) return;
        try {
            await fetchApi(`/admin/dms/keys/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) { alert("Revoke failed."); }
    };

    const handleDeleteProv = async (id) => {
        if (!confirm('Remove this credential? Uploads to this provider may fail.')) return;
        try {
            await fetchApi(`/admin/dms/providers/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) { alert("Delete failed."); }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading) return <Container fluid className="p-4"><p>Loading infrastructure settings...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-1">DMS Infrastructure Settings</h2>
            <p className="text-muted mb-4 small">Manage API Master Keys, Cloud Providers (S3/ImageKit), and System Environment configuration.</p>

            <Tab.Container id="dms-tabs" defaultActiveKey="api-keys">
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item><Nav.Link eventKey="api-keys"><Key size={14} className="me-2"/> DMS API Keys</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="storage"><Server size={14} className="me-2"/> Cloud Providers</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="proxy"><Globe size={14} className="me-2"/> URL Proxying</Nav.Link></Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="api-keys">
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">DMS API Keys (External Uploads)</h5>
                                <Button variant="light" size="sm" onClick={() => { setResKey(null); setShowKeyModal(true); }}>
                                    <Plus size={14} className="me-1"/> Generate New Key
                                </Button>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Table hover responsive className="text-nowrap mb-0">
                                    <thead className="table-light">
                                        <tr><th>Label</th><th>Scope</th><th>Provider</th><th>Status</th><th>API Key</th><th>Created</th><th>Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {keys.map(k => (
                                            <tr key={k.id}>
                                                <td><strong>{k.label}</strong></td>
                                                <td><Badge bg="info">{k.api_scope.toUpperCase()}</Badge></td>
                                                <td><Badge bg={k.provider === 'imagekit' ? 'info' : 'warning'}>{k.provider?.toUpperCase() || 'S3'}</Badge></td>
                                                <td><Badge bg={k.is_active ? 'success' : 'secondary'}>{k.is_active ? 'Active' : 'Revoked'}</Badge></td>
                                                <td><code>{k.api_key}</code></td>
                                                <td>{new Date(k.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    {k.is_active === 1 && (
                                                        <Button size="sm" variant="danger" onClick={() => handleRevokeKey(k.id)}>Revoke</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm mt-4">
                            <Card.Header className="bg-light py-3 border-0">
                                <h6 className="mb-0 fw-bold uppercase tracking-widest small"><Shield size={14} className="me-2 text-primary"/> PRO KNOWLEDGE: How to use DMS Keys</h6>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row className="g-4">
                                    <Col md={6}>
                                        <h6 className="fw-bold small text-dark mb-2">1. When to use these keys?</h6>
                                        <p className="text-muted small">You only need these keys for <strong>External Applications</strong> (like a Mobile App or a separate PHP script) that need to upload images to your cloud.</p>
                                        <p className="text-muted small mb-0">The <strong>Admin Panel</strong> (this dashboard) does NOT need an API key because it uses your secure Administrator session automatically.</p>
                                    </Col>
                                    <Col md={6}>
                                        <h6 className="fw-bold small text-dark mb-2">2. How to authenticate?</h6>
                                        <p className="text-muted small mb-2">Send the API key in the <code>X-DMS-Key</code> header when calling the DMS API endpoints:</p>
                                        <div className="bg-dark text-white p-3 rounded-3 x-small font-monospace mb-0 overflow-auto">
                                            <code>
                                                Header: X-DMS-Key<br/>
                                                Value: dms_vzix6Tr8dt68Wj...
                                            </code>
                                        </div>
                                    </Col>
                                </Row>
                                <hr />
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle"><Info size={20}/></div>
                                    <p className="x-small text-muted mb-0"><strong>Security Tip:</strong> Never share these keys on public frontend code (like React/HTML). They should only be used in Backends or Mobile Apps.</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab.Pane>

                    <Tab.Pane eventKey="storage">
                        <Row>
                            <Col lg={7}>
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Database Overrides</h5>
                                        <Button variant="outline-light" size="sm" onClick={() => setShowProvModal(true)}>Add Override Key</Button>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table hover responsive className="mb-0">
                                            <thead className="table-light">
                                                <tr><th>Provider</th><th>Key Name</th><th>Stored Value</th><th>Actions</th></tr>
                                            </thead>
                                            <tbody>
                                                {providers.map(p => (
                                                    <tr key={p.id}>
                                                        <td><Badge bg={p.provider === 'imagekit' ? 'info' : 'warning'}>{p.provider}</Badge></td>
                                                        <td><code>{p.key_name}</code></td>
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
                                                            <Button size="sm" variant="outline-danger" className="border-0" onClick={() => handleDeleteProv(p.id)}><Trash size={14} /></Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={5}>
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-secondary text-white">
                                        <h5 className="mb-0">Master Environment (.env)</h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table hover responsive className="mb-0">
                                            <thead className="table-light"><tr><th>Variable</th><th>Live Value</th></tr></thead>
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
                    </Tab.Pane>

                    <Tab.Pane eventKey="proxy">
                         <Card className="border-0 shadow-sm p-4">
                            <h4 className="mb-3">URL Proxying Infrastructure</h4>
                            <p className="text-muted">All images are served via the Backend API to protect cloud secrets and provide auditing.</p>
                            <hr />
                            <Row>
                                <Col md={6}>
                                    <h6>API Proxy Endpoint:</h6>
                                    <Alert variant="info" className="py-2">
                                        <code>{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/dms/media/{"{slug}"}/{"{id}"}</code>
                                    </Alert>
                                </Col>
                                <Col md={6}>
                                    <h6>Example URL:</h6>
                                    <Alert variant="secondary" className="py-2">
                                        <code>http://localhost:8000/api/dms/media/asset_v1/105</code>
                                    </Alert>
                                </Col>
                            </Row>
                         </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* API Key Modal */}
            <Modal show={showKeyModal} onHide={() => setShowKeyModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Generate API Access Key</Modal.Title></Modal.Header>
                <Modal.Body>
                    {!resKey ? (
                        <Form onSubmit={handleKeyCreate}>
                            <Form.Group className="mb-3">
                                <Form.Label>Client Label (e.g. Android App)</Form.Label>
                                <Form.Control required placeholder="Enter label..." value={keyForm.label} onChange={e => setKeyForm({...keyForm, label: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Access Scope</Form.Label>
                                <Form.Select value={keyForm.api_scope} onChange={e => setKeyForm({...keyForm, api_scope: e.target.value})}>
                                    <option value="upload">Upload Only</option>
                                    <option value="admin">Full Admin Access</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Default Cloud Provider</Form.Label>
                                <Form.Select value={keyForm.provider} onChange={e => setKeyForm({...keyForm, provider: e.target.value})}>
                                    <option value="s3">AWS S3 (Standard)</option>
                                    <option value="imagekit">ImageKit.io (Optimized)</option>
                                </Form.Select>
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">Create Secure Key</Button>
                        </Form>
                    ) : (
                        <div className="text-center">
                            <h5 className="text-success mb-3">Key Generated Successfully!</h5>
                            <InputGroup className="mb-4">
                                <Form.Control readOnly value={resKey} className="bg-light font-monospace" />
                                <Button variant="outline-dark" onClick={() => copyToClipboard(resKey)}>Copy</Button>
                            </InputGroup>
                            <Alert variant="warning" className="small">Please save this key now. It will not be shown again.</Alert>
                            <Button variant="secondary" className="w-100" onClick={() => setShowKeyModal(false)}>Close</Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Provider Modal */}
            <Modal show={showProvModal} onHide={() => setShowProvModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Add Cloud Credential Override</Modal.Title></Modal.Header>
                <Form onSubmit={handleProvUpsert}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Provider</Form.Label>
                            <Form.Select value={provForm.provider} onChange={e => setProvForm({...provForm, provider: e.target.value})}>
                                <option value="imagekit">ImageKit</option>
                                <option value="s3">AWS S3</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Configuration Key (e.g. public_key)</Form.Label>
                            <Form.Control required placeholder="Key name..." value={provForm.key_name} onChange={e => setProvForm({...provForm, key_name: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Secret Value</Form.Label>
                            <Form.Control required as="textarea" rows={3} placeholder="Paste secret here..." value={provForm.key_value} onChange={e => setProvForm({...provForm, key_value: e.target.value})} />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100">Save Credential</Button>
                    </Modal.Body>
                </Form>
            </Modal>
        </Container>
    );
};

export default DMSSettings;

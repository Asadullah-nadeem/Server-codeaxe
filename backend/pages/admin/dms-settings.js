import { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Tab, Nav, Form, Badge, Row, Col, Modal } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { Shield, Eye, EyeOff, Key, Server, Terminal, Copy, CheckCircle, Trash2, Plus, Code } from 'react-feather';
import LoadingSpinner from '../../components/LoadingSpinner';

const DMSSettings = () => {
    const [envKeys, setEnvKeys] = useState({});
    const [loading, setLoading] = useState(true);
    const [showSecrets, setShowSecrets] = useState({});

    // API Keys State Simulator
    const [apiKeys, setApiKeys] = useState([]);
    const [showKeySecret, setShowKeySecret] = useState({});
    const [copied, setCopied] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKeyForm, setNewKeyForm] = useState({ name: '', get: true, post: false, delete: false });

    const fetchData = async () => {
        try {
            setLoading(true);
            const rEnv = await fetchApi('/admin/dms/env-keys');
            if (rEnv?.success) setEnvKeys(rEnv.data);

            const rKeys = await fetchApi('/admin/developer-keys');
            if (rKeys?.success) setApiKeys(rKeys.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const toggleSecret = (id) => setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleApiSecret = (id) => setShowKeySecret(prev => ({ ...prev, [id]: !prev[id] }));

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleCreateKey = async (e) => {
        e.preventDefault();
        const permissions = [];
        if (newKeyForm.get) permissions.push('GET');
        if (newKeyForm.post) permissions.push('POST');
        if (newKeyForm.delete) permissions.push('DELETE');

        try {
            const res = await fetchApi('/admin/developer-keys', {
                method: 'POST',
                body: JSON.stringify({ name: newKeyForm.name, permissions })
            });

            if (res?.success) {
                setApiKeys([res.data, ...apiKeys]);
                setNewKeyForm({ name: '', get: true, post: false, delete: false });
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create API key.");
        }
    };

    const handleDeleteKey = async (id) => {
        if(confirm("Are you sure you want to revoke this API key? Any applications using it will lose access immediately.")) {
            try {
                await fetchApi(`/admin/developer-keys/${id}`, { method: 'DELETE' });
                setApiKeys(apiKeys.filter(k => k.id !== id));
            } catch (error) {
                console.error(error);
                alert("Failed to delete API key.");
            }
        }
    };

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-1">DMS Infrastructure & API</h2>
            <p className="text-muted mb-4 small">Configure cloud bindings and external device API access tokens.</p>

            <Tab.Container defaultActiveKey="envconfig">
                <Nav variant="pills" className="bg-white p-1 rounded-3 mb-4 shadow-sm d-inline-flex border">
                    <Nav.Item>
                        <Nav.Link eventKey="envconfig" className="rounded-3 px-4 py-2 d-flex align-items-center">
                            <Shield size={16} className="me-2"/> Environment Config
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="apiaccess" className="rounded-3 px-4 py-2 d-flex align-items-center">
                            <Key size={16} className="me-2"/> Developer API Keys
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    {/* ENVIRONMENT CONFIG TAB */}
                    <Tab.Pane eventKey="envconfig">
                        {loading ? (
                            <div className="py-5">
                                <LoadingSpinner text="Fetching environment configuration..." />
                            </div>
                        ) : (
                            <Card className="border-0 shadow-sm border-top border-5 border-secondary">
                                <Card.Header className="bg-white py-3 border-0">
                                    <h5 className="mb-0 fw-bold"><Server size={18} className="me-2 text-secondary"/> Live .env Config</h5>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Table hover responsive className="mb-0">
                                        <thead className="table-light"><tr><th style={{ width: '40%' }}>Environment Key</th><th>Active Value</th></tr></thead>
                                        <tbody>
                                            {Object.entries(envKeys || {}).map(([k, v]) => (
                                                <tr key={k}>
                                                    <td className="small font-monospace align-middle text-dark fw-semibold">{k}</td>
                                                    <td className="small font-monospace text-primary fw-bold align-middle" style={{wordBreak: 'break-all'}}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="pe-3">{v ? (showSecrets[k] ? v : '••••••••••••••••••••') : <span className="text-muted fw-normal">Not Set</span>}</span>
                                                            {v && (
                                                                <Button variant="light" size="sm" className="p-1 text-muted d-flex align-items-center justify-content-center border-0 shadow-sm" onClick={() => toggleSecret(k)}>
                                                                    {showSecrets[k] ? <EyeOff size={14}/> : <Eye size={14}/>}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        )}
                    </Tab.Pane>

                    {/* DEVELOPER API ACCESS TAB */}
                    <Tab.Pane eventKey="apiaccess">
                        <Row className="g-4">
                            <Col lg={8}>
                                <Card className="border-0 shadow-sm border-top border-5 border-primary h-100">
                                    <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold"><Key size={18} className="me-2 text-primary"/> API Access Tokens</h5>
                                        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)} className="d-flex align-items-center">
                                            <Plus size={16} className="me-1"/> Generate Token
                                        </Button>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table hover responsive className="mb-0 overflow-hidden text-nowrap">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Device / App Name</th>
                                                    <th>Secret Token</th>
                                                    <th>Permissions</th>
                                                    <th className="text-center">API Clicks</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {apiKeys.length === 0 && (
                                                    <tr><td colSpan="5" className="text-center py-5 text-muted small">No API keys created yet. Generate one to authenticate external apps.</td></tr>
                                                )}
                                                {apiKeys.map(key => (
                                                    <tr key={key.id} className="align-middle">
                                                        <td className="fw-bold small">{key.name}<br/><span className="text-muted fw-normal" style={{fontSize: '0.7rem'}}>Created: {key.created}</span></td>
                                                        <td>
                                                            <div className="d-flex align-items-center bg-light rounded px-2 py-1" style={{ width: 'fit-content' }}>
                                                                <code className="text-dark me-2 border-0 bg-transparent p-0">
                                                                    {showKeySecret[key.id] ? key.token : 'dms_live_••••••••••'}
                                                                </code>
                                                                <div className="d-flex gap-1">
                                                                    <Button variant="link" size="sm" className="p-0 text-muted" onClick={() => toggleApiSecret(key.id)}>
                                                                        {showKeySecret[key.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                                                                    </Button>
                                                                    <Button variant="link" size="sm" className="p-0 text-primary ms-1" onClick={() => handleCopy(key.token, key.id)}>
                                                                        {copied === key.id ? <CheckCircle size={14} className="text-success"/> : <Copy size={14}/>}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                {key.permissions.map(p => (
                                                                    <Badge key={p} bg={p === 'GET' ? 'success' : (p === 'POST' ? 'primary' : 'danger')} style={{fontSize: '0.65rem'}} className="rounded-1">{p}</Badge>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <Badge bg="secondary" pill className="px-3 py-2 bg-opacity-10 text-dark border">{key.clicks.toLocaleString()}</Badge>
                                                        </td>
                                                        <td>
                                                            <Button variant="outline-danger" size="sm" className="border-0 shadow-sm" onClick={() => handleDeleteKey(key.id)}>
                                                                <Trash2 size={14} /> Revoke
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col lg={4}>
                                <Card className="border-0 shadow-sm bg-dark text-white h-100">
                                    <Card.Header className="bg-transparent border-0 pt-4 pb-0">
                                        <h5 className="fw-bold d-flex align-items-center"><Terminal size={18} className="me-2 text-warning"/> Quick Start Guide</h5>
                                        <hr className="border-secondary mb-0"/>
                                    </Card.Header>
                                    <Card.Body className="small">
                                        <p className="text-white-50 mb-4">Use your generated API tokens to securely interact with the DMS API from other devices, apps, or Postman.</p>

                                        <h6 className="text-warning fw-bold mb-2"><Code size={14} className="me-1"/> Authentication Header</h6>
                                        <div className="bg-black p-3 rounded font-monospace small mb-4 border border-secondary">
                                            Authorization: Bearer <span className="text-success">{'<YOUR_TOKEN>'}</span>
                                        </div>

                                        <h6 className="text-warning fw-bold mb-2">Available Endpoints</h6>
                                        <ul className="list-unstyled text-white-50 mb-0">
                                            <li className="mb-3">
                                                <Badge bg="success" className="me-2 rounded-1">GET</Badge> <code className="bg-transparent">{process.env.NEXT_PUBLIC_API_URL}/dms/media</code><br/>
                                                <span className="ms-4 text-muted" style={{fontSize: '0.7rem'}}>Fetch secure files list.</span>
                                            </li>
                                            <li className="mb-3">
                                                <Badge bg="primary" className="me-2 rounded-1">POST</Badge> <code className="bg-transparent">{process.env.NEXT_PUBLIC_API_URL}/dms/upload</code><br/>
                                                <span className="ms-4 text-muted" style={{fontSize: '0.7rem'}}>Upload files securely via form-data.</span>
                                            </li>
                                            <li>
                                                <Badge bg="danger" className="me-2 rounded-1">DELETE</Badge> <code className="bg-transparent">{process.env.NEXT_PUBLIC_API_URL}/dms/media/{"{id}"}</code><br/>
                                                <span className="ms-4 text-muted" style={{fontSize: '0.7rem'}}>Permanently remove an asset.</span>
                                            </li>
                                        </ul>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* CREATE API KEY MODAL */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fw-bold"><Key size={20} className="me-2 text-primary"/> Generate New Token</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateKey}>
                    <Modal.Body className="pt-3">
                        <p className="text-muted small mb-4">Create a new access token for authenticating external devices. Be sure to select only the necessary permissions.</p>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Device or Application Name</Form.Label>
                            <Form.Control
                                required
                                placeholder="e.g. Android Mobile App, Salesforce Sync"
                                value={newKeyForm.name}
                                onChange={(e) => setNewKeyForm({...newKeyForm, name: e.target.value})}
                                className="bg-light shadow-none"
                            />
                        </Form.Group>

                        <Form.Label className="small fw-bold">API Permissions Scope</Form.Label>
                        <div className="d-flex flex-column gap-2 bg-light p-3 rounded border">
                            <Form.Check
                                type="switch"
                                id="perm-get"
                                label={<span><Badge bg="success" className="me-2 rounded-1 p-1">GET</Badge> Read Data</span>}
                                checked={newKeyForm.get}
                                onChange={(e) => setNewKeyForm({...newKeyForm, get: e.target.checked})}
                            />
                            <Form.Check
                                type="switch"
                                id="perm-post"
                                label={<span><Badge bg="primary" className="me-2 rounded-1 p-1">POST</Badge> Write/Upload Data</span>}
                                checked={newKeyForm.post}
                                onChange={(e) => setNewKeyForm({...newKeyForm, post: e.target.checked})}
                            />
                            <Form.Check
                                type="switch"
                                id="perm-delete"
                                label={<span><Badge bg="danger" className="me-2 rounded-1 p-1">DELETE</Badge> Remove Data</span>}
                                checked={newKeyForm.delete}
                                onChange={(e) => setNewKeyForm({...newKeyForm, delete: e.target.checked})}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-top-0 d-flex justify-content-between pt-0 bg-white">
                        <Button variant="light" className="px-4" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="px-5 shadow-sm d-flex align-items-center">
                            Generate
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <style jsx>{`
                .nav-pills .nav-link { color: #6c757d; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
                .nav-pills .nav-link.active { background-color: #f8f9fa; color: #0d6efd; border: 1px solid #dee2e6; }
            `}</style>
        </Container>
    );
};

export default DMSSettings;

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { Server, Send, Mail, Shield, CheckCircle } from 'react-feather';
import LoadingSpinner from '../../components/LoadingSpinner';

const SmtpSettingsCMS = () => {
    const [settings, setSettings] = useState({
        mail_host: '',
        mail_port: 587,
        mail_username: '',
        mail_password: '',
        mail_encryption: 'tls',
        mail_from_address: '',
        mail_from_name: '',
        is_active: 1
    });
    const [testEmail, setTestEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/smtp/settings');
            if (res?.success && res.data) {
                setSettings(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetchApi('/admin/smtp/settings', {
                method: 'PUT',
                body: JSON.stringify(settings)
            });
            if (res.success) {
                setMessage({ type: 'success', text: 'SMTP settings saved and re-wired successfully!' });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: error.message || 'Failed to save settings.' });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        if (!testEmail) return alert("Enter a test recipient email first.");
        setTesting(true);
        setMessage({ type: 'info', text: 'Sending test email...' });
        try {
            const res = await fetchApi('/admin/smtp/test', {
                method: 'POST',
                body: JSON.stringify({ email: testEmail })
            });
            if (res.success) {
                setMessage({ type: 'success', text: res.message });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: error.message || 'SMTP test failed.' });
        } finally {
            setTesting(false);
        }
    };


    return (
        <Container fluid className="px-6 py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="mb-1 fw-bold">Global SMTP Configuration</h2>
                    <p className="text-muted small">Manage your mail delivery settings. These settings override system defaults for all communications.</p>
                </Col>
            </Row>

            {message.text && <Alert variant={message.type} className="mb-4 shadow-sm">{message.text}</Alert>}

            {loading ? (
                <div className="py-5">
                    <LoadingSpinner text="Fetching server configuration..." />
                </div>
            ) : (
                <Row>
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white border-bottom py-3">
                                <h5 className="mb-0 d-flex align-items-center gap-2">
                                    <Server size={18} className="text-primary" /> Core Server Settings
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSave}>
                                    <Row className="mb-3">
                                        <Col md={8}>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">SMTP Host</Form.Label>
                                                <Form.Control type="text" name="mail_host" value={settings.mail_host} onChange={handleChange} placeholder="e.g. smtp.gmail.com" required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">Port</Form.Label>
                                                <Form.Control type="number" name="mail_port" value={settings.mail_port} onChange={handleChange} placeholder="587" required />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">Username</Form.Label>
                                                <Form.Control type="text" name="mail_username" value={settings.mail_username || ''} onChange={handleChange} placeholder="service@gmail.com" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">Password</Form.Label>
                                                <Form.Control type="password" name="mail_password" value={settings.mail_password || ''} onChange={handleChange} placeholder="********" />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">Encryption</Form.Label>
                                                <Form.Select name="mail_encryption" value={settings.mail_encryption} onChange={handleChange}>
                                                    <option value="none">None</option>
                                                    <option value="ssl">SSL (465)</option>
                                                    <option value="tls">TLS (587)</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} className="d-flex align-items-end">
                                            <Form.Check 
                                                type="switch" 
                                                id="is-active" 
                                                name="is_active"
                                                label="Enabled (Override Env)" 
                                                checked={settings.is_active === 1} 
                                                onChange={handleChange} 
                                                className="mb-2 fw-bold text-primary"
                                            />
                                        </Col>
                                    </Row>

                                    <hr className="my-4 opacity-10" />
                                    
                                    <h5 className="mb-3 d-flex align-items-center gap-2">
                                        <Mail size={18} className="text-success" /> Sender Identity
                                    </h5>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">From Email Address</Form.Label>
                                                <Form.Control type="email" name="mail_from_address" value={settings.mail_from_address} onChange={handleChange} placeholder="hello@yourcompany.com" required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">From Name</Form.Label>
                                                <Form.Control type="text" name="mail_from_name" value={settings.mail_from_name} onChange={handleChange} placeholder="John Doe from Support" required />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="mt-5 text-end">
                                        <Button variant="primary" type="submit" disabled={saving}>
                                            {saving ? <><Spinner size="sm" className="me-2" /> Saving...</> : <><CheckCircle size={18} className="me-2" /> Update Configuration</>}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-light py-3">
                                <h5 className="mb-0 d-flex align-items-center gap-2 small fw-bold">
                                    <Send size={14} className="text-info" /> Test SMTP Delivery
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <p className="text-muted x-small">Send a manual test email to verify your outgoing SMTP connection is current and working.</p>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small font-monospace">Recipient Email</Form.Label>
                                    <Form.Control type="email" size="sm" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="your@email.com" />
                                </Form.Group>
                                <Button variant="outline-info" size="sm" className="w-100" onClick={handleTest} disabled={testing}>
                                    {testing ? 'Testing...' : 'Send Test Mail'}
                                </Button>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm bg-primary text-white">
                            <Card.Body className="p-4">
                                <Shield size={24} className="mb-3" />
                                <h6>Security Note</h6>
                                <p className="small mb-0 opacity-75">Your SMTP credentials are stored securely in your database. This panel allow you to &apos;re-wire&apos; the system without manual .env file edits.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <style jsx>{`
                .x-small { font-size: 11px; }
            `}</style>
        </Container>
    );
};

export default SmtpSettingsCMS;

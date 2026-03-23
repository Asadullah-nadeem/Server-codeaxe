import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Badge, Tab, Nav } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import MediaGallery from '../../components/MediaGallery';
import useMounted from 'hooks/useMounted';

const ContactCMS = () => {
    const [pageData, setPageData] = useState({ header: {}, direct_info: [], response_times: [] });
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('submissions');
    const hasMounted = useMounted();

    // Modals
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);

    // Forms
    const [headerForm, setHeaderForm] = useState({ label: '', title: '', description: '' });
    const [infoForm, setInfoForm] = useState({ id: null, icon: 'Mail', label: '', href: '', sort_order: 0, is_active: 1 });
    const [timeForm, setTimeForm] = useState({ id: null, label: '', value: '', sort_order: 0, is_active: 1 });

    const fetchAllContactData = async () => {
        try {
            setLoading(true);
            const resSub = await fetchApi('/admin/contact/submissions');
            if (resSub?.success) setSubmissions(resSub.data);

            const resPage = await fetchApi('/contact'); // Public but we use it to get the header/info
            if (resPage?.success) {
                setPageData(resPage.data);
                setHeaderForm(resPage.data.header || { label: '', title: '', description: '' });
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch contact management data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllContactData(); }, []);

    const handleHeaderSubmit = async (e) => {
        e.preventDefault();
        try {
            // Need a backend route for this. I'll check if it exists or add it.
            // For now, I'll use a placeholder or create it in the controller.
            await fetchApi('/admin/contact/header', { method: 'PUT', body: JSON.stringify(headerForm) });
            alert("Header updated!");
        } catch (error) { alert("Header update failed."); }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await fetchApi(`/admin/contact/submissions/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
            fetchAllContactData();
        } catch (error) { alert("Failed to update status."); }
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            if (infoForm.id) await fetchApi(`/admin/contact/info/${infoForm.id}`, { method: 'PUT', body: JSON.stringify(infoForm) });
            else await fetchApi('/admin/contact/info', { method: 'POST', body: JSON.stringify(infoForm) });
            setShowInfoModal(false);
            fetchAllContactData();
        } catch (error) { alert("Failed to save contact info."); }
    };

    const handleInfoDelete = async (id) => {
        if (!confirm('Delete this contact link?')) return;
        try {
            await fetchApi(`/admin/contact/info/${id}`, { method: 'DELETE' });
            fetchAllContactData();
        } catch (error) { alert("Delete failed."); }
    };

    const handleTimeSubmit = async (e) => {
        e.preventDefault();
        try {
            if (timeForm.id) await fetchApi(`/admin/contact/times/${timeForm.id}`, { method: 'PUT', body: JSON.stringify(timeForm) });
            else await fetchApi('/admin/contact/times', { method: 'POST', body: JSON.stringify(timeForm) });
            setShowTimeModal(false);
            fetchAllContactData();
        } catch (error) { alert("Failed to save response time."); }
    };

    const handleTimeDelete = async (id) => {
        if (!confirm('Delete this response time?')) return;
        try {
            await fetchApi(`/admin/contact/times/${id}`, { method: 'DELETE' });
            fetchAllContactData();
        } catch (error) { alert("Delete failed."); }
    };

    if (loading) return <Container fluid className="p-4"><p>Loading contact data...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">Contact & Submissions</h2>

            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item><Nav.Link eventKey="submissions">Form Submissions</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="page_settings">Contact Page Layout</Nav.Link></Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="submissions">
                        <Card>
                            <Card.Body>
                                <Table hover responsive>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Name / Company</th>
                                            <th>Email</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map(s => (
                                            <tr key={s.id}>
                                                <td>{new Date(s.submitted_at).toLocaleDateString()}</td>
                                                <td><strong>{s.name}</strong><br/><small className="text-muted">{s.company}</small></td>
                                                <td>{s.email}</td>
                                                <td><p className="mb-0 small" style={{maxWidth: '300px'}}>{s.message}</p></td>
                                                <td>
                                                    <Badge bg={s.status === 'new' ? 'primary' : s.status === 'read' ? 'info' : 'success'}>
                                                        {s.status.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button size="sm" variant="outline-info" className="me-1" onClick={() => handleStatusUpdate(s.id, 'read')}>Read</Button>
                                                    <Button size="sm" variant="outline-success" onClick={() => handleStatusUpdate(s.id, 'replied')}>Replied</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Tab.Pane>

                    <Tab.Pane eventKey="page_settings">
                        <Row>
                            <Col lg={12}>
                                <Card className="mb-4">
                                    <Card.Header className="bg-primary text-white"><h5 className="mb-0">Page Header</h5></Card.Header>
                                    <Card.Body>
                                        <Form onSubmit={handleHeaderSubmit}>
                                            <Row>
                                                <Col md={3}><Form.Group className="mb-3"><Form.Label>Badge Label</Form.Label><Form.Control type="text" value={headerForm.label} onChange={e => setHeaderForm({...headerForm, label: e.target.value})} /></Form.Group></Col>
                                                <Col md={9}><Form.Group className="mb-3"><Form.Label>Main Title</Form.Label><Form.Control type="text" value={headerForm.title} onChange={e => setHeaderForm({...headerForm, title: e.target.value})} /></Form.Group></Col>
                                            </Row>
                                            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} value={headerForm.description} onChange={e => setHeaderForm({...headerForm, description: e.target.value})} /></Form.Group>
                                            <Button type="submit" variant="primary">Update Header</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col md={6}>
                                <Card className="mb-4">
                                    <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 text-white">Direct Info (Links)</h5>
                                        <Button variant="light" size="sm" onClick={() => { setInfoForm({ id: null, icon: 'Mail', label: '', href: '', sort_order: 0, is_active: 1 }); setShowInfoModal(true); }}>Add Link</Button>
                                    </Card.Header>
                                    <Card.Body>
                                        <Table size="sm" hover>
                                            <thead><tr><th>Icon</th><th>Label</th><th>Status</th><th>Action</th></tr></thead>
                                            <tbody>
                                                {pageData.direct_info.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.icon}</td>
                                                        <td>{item.label}</td>
                                                        <td><Badge bg={item.is_active ? 'success' : 'secondary'}>{item.is_active ? 'On' : 'Off'}</Badge></td>
                                                        <td>
                                                            <Button size="xs" variant="info" className="me-1" onClick={() => { setInfoForm(item); setShowInfoModal(true); }}>Edit</Button>
                                                            <Button size="xs" variant="danger" onClick={() => handleInfoDelete(item.id)}>Del</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="mb-4">
                                    <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 text-white">Response Times</h5>
                                        <Button variant="light" size="sm" onClick={() => { setTimeForm({ id: null, label: '', value: '', sort_order: 0, is_active: 1 }); setShowTimeModal(true); }}>Add Time</Button>
                                    </Card.Header>
                                    <Card.Body>
                                        <Table size="sm" hover>
                                            <thead><tr><th>Label</th><th>Value</th><th>Status</th><th>Action</th></tr></thead>
                                            <tbody>
                                                {pageData.response_times.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.label}</td>
                                                        <td>{item.value}</td>
                                                        <td><Badge bg={item.is_active ? 'success' : 'secondary'}>{item.is_active ? 'On' : 'Off'}</Badge></td>
                                                        <td>
                                                            <Button size="xs" variant="info" className="me-1" onClick={() => { setTimeForm(item); setShowTimeModal(true); }}>Edit</Button>
                                                            <Button size="xs" variant="danger" onClick={() => handleTimeDelete(item.id)}>Del</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>

                </Tab.Content>
            </Tab.Container>

            {/* Modals for Direct Info / Response Times */}
            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
                <Modal.Header closeButton><Modal.Title>{infoForm.id ? 'Edit' : 'Add'} Contact Link</Modal.Title></Modal.Header>
                <Form onSubmit={handleInfoSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-2"><Form.Label>Icon Name (Lucide)</Form.Label><Form.Control type="text" value={infoForm.icon} onChange={e => setInfoForm({...infoForm, icon: e.target.value})} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Label</Form.Label><Form.Control type="text" value={infoForm.label} onChange={e => setInfoForm({...infoForm, label: e.target.value})} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Link / HREF</Form.Label><Form.Control type="text" value={infoForm.href} onChange={e => setInfoForm({...infoForm, href: e.target.value})} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Sort Order</Form.Label><Form.Control type="number" value={infoForm.sort_order} onChange={e => setInfoForm({...infoForm, sort_order: parseInt(e.target.value)})} /></Form.Group>
                        <Form.Check type="switch" label="Active" checked={infoForm.is_active === 1} onChange={e => setInfoForm({...infoForm, is_active: e.target.checked ? 1 : 0})} />
                    </Modal.Body>
                    <Modal.Footer><Button variant="secondary" onClick={() => setShowInfoModal(false)}>Cancel</Button><Button type="submit" variant="primary">Save Info</Button></Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showTimeModal} onHide={() => setShowTimeModal(false)}>
                <Modal.Header closeButton><Modal.Title>{timeForm.id ? 'Edit' : 'Add'} Response Time</Modal.Title></Modal.Header>
                <Form onSubmit={handleTimeSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-2"><Form.Label>Label</Form.Label><Form.Control type="text" value={timeForm.label} onChange={e => setTimeForm({...timeForm, label: e.target.value})} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Value (e.g. 24h)</Form.Label><Form.Control type="text" value={timeForm.value} onChange={e => setTimeForm({...timeForm, value: e.target.value})} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Sort Order</Form.Label><Form.Control type="number" value={timeForm.sort_order} onChange={e => setTimeForm({...timeForm, sort_order: parseInt(e.target.value)})} /></Form.Group>
                        <Form.Check type="switch" label="Active" checked={timeForm.is_active === 1} onChange={e => setTimeForm({...timeForm, is_active: e.target.checked ? 1 : 0})} />
                    </Modal.Body>
                    <Modal.Footer><Button variant="secondary" onClick={() => setShowTimeModal(false)}>Cancel</Button><Button type="submit" variant="primary">Save Time</Button></Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ContactCMS;

import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Badge } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';

const RewritesCMS = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ id: null, source: '', destination: '', description: '', sort_order: 0, is_active: 1 });

    const fetchRewrites = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/rewrites');
            if (res?.success) setData(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch rewrite rules.');
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

    if (loading) return <Container fluid className="p-4"><p>Loading rewrites...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-4">SEO & Route Rewrites</h2>
            
            <Alert variant="info" className="mb-4">
                <strong>Note:</strong> Route rewrites allow you to map custom URLs to internal paths. For example, <code>/services/web</code> to <code>/service/123</code>.
            </Alert>

            <Card>
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Active Rewrite Rules</h5>
                    <Button variant="light" size="sm" onClick={() => handleShow()}>Add New Rule</Button>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead className="table-light">
                            <tr><th>Sort</th><th>Source Path</th><th>Destination Path</th><th>Status</th><th>Actions</th></tr>
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
                            <Form.Label>Source (Internal Path)</Form.Label>
                            <Form.Control type="text" placeholder="/service/web-dev" value={form.source} onChange={e => setForm({...form, source: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Destination (Browser URL)</Form.Label>
                            <Form.Control type="text" placeholder="/web-services" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} required />
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
        </Container>
    );
};

// Import Alert from react-bootstrap
import { Alert } from 'react-bootstrap';

export default RewritesCMS;

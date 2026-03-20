import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Badge } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';

const UsersCMS = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ id: null, name: '', username: '', email: '', password: '', role: 'admin', is_active: 1 });

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/list');
            if (res?.success) setAdmins(res.data);
        } catch (error) {
            console.error(error);
            // If they aren't a superadmin, this will fail
            alert('Access Denied: You must be a Super Admin to manage accounts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAdmins(); }, []);

    const handleShow = (item = null) => {
        setForm(item ? {...item, password: ''} : { id: null, name: '', username: '', email: '', password: '', role: 'admin', is_active: 1 });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await fetchApi(`/admin/update/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
            } else {
                await fetchApi('/admin/create', { method: 'POST', body: JSON.stringify(form) });
            }
            setShowModal(false);
            fetchAdmins();
        } catch (error) { alert("Failed to save admin user."); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this admin?')) return;
        try {
            await fetchApi(`/admin/delete/${id}`, { method: 'DELETE' });
            fetchAdmins();
        } catch (error) { alert("Failed to remove admin."); }
    };

    if (loading) return <Container fluid className="p-4"><p>Loading admin accounts...</p></Container>;

    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-1">Admin Account Management</h2>
            <p className="text-muted mb-4 small">Manage internal users who can access this dashboard. (Super Admin Only)</p>

            <Card>
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">All System Admins</h5>
                    <Button variant="light" size="sm" onClick={() => handleShow()}>Create New Admin</Button>
                </Card.Header>
                <Card.Body>
                    <Table hover responsive className="text-nowrap">
                        <thead className="table-light">
                            <tr><th>Name</th><th>Username</th><th>Email / Role</th><th>Account Status</th><th>Created</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {admins.map(a => (
                                <tr key={a.id}>
                                    <td><strong>{a.name}</strong></td>
                                    <td><code>{a.username}</code></td>
                                    <td>{a.email}<br/><small className="text-muted text-uppercase">{a.role}</small></td>
                                    <td><Badge bg={a.is_active ? 'success' : 'secondary'}>{a.is_active ? 'Active' : 'Disabled'}</Badge></td>
                                    <td>{new Date(a.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <Button size="sm" variant="info" className="me-2" onClick={() => handleShow(a)}>Edit</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(a.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{form.id ? 'Update' : 'Create'} Admin User</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required disabled={!!form.id} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>User Role</Form.Label>
                                    <Form.Select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                                        <option value="admin">Admin (All CMS)</option>
                                        <option value="superadmin">Super Admin (Can manage users)</option>
                                        <option value="demo">Demo Mode (Read-only)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required disabled={!!form.id} />
                        </Form.Group>
                        {!form.id && (
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                        </Form.Group>
                        )}
                        <Form.Check type="switch" label="Account Active" checked={form.is_active === 1} onChange={e => setForm({...form, is_active: e.target.checked ? 1 : 0})} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save User</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default UsersCMS;

import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal, Container, Badge, Image } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Eye, PencilSquare, Trash, PersonCircle } from 'react-bootstrap-icons';

const UsersCMS = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [form, setForm] = useState({ id: null, name: '', username: '', email: '', password: '', role: 'admin', is_active: 1 });

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/admin/list');
            if (res?.success) setAdmins(res.data);
        } catch (error) {
            console.error(error);
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

    const handleViewProfile = (admin) => {
        setSelectedAdmin(admin);
        setShowProfileModal(true);
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


    return (
        <Container fluid className="px-6 py-4">
            <h2 className="mb-1">Admin Account Management</h2>
            <p className="text-muted mb-4 small">Manage internal users who can access this dashboard. (Super Admin Only)</p>

            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark">System Access Control</h5>
                    <Button variant="primary" size="sm" className="px-4" onClick={() => handleShow()}>Create New Account</Button>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="py-5">
                            <LoadingSpinner text="Fetching administrative access..." />
                        </div>
                    ) : (
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr><th>Admin Profile</th><th>Username</th><th>Permissions</th><th>Account Identity</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {admins.map(a => (
                                    <tr key={a.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {a.photo ? (
                                                    <Image src={a.photo} className="rounded-circle" width={40} height={40} style={{objectFit: 'cover'}} alt={a.name}/>
                                                ) : (
                                                    <div className="rounded-circle bg-light-primary text-primary d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px', fontWeight: 'bold'}}>
                                                        {a.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="ms-3 lh-1">
                                                    <h5 className="mb-1">{a.name}</h5>
                                                    <Badge bg={a.is_active == 1 ? 'success' : 'danger'} className="x-small">{a.is_active == 1 ? 'ACTIVE' : 'LOCKED'}</Badge>
                                                    {a.is_online ? <Badge bg="primary" className="x-small ms-1">ONLINE</Badge> : <Badge bg="secondary" className="x-small ms-1">OFFLINE</Badge>}
                                                    {a.has_forgot_password && <Badge bg="warning" text="dark" className="x-small ms-1">RECOVERY REQ</Badge>}
                                                </div>
                                            </div>
                                        </td>
                                        <td><code className="text-primary fw-bold">@{a.username}</code></td>
                                        <td>
                                            <Badge bg="light-info" className="text-info text-uppercase px-2">{a.role}</Badge>
                                            <div className="x-small text-muted mt-1">Full access granted</div>
                                        </td>
                                        <td>
                                            <div className="small text-dark fw-medium">{a.email}</div>
                                            <div className="x-small text-muted">Created: {new Date(a.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            <Button size="sm" variant="light" className="me-2 text-primary" onClick={() => handleViewProfile(a)} title="View Detail Profile"><Eye size={14}/></Button>
                                            <Button size="sm" variant="light" className="me-2 text-info" onClick={() => handleShow(a)} title="Edit Settings"><PencilSquare size={14}/></Button>
                                            <Button size="sm" variant="light" className="text-danger" onClick={() => handleDelete(a.id)} title="Revoke Access"><Trash size={14}/></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Profile Detail Modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
                <Modal.Body className="p-0 overflow-hidden rounded-3">
                    <div style={{height: '100px', background: 'linear-gradient(45deg, #624bff, #a34bff)'}}></div>
                    <div className="px-4 pb-4">
                        <div className="d-flex justify-content-center mt-n5 mb-3">
                            {selectedAdmin?.photo ? (
                                <Image src={selectedAdmin.photo} className="rounded-circle border border-4 border-white shadow" width={100} height={100} style={{objectFit: 'cover'}} alt={selectedAdmin.name}/>
                            ) : (
                                <div className="rounded-circle bg-white border border-4 border-white shadow d-flex align-items-center justify-content-center text-primary fw-bold fs-1" style={{width: '100px', height: '100px'}}>
                                    {selectedAdmin?.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="text-center mb-4">
                            <h3 className="mb-0 fw-bold">{selectedAdmin?.name}</h3>
                            <p className="text-muted small">@{selectedAdmin?.username}</p>
                            <Badge bg="primary" className="text-uppercase px-3 py-1 rounded-pill">{selectedAdmin?.role}</Badge>
                        </div>
                        <hr className="my-4 opacity-10" />
                        <div className="row g-4 text-center">
                            <div className="col-6">
                                <h6 className="text-muted small text-uppercase fw-bold ls-1 mb-1">Email Node</h6>
                                <p className="mb-0 fw-medium">{selectedAdmin?.email}</p>
                            </div>
                            <div className="col-6">
                                <h6 className="text-muted small text-uppercase fw-bold ls-1 mb-1">Status</h6>
                                <p className={`mb-0 fw-bold ${selectedAdmin?.is_active == 1 ? 'text-success' : 'text-danger'}`}>
                                    {selectedAdmin?.is_active == 1 ? 'ACTIVE' : 'LOCKED / DISABLED'} 
                                    <span className={`ms-2 fs-6 mb-1 d-inline-block rounded-circle ${selectedAdmin?.is_online ? 'bg-primary' : 'bg-secondary'}`} style={{width: 10, height: 10}} title={selectedAdmin?.is_online ? "Online Right Now" : "Offline"}></span>
                                </p>
                                {selectedAdmin?.has_forgot_password && <div className="mt-2"><Badge bg="warning" text="dark">Requested Identity Reset</Badge></div>}
                            </div>
                        </div>
                    </div>
                    <div className="bg-light p-3 text-center border-top">
                        <Button variant="outline-primary" size="sm" className="px-4 rounded-pill me-2 fw-bold" onClick={() => window.location.href=`/pages/profile?username=${selectedAdmin?.username}`}>Full Profile</Button>
                        <Button variant="secondary" size="sm" className="px-5 rounded-pill" onClick={() => setShowProfileModal(false)}>Close View</Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Edit User Modal */}
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
                        <Form.Check type="switch" label="Account Active" checked={form.is_active == 1} onChange={e => setForm({...form, is_active: e.target.checked ? 1 : 0})} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save User</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
             <style jsx>{`
                .x-small { font-size: 10px; }
                .ls-1 { letter-spacing: 1px; }
                .mt-n5 { margin-top: -3rem !important; }
            `}</style>
        </Container>
    );
};

export default UsersCMS;

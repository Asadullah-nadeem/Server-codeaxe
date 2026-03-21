import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Spinner } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { User, Mail, Calendar, MessageSquare, Info, Shield, MessageCircle } from 'react-feather';
import AdminChatWindow from '../../components/AdminChatWindow';

const RegisteredUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeChat, setActiveChat] = useState(null);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchApi('/admin/users/registered');
            if (res?.success) {
                setUsers(res.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleVerify = async (id) => {
        if (!confirm('Are you sure you want to manually verify this user?')) return;
        try {
            const res = await fetchApi(`/admin/users/verify/${id}`, {
                method: 'POST'
            });
            if (res.success) {
                alert(res.message);
                loadUsers(); // Refresh list
            }
        } catch (err) {
            alert(err.message || 'Verification failed');
        }
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
    };

    if (loading && users.length === 0) {
        return (
            <Container fluid className="p-6 text-center mt-10">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading Registered Users...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="px-6 py-4">
            <Row className="mb-4">
                <Col lg={12} md={12} xs={12}>
                    <div>
                        <h2 className="mb-1 fw-bold">Registered End-Users</h2>
                        <p className="text-muted small">View all frontend users and their corresponding account activity/messages.</p>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12} md={12} xs={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">User Directory</h5>
                            <Badge bg="primary">{users.length} Total Users</Badge>
                        </Card.Header>
                        <Table responsive className="text-nowrap mb-0 table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-bottom-0">Name</th>
                                    <th className="border-bottom-0">Email</th>
                                    <th className="border-bottom-0">Login Type</th>
                                    <th className="border-bottom-0">Registration Date</th>
                                    <th className="border-bottom-0">Verified</th>
                                    <th className="border-bottom-0">Verification</th>
                                    <th className="border-bottom-0">Resets</th>
                                    <th className="border-bottom-0">Messages</th>
                                    <th className="border-bottom-0">Requests</th>
                                    <th className="border-bottom-0 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((u) => (
                                    <tr key={u.id}>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-light-primary text-primary rounded-circle p-2">
                                                    <User size={18} />
                                                </div>
                                                <h6 className="mb-0 fw-bold">{u.username || u.name}</h6>
                                            </div>
                                        </td>
                                        <td className="py-3 text-muted">{u.email}</td>
                                        <td className="py-3">
                                            <Badge bg={u.login_type === 'sso' ? 'info' : 'secondary'} className="text-uppercase x-small">
                                                {u.login_type || 'password'}
                                            </Badge>
                                        </td>
                                        <td className="py-3">
                                            {new Date(u.created_at).toLocaleDateString()}
                                            <Badge bg="secondary" className="ms-2 x-small opacity-75">
                                                {new Date() - new Date(u.created_at) < 7 * 24 * 60 * 60 * 1000 ? 'NEW' : 'OLD'}
                                            </Badge>
                                        </td>
                                        <td className="py-3">
                                            {u.email_verified_at ? (
                                                <Badge bg="success" pill>YES</Badge>
                                            ) : (
                                                <div className="d-flex flex-column align-items-start gap-1">
                                                    <Badge bg="danger" pill>NO</Badge>
                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        className="p-0 text-decoration-none x-small fw-bold text-primary" 
                                                        onClick={() => handleVerify(u.id)}
                                                    >
                                                        Verify Now
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3">
                                            {u.verification_tokens && u.verification_tokens.length > 0 ? (
                                                <Badge bg="warning" text="dark">{u.verification_tokens.length} PENDING</Badge>
                                            ) : (
                                                <span className="text-muted small">None</span>
                                            )}
                                        </td>
                                        <td className="py-3">
                                            {u.password_resets && u.password_resets.length > 0 ? (
                                                <Badge bg="danger">{u.password_resets.length} ACTIVE</Badge>
                                            ) : (
                                                <span className="text-muted small">None</span>
                                            )}
                                        </td>
                                        <td className="py-3">
                                            {u.messages && u.messages.length > 0 ? (
                                                <Badge bg="info">{u.messages.length}</Badge>
                                            ) : (
                                                <span className="text-muted small">None</span>
                                            )}
                                        </td>
                                        <td className="py-3">
                                            {u.requests && u.requests.length > 0 ? (
                                                <Badge bg="success">{u.requests.length}</Badge>
                                            ) : (
                                                <span className="text-muted small">None</span>
                                            )}
                                        </td>
                                        <td className="py-3 text-center">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleViewProfile(u)}>
                                                View Profile
                                            </Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted">
                                            No registered users found in the system.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>

            {/* Profile Modal */}
            <Modal show={!!selectedUser} onHide={() => setSelectedUser(null)} size="lg" centered>
                {selectedUser && (
                    <>
                        <Modal.Header closeButton className="border-0 bg-light">
                            <Modal.Title className="fw-bold d-flex align-items-center">
                                <User size={20} className="me-2 text-primary" /> User Profile: {selectedUser.username || selectedUser.name}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-0">
                            <div className="p-4 bg-light border-bottom">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <Mail size={14} className="text-muted" /> <strong className="small">Email:</strong> {selectedUser.email}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <Calendar size={14} className="text-muted" /> <strong className="small">Joined:</strong> {new Date(selectedUser.created_at).toLocaleString()}
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div className="p-4">
                                <h6 className="fw-bold mb-3 d-flex align-items-center">
                                    <MessageSquare size={16} className="me-2 text-primary" /> Messages Sent by User
                                </h6>

                                {selectedUser.messages && selectedUser.messages.length > 0 ? (
                                    <div className="messages-timeline">
                                        {selectedUser.messages.map((msg) => (
                                            <Card key={msg.id} className="mb-3 border shadow-none bg-light bg-opacity-50">
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="fw-bold mb-0">{msg.subject || 'No Subject'}</h6>
                                                        <Badge bg={msg.status === 'replied' ? 'success' : 'warning'} className="x-small">
                                                            {msg.status?.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted small mb-3 fst-italic">"{msg.message}"</p>

                                                    {msg.admin_reply && (
                                                        <div className="bg-white p-3 border rounded border-start border-4 border-success mt-2">
                                                            <strong className="d-block small text-success mb-1">Reply from Support:</strong>
                                                            <span className="small text-muted">{msg.admin_reply}</span>
                                                        </div>
                                                    )}

                                                    <div className="mt-2 text-end text-muted font-monospace" style={{fontSize: '10px'}}>
                                                        Received: {new Date(msg.submitted_at || msg.created_at).toLocaleString()}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-light rounded border border-dashed mb-4">
                                        <Info size={24} className="text-muted mb-2 opacity-50" />
                                        <p className="text-muted small mb-0">This user hasn't sent any messages to contact support yet.</p>
                                    </div>
                                )}

                                <hr className="my-4" />

                                <h6 className="fw-bold mb-3 d-flex align-items-center">
                                    <Calendar size={16} className="me-2 text-primary" /> Active Client Requests
                                </h6>

                                {selectedUser.requests && selectedUser.requests.length > 0 ? (
                                    <div className="requests-timeline">
                                        {selectedUser.requests.map((req) => (
                                            <Card key={req.id} className="mb-3 border shadow-none bg-light bg-opacity-50 border-start border-4 border-info">
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="fw-bold mb-0">{req.title}</h6>
                                                        <Badge bg={
                                                            req.status === 'completed' ? 'success' :
                                                            req.status === 'in_progress' ? 'primary' :
                                                            req.status === 'cancelled' ? 'danger' : 'warning'
                                                        } className="x-small text-uppercase">
                                                            {req.status?.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                                        <Badge bg="secondary" className="bg-opacity-10 text-dark border"><small>Service: {req.service_type}</small></Badge>
                                                        {req.budget && <Badge bg="secondary" className="bg-opacity-10 text-dark border"><small>Budget: {req.budget}</small></Badge>}
                                                    </div>
                                                    <p className="text-muted small mb-3">"{req.description}"</p>

                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <Button 
                                                            variant="primary" 
                                                            size="sm" 
                                                            className="d-flex align-items-center gap-2 x-small"
                                                            onClick={() => setActiveChat({ id: req.id, title: req.title })}
                                                        >
                                                            <MessageCircle size={14} /> Open Correspondence
                                                        </Button>
                                                        <div className="text-muted font-monospace" style={{fontSize: '10px'}}>
                                                            Requested on: {new Date(req.created_at).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-light rounded border border-dashed">
                                        <Info size={24} className="text-muted mb-2 opacity-50" />
                                        <p className="text-muted small mb-0">This user hasn't submitted any service requests yet.</p>
                                    </div>
                                )}

                                <hr className="my-4" />

                                <h6 className="fw-bold mb-3 d-flex align-items-center">
                                    <Mail size={16} className="me-2 text-primary" /> Authentication Data
                                </h6>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Card className="border shadow-none bg-light bg-opacity-50 h-100">
                                            <Card.Body>
                                                <h6 className="fw-bold mb-2 small text-muted">Password Reset Tokens</h6>
                                                {selectedUser.password_resets && selectedUser.password_resets.length > 0 ? (
                                                    selectedUser.password_resets.map((token, idx) => (
                                                        <div key={idx} className="mb-2 pb-2 border-bottom">
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <span className="x-small text-muted font-monospace bg-white px-1 border rounded">{token.token.substring(0,25)}...</span>
                                                            </div>
                                                            <div className="text-muted x-small">
                                                                Created: {new Date(token.created_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-muted small pt-2">No active reset tokens.</div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="border shadow-none bg-light bg-opacity-50 h-100">
                                            <Card.Body>
                                                <h6 className="fw-bold mb-2 small text-muted">Verification Tokens</h6>
                                                {selectedUser.verification_tokens && selectedUser.verification_tokens.length > 0 ? (
                                                    selectedUser.verification_tokens.map((token, idx) => (
                                                        <div key={idx} className="mb-2 pb-2 border-bottom">
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <span className="x-small text-muted font-monospace bg-white px-1 border rounded">{token.token.substring(0,25)}...</span>
                                                            </div>
                                                            <div className="text-muted x-small">
                                                                Created: {new Date(token.created_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-muted small pt-2">No active verification links.</div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="border-0">
                            <Button variant="secondary" onClick={() => setSelectedUser(null)}>Close Profile</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            <style jsx>{`
                .x-small { font-size: 11px; }
            `}</style>

            {activeChat && (
                <AdminChatWindow 
                    requestId={activeChat.id} 
                    title={activeChat.title} 
                    onClose={() => setActiveChat(null)} 
                />
            )}
        </Container>
    );
};

export default RegisteredUsers;

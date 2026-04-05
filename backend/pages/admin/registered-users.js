import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Spinner, Form, Offcanvas, InputGroup, ListGroup } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import { User, Mail, Calendar, MessageSquare, Info, Shield, MessageCircle, Search, Filter, RefreshCw, CheckCircle, XCircle, MoreVertical, Trash2, UserCheck, UserX, ExternalLink } from 'react-feather';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminChatWindow from '../../components/AdminChatWindow';

const RegisteredUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    
    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, banned
    const [verifiedFilter, setVerifiedFilter] = useState('all'); // all, verified, unverified
    const [loginTypeFilter, setLoginTypeFilter] = useState('all'); // all, password, sso

    const loadUsers = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetchApi('/admin/users/registered');
            if (res?.success) {
                setUsers(res.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = (u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   u.name?.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesStatus = statusFilter === 'all' || 
                                 (statusFilter === 'banned' && u.is_banned == 1) || 
                                 (statusFilter === 'active' && u.is_banned == 0);
            
            const matchesVerified = verifiedFilter === 'all' ||
                                   (verifiedFilter === 'verified' && u.email_verified_at) ||
                                   (verifiedFilter === 'unverified' && !u.email_verified_at);
            
            const matchesLogin = loginTypeFilter === 'all' ||
                                (loginTypeFilter === u.login_type) ||
                                (loginTypeFilter === 'password' && !u.login_type);

            return matchesSearch && matchesStatus && matchesVerified && matchesLogin;
        });
    }, [users, searchTerm, statusFilter, verifiedFilter, loginTypeFilter]);

    const handleVerify = async (id) => {
        if (!confirm('Are you sure you want to manually verify this user?')) return;
        try {
            const res = await fetchApi(`/admin/users/verify/${id}`, { method: 'POST' });
            if (res.success) {
                loadUsers(true);
            }
        } catch (err) {
            alert(err.message || 'Verification failed');
        }
    };

    const handleToggleBan = async (user) => {
        const action = user.is_banned ? 'unban' : 'ban';
        if (!confirm(`Are you sure you want to ${action} ${user.username || user.name}?`)) return;
        
        try {
            const res = await fetchApi(`/admin/users/toggle-ban/${user.id}`, { method: 'POST' });
            if (res.success) {
                loadUsers(true);
                if (selectedUser?.id === user.id) setSelectedUser({...selectedUser, is_banned: !user.is_banned});
            }
        } catch (err) {
            alert(err.message || 'Failed to toggle ban status');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchApi('/admin/users/create', {
                method: 'POST',
                body: JSON.stringify(newUser)
            });
            if (res.success) {
                setShowAddModal(false);
                setNewUser({ username: '', email: '', password: '' });
                loadUsers();
            }
        } catch (err) {
            alert(err.message || 'Failed to create user');
        }
    };

    return (
        <Container fluid className="p-6">
            <Row className="mb-4 align-items-center">
                <Col lg={8}>
                    <h2 className="mb-0 fw-bold">Registered Core Users</h2>
                    <p className="text-muted small mb-0">Centralized governance for frontend user identity, correspondence, and security status.</p>
                </Col>
                <Col lg={4} className="text-end">
                    <Button variant="primary" className="shadow-sm d-inline-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
                        <UserCheck size={18} /> Provision New User
                    </Button>
                </Col>
            </Row>

            {/* Quick Stats & Filters */}
            <Card className="border-0 shadow-sm mb-6 overflow-hidden">
                <Card.Body className="p-4 bg-light bg-opacity-25">
                    <Row className="g-3">
                        <Col lg={4}>
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-end-0"><Search size={16} className="text-muted" /></InputGroup.Text>
                                <Form.Control 
                                    className="border-start-0 ps-0 shadow-none font-weight-medium" 
                                    placeholder="Search by name or email..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col lg={2}>
                            <Form.Select className="shadow-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">Every Status</option>
                                <option value="active">Operational Only</option>
                                <option value="banned">Restricted / Banned</option>
                            </Form.Select>
                        </Col>
                        <Col lg={2}>
                            <Form.Select className="shadow-none" value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)}>
                                <option value="all">Any Verification</option>
                                <option value="verified">Verified Identity</option>
                                <option value="unverified">Pending Validation</option>
                            </Form.Select>
                        </Col>
                        <Col lg={2}>
                            <Form.Select className="shadow-none" value={loginTypeFilter} onChange={(e) => setLoginTypeFilter(e.target.value)}>
                                <option value="all">All Login Types</option>
                                <option value="password">Standard Password</option>
                                <option value="sso">Digital SSO (Google/Git)</option>
                            </Form.Select>
                        </Col>
                        <Col lg={2}>
                            <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2 shadow-none" onClick={() => loadUsers(true)}>
                                <RefreshCw size={14} /> Refresh Data
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>

                <Card.Body className="p-4 bg-white">
                    {loading && users.length === 0 ? (
                        <div className="py-5"><LoadingSpinner text="Scanning identity database..." /></div>
                    ) : (
                        <Row className="g-4">
                            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                <Col key={u.id} xl={4} lg={6} md={12} xs={12}>
                                    <div className="user-profile-card h-100 p-4 border-0 shadow-sm transition-all premium-card">
                                        {/* 1. Identity & Status */}
                                        <div className="d-flex align-items-start justify-content-between mb-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className={`avatar avatar-lg rounded-circle d-flex align-items-center justify-content-center bg-light-${u.is_banned ? 'danger' : 'primary'} text-${u.is_banned ? 'danger' : 'primary'} fw-bold border border-white shadow-sm fw-bold fs-4`} style={{width: 52, height: 52}}>
                                                    {u.username?.[0]?.toUpperCase() || u.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <h5 className="mb-0 fw-bold text-dark">{u.username || u.name}</h5>
                                                        <Info size={14} className="text-muted cursor-pointer opacity-50 hover-opacity-100" title="Click for core account data" onClick={() => setSelectedUser(u)} />
                                                    </div>
                                                    <div className="mt-1">
                                                        {u.is_banned ? (
                                                            <Badge bg="danger" className="text-uppercase x-small px-2 py-1 shadow-sm d-inline-flex align-items-center gap-1 border border-danger border-opacity-25" style={{letterSpacing: '0.5px'}}>
                                                                <span className="bg-white rounded-circle" style={{width: 6, height: 6}}></span> RESTRICTED ACCESS
                                                            </Badge>
                                                        ) : (
                                                            <Badge bg="success" className="text-uppercase x-small px-2 py-1 shadow-sm d-inline-flex align-items-center gap-1 border border-success border-opacity-25" style={{letterSpacing: '0.5px'}}>
                                                                <span className="status-pulse"></span> ACTIVE DOMAIN
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge bg="light" text="dark" className="border px-2 py-1 text-uppercase x-small d-flex align-items-center gap-1 shadow-xs">
                                                <Shield size={10} className="text-muted" /> {u.login_type || 'PASSWORD'}
                                            </Badge>
                                        </div>

                                        {/* 2. Contact Information & Auth */}
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center gap-2 text-muted x-small text-uppercase fw-bold mb-2">
                                                <Mail size={12} /> Contact Information
                                            </div>
                                            <div className="p-3 bg-light rounded text-dark fs-6 fw-medium border border-white">
                                                {u.email}
                                            </div>
                                        </div>

                                        {/* 3. Engagement & Metrics */}
                                        <div className="row g-2 mb-4">
                                            <div className="col-6 text-center cursor-pointer" onClick={() => setSelectedUser(u)}>
                                                <div className="p-3 bg-white border border-light shadow-sm rounded">
                                                    <div className="x-small text-muted text-uppercase fw-bold">Messages</div>
                                                    <div className="h4 mb-0 fw-bold text-primary">{u.messages?.length || 0}</div>
                                                </div>
                                            </div>
                                            <div className="col-6 text-center cursor-pointer" onClick={() => setSelectedUser(u)}>
                                                <div className="p-3 bg-white border border-light shadow-sm rounded">
                                                    <div className="x-small text-muted text-uppercase fw-bold">Requests</div>
                                                    <div className="h4 mb-0 fw-bold text-success">{u.requests?.length || 0}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4. Verification Matrix & Timeline */}
                                        <div className="pt-4 border-top">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div className="d-flex flex-column gap-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        {u.email_verified_at ? <CheckCircle size={14} className="text-success" /> : <XCircle size={14} className="text-danger" />}
                                                        <span className={`small ${u.email_verified_at ? 'text-success' : 'text-danger'} fw-semibold`}>
                                                            {u.email_verified_at ? 'Verified Identity' : 'Unauthenticated'}
                                                        </span>
                                                    </div>
                                                    {!u.email_verified_at && (
                                                        <Button variant="link" className="p-0 text-start x-small fw-bold text-primary text-decoration-none" onClick={() => handleVerify(u.id)}>
                                                            Verify &rarr;
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="text-end">
                                                    <div className="x-small text-muted text-uppercase fw-bold">Registered On</div>
                                                    <div className="small fw-semibold">{new Date(u.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>

                                            {/* 5. Administrative Actions */}
                                            <div className="d-flex gap-2">
                                                <Button variant="outline-primary" className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 shadow-none" onClick={() => setSelectedUser(u)}>
                                                    <Info size={14} /> Full Context
                                                </Button>
                                                <Button variant={u.is_banned ? "success" : "danger"} className="d-flex align-items-center justify-content-center gap-2 px-3 shadow-none" onClick={() => handleToggleBan(u)}>
                                                    {u.is_banned ? <UserCheck size={16} /> : <UserX size={16} />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            )) : (
                                <Col xs={12}>
                                    <div className="text-center py-5 bg-white shadow-sm rounded border border-dashed">
                                        <div className="mb-3 opacity-25"><Shield size={64} /></div>
                                        <h5 className="text-muted">No Identity Matches Found</h5>
                                        <p className="text-muted small">Adjust your filters or refresh the directory scanning.</p>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    )}
                </Card.Body>
            </Card>

            {/* SIDE BOX: User Detailed Information (Side box proer show it) */}
            <Offcanvas show={!!selectedUser} onHide={() => setSelectedUser(null)} placement="end" style={{width: '500px'}}>
                <Offcanvas.Header closeButton className="border-bottom bg-light">
                    <Offcanvas.Title className="fw-bold">User Identity Context</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0 custom-scrollbar">
                    {selectedUser && (
                        <div>
                            {/* Profile Snapshot - SOLID BLUE HEADER */}
                            <div className="p-4 bg-primary border-bottom shadow-sm">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="avatar avatar-xxl rounded-circle bg-white border border-4 border-white border-opacity-25 shadow-sm d-flex align-items-center justify-content-center fw-bold fs-1 text-primary overflow-hidden" style={{width: 80, height: 80}}>
                                        {selectedUser.username?.[0]?.toUpperCase() || selectedUser.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="text-white">
                                        <h4 className="mb-1 fw-bold">{selectedUser.username || selectedUser.name}</h4>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <Badge bg={selectedUser.is_banned ? 'danger' : 'success'} className="x-small px-2 py-1 shadow-sm border border-white border-opacity-25">
                                                {selectedUser.is_banned ? 'Banned Entry' : 'Active Account'}
                                            </Badge>
                                            <Badge bg="white" text="primary" className="border-0 x-small text-uppercase fw-bold shadow-sm">{selectedUser.login_type || 'Manual'}</Badge>
                                        </div>
                                        <div className="text-white text-opacity-75 small d-flex align-items-center gap-2">
                                            <Mail size={12} /> {selectedUser.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-top border-white border-opacity-10 d-flex gap-4">
                                    <div className="flex-grow-1">
                                        <div className="x-small text-white text-opacity-75 text-uppercase fw-bold mb-1">Registration Date</div>
                                        <div className="fw-bold small text-white">{new Date(selectedUser.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="x-small text-white text-opacity-75 text-uppercase fw-bold mb-1">Verification Status</div>
                                        <div className={`fw-bold small ${selectedUser.email_verified_at ? 'text-white' : 'text-danger'}`}>
                                            {selectedUser.email_verified_at ? 'Identity Fully Verified' : 'Account Not Validated'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Correspondence */}
                            <div className="p-4">
                                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <MessageSquare size={18} className="text-primary" /> Support Message History
                                </h6>
                                {selectedUser.messages && selectedUser.messages.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {selectedUser.messages.map((msg) => (
                                            <Card key={msg.id} className="border-0 shadow-sm bg-light bg-opacity-50">
                                                <Card.Body className="p-3">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="fw-bold mb-0 small">{msg.subject || 'Administrative Inquiry'}</h6>
                                                        <Badge bg="info" className="x-small">{msg.status || 'UNREAD'}</Badge>
                                                    </div>
                                                    <p className="text-muted x-small mb-3">&quot;{msg.message}&quot;</p>
                                                    {msg.admin_reply && (
                                                        <div className="bg-white p-2 border-start border-4 border-primary rounded x-small mb-2">
                                                            <strong className="text-primary d-block mb-1">System Reply:</strong>
                                                            {msg.admin_reply}
                                                        </div>
                                                    )}
                                                    <div className="text-end x-small text-muted">{new Date(msg.created_at).toLocaleDateString()}</div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-light rounded-3 border border-dashed text-muted x-small">No recorded message history for this user.</div>
                                )}

                                <hr className="my-5" />

                                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <ExternalLink size={18} className="text-success" /> Active Service Logs
                                </h6>
                                {selectedUser.requests && selectedUser.requests.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {selectedUser.requests.map((req) => (
                                            <Card key={req.id} className="border-0 shadow-sm bg-light bg-opacity-50 border-start border-4 border-success">
                                                <Card.Body className="p-3">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="fw-bold mb-0 small">{req.title}</h6>
                                                        <Badge bg={req.status === 'resolved' ? 'success' : 'warning'} className="x-small">{req.status}</Badge>
                                                    </div>
                                                    <p className="text-muted x-small mb-3">{req.description?.substring(0, 80)}...</p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <Button variant="success" size="sm" className="x-small px-3" onClick={() => setActiveChat({ id: req.id, title: req.title })}>
                                                           Continue Dialogue
                                                        </Button>
                                                        <span className="x-small text-muted">{new Date(req.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-light rounded-3 border border-dashed text-muted x-small">This user has no active service requests.</div>
                                )}

                                <div className="mt-5 d-grid gap-2">
                                    <Button variant={selectedUser.is_banned ? "success" : "danger"} className="fw-bold shadow-sm py-2" onClick={() => handleToggleBan(selectedUser)}>
                                        {selectedUser.is_banned ? 'Authorize & Unban User' : 'Restrict & Terminate Access'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Offcanvas.Body>
            </Offcanvas>

            {/* Add User Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton className="border-bottom bg-light">
                    <Modal.Title className="fw-bold">Provision Domain Account</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddUser}>
                    <Modal.Body className="p-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-semibold">Global Identity Name</Form.Label>
                            <Form.Control type="text" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} required placeholder="e.g. johndoe" className="shadow-none py-2" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-semibold">Authorized Email Protocol</Form.Label>
                            <Form.Control type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required placeholder="user@domain.com" className="shadow-none py-2" />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-semibold">Security Access Key (Password)</Form.Label>
                            <Form.Control type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required minLength={6} placeholder="Min 6 characters" className="shadow-none py-2" />
                        </Form.Group>
                        <div className="p-3 bg-light rounded text-muted x-small">
                            <Info size={12} className="me-2 text-primary" /> Accounts created here are automatically verified and granted instant domain access without email confirmation.
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-top bg-light">
                        <Button variant="secondary" onClick={() => setShowAddModal(false)} className="px-4">Abort</Button>
                        <Button variant="primary" type="submit" className="px-4">Provision Identity</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {activeChat && (
                <AdminChatWindow requestId={activeChat.id} title={activeChat.title} onClose={() => setActiveChat(null)} />
            )}

            <style jsx global>{`
                .x-small { font-size: 11px; }
                .badge-soft-success { background-color: rgba(25, 135, 84, 0.1); color: #198754; border: 1px solid rgba(25, 135, 84, 0.2); }
                .badge-soft-danger { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; border: 1px solid rgba(220, 53, 69, 0.2); }
                .cursor-pointer { cursor: pointer; }
                .avatar-md { font-size: 0.9rem; }
                .avatar-xxl { font-size: 2rem; }
                .bg-light-primary { background-color: rgba(13, 110, 253, 0.05) !important; }
                .bg-light-danger { background-color: rgba(220, 53, 69, 0.05) !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                
                .status-pulse {
                    width: 6px;
                    height: 6px;
                    background-color: #fff;
                    border-radius: 50%;
                    display: inline-block;
                    box-shadow: 0 0 0 rgba(255, 255, 255, 0.7);
                    animation: status-pulse-anim 2s infinite;
                }
                @keyframes status-pulse-anim {
                  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
                  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }
            `}</style>
        </Container>
    );
};

export default RegisteredUsers;

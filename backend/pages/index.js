import { Fragment, useState, useEffect } from "react";
import Link from 'next/link';
import { Container, Col, Row, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { fetchApi } from '../utils/api';
import { Users, MessageSquare, Image, CheckCircle, Shield } from 'react-feather';

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [media, setMedia] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                // Fetch contact submissions
                const msgRes = await fetchApi('/admin/contact/submissions');
                if (msgRes?.success) setMessages(msgRes.data || []);
                
                // Fetch media stats
                const mediaRes = await fetchApi('/admin/dms/media');
                if (mediaRes?.success) setMedia(mediaRes.data || []);

                // Fetch chats overview
                const chatRes = await fetchApi('/admin/chat/overview');
                if (chatRes?.success) setChats(chatRes.data || []);

                // Try fetching admin list
                const adminRes = await fetchApi('/admin/list');
                if (adminRes?.success) {
                    setAdmins(adminRes.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const recentMessages = messages.slice(0, 5); // top 5
    const pendingMessages = messages.filter(m => m.status === 'pending').length;

    const statsData = [
        {
            id: 1,
            title: "Total Messages",
            value: messages.length,
            icon: <MessageSquare size={24} className="text-primary" />,
            statInfo: `${pendingMessages} pending replies`
        },
        {
            id: 2,
            title: "Registered Staff",
            value: admins.length || '---',
            icon: <Users size={24} className="text-success" />,
            statInfo: 'Admin accounts (Superadmin)'
        },
        {
            id: 3,
            title: "Media Assets",
            value: media.length,
            icon: <Image size={24} className="text-info" />,
            statInfo: 'Images hosted on cloud'
        },
        {
            id: 4,
            title: "Client Chats",
            value: chats.length,
            icon: <MessageSquare size={24} className="text-secondary" />,
            statInfo: `${chats.reduce((acc, c) => acc + c.unread_count, 0)} unread messages`
        }
    ];

    if (loading) {
        return (
            <Container fluid className="p-6 text-center mt-10">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading Dashboard...</p>
            </Container>
        );
    }

    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
                            <div>
                                <h3 className="mb-0 text-white">Dashboard Overview</h3>
                                <p className="text-white-50 small mb-0">Welcome back. Here's a summary of recent activity.</p>
                            </div>
                        </div>
                    </Col>
                    
                    {statsData.map((item, index) => (
                        <Col xl={3} lg={6} md={12} xs={12} className="mb-4" key={index}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h6 className="text-uppercase fw-bold text-muted mb-2">{item.title}</h6>
                                            <h2 className="mb-0 display-5 fw-bold">{item.value}</h2>
                                        </div>
                                        <div className="icon-shape icon-md bg-light-primary text-primary rounded-circle p-3 bg-opacity-10">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <p className="mb-0 text-muted small">{item.statInfo}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row className="mb-6">
                    <Col xl={12} className="mb-6">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">Latest Client Conversations</h5>
                                <Badge bg="info">{chats.filter(c => c.unread_count > 0).length} New Message Indicators</Badge>
                            </Card.Header>
                            <Table responsive className="text-nowrap mb-0 table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="border-bottom-0">Client</th>
                                        <th className="border-bottom-0">Project / Latest Activity</th>
                                        <th className="border-bottom-0 text-center">Unread</th>
                                        <th className="border-bottom-0 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chats.length > 0 ? chats.slice(0, 5).map(chat => (
                                        <tr key={chat.id}>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-light-info text-info rounded-circle p-2">
                                                        <Users size={18} />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{chat.username}</h6>
                                                        <small className="text-muted">{chat.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                                    <span className="fw-semibold small d-block mb-1">{chat.request_title}</span>
                                                    <span className="text-muted small">"{chat.latest_message.message}"</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                {chat.unread_count > 0 ? (
                                                    <Badge bg="danger" pill>{chat.unread_count}</Badge>
                                                ) : (
                                                    <Badge bg="light" text="dark" pill className="border">0</Badge>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                <Link href="/admin/active-chats" className="btn btn-outline-primary btn-sm">
                                                    Open Chat
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="text-center py-5 text-muted">No active project conversations.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                            <Card.Footer className="bg-white text-center py-3 border-top-0">
                                <Link href="/admin/active-chats" className="text-primary small fw-bold text-decoration-none">
                                    View All Client Messaging &rarr;
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
                
                <Row className="mb-6">
                    <Col xl={8} lg={12} className="mb-6 mb-xl-0">
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">Latest Contact Submissions</h5>
                                <Badge bg="primary">{pendingMessages} Pending</Badge>
                            </Card.Header>
                            <Table responsive className="text-nowrap mb-0 table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="border-bottom-0">Sender Details</th>
                                        <th className="border-bottom-0">Subject</th>
                                        <th className="border-bottom-0">Status</th>
                                        <th className="border-bottom-0">Received At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentMessages.length > 0 ? recentMessages.map(msg => (
                                        <tr key={msg.id}>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{msg.name}</h6>
                                                        <small className="text-muted">{msg.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                                                    {msg.subject || 'No Subject'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg={msg.status === 'replied' ? 'success' : (msg.status === 'archived' ? 'secondary' : 'warning')}>
                                                    {msg.status?.toUpperCase() || 'PENDING'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-muted small">
                                                {new Date(msg.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="text-center py-5 text-muted">No messages received yet.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                            <Card.Footer className="bg-white text-center py-3 border-top-0">
                                <Link href="/cms/contact" className="text-primary small fw-bold text-decoration-none">
                                    Manage All Messages &rarr;
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={4} lg={12}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-white py-4">
                                <h5 className="mb-0 fw-bold">Recent Admin Accounts</h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <ul className="list-group list-group-flush">
                                    {admins.length > 0 ? admins.slice(0, 5).map(adm => (
                                        <li className="list-group-item p-4" key={adm.id}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-light rounded-circle p-2 text-secondary">
                                                        <Users size={16} />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{adm.name}</h6>
                                                        <small className="text-muted">{adm.email}</small>
                                                    </div>
                                                </div>
                                                <Badge bg={adm.role === 'superadmin' ? 'danger' : 'info'} className="text-uppercase mx-1">
                                                    {adm.role}
                                                </Badge>
                                            </div>
                                        </li>
                                    )) : (
                                        <li className="list-group-item p-5 text-center text-muted">
                                            <Shield size={24} className="mb-2 opacity-50" /><br/>
                                            Admin list requires <strong className="text-dark">Superadmin</strong> privileges.
                                        </li>
                                    )}
                                </ul>
                            </Card.Body>
                            <Card.Footer className="bg-white text-center py-3 border-top-0">
                                <Link href="#" className="text-primary small fw-bold text-decoration-none">
                                    Account Settings
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}

export default Home;

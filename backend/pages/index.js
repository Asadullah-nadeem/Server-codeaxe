import { Fragment, useState, useEffect } from "react";
import Link from 'next/link';
import { Container, Col, Row, Card, Table, Badge, Button } from 'react-bootstrap';
import { fetchApi } from '../utils/api';
import { Users, MessageSquare, Image as ImageIcon, CheckCircle, Shield } from 'react-feather';
import LoadingSpinner from '../components/LoadingSpinner';

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
            icon: <ImageIcon size={24} className="text-info" />,
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

    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n21 px-6">
                <Row className="mb-6">
                    <Col lg={12} md={12} xs={12}>
                        <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
                            <div>
                                <h3 className="mb-0 text-white fw-bold">Dashboard Intelligence</h3>
                                <p className="text-white-50 small mb-0">System status and communication summary.</p>
                            </div>
                        </div>
                    </Col>
                    
                    {loading ? (
                        <Col lg={12}>
                            <LoadingSpinner text="Synchronizing platform insights..." />
                        </Col>
                    ) : (
                        <>
                            {statsData.map((item, index) => (
                                <Col xl={3} lg={6} md={12} xs={12} className="mb-4" key={index}>
                                    <Card className="h-100 border-0 shadow-sm">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <h6 className="text-muted text-uppercase fw-bold mb-1 small">{item.title}</h6>
                                                    <h3 className="mb-0 fw-bold">{item.value}</h3>
                                                </div>
                                                <div className="bg-light-primary rounded-circle p-3">
                                                    {item.icon}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 text-muted x-small">
                                                <div className="bg-success rounded-circle" style={{width: 6, height: 6}}></div>
                                                <span>{item.statInfo}</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </>
                    )}
                </Row>
                
                {!loading && (
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
                                    <Link href="/admin/superadmin" className="text-primary small fw-bold text-decoration-none">
                                        Account Settings
                                    </Link>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
            <style jsx>{`
                .x-small { font-size: 11px; }
            `}</style>
        </Fragment>
    );
};

export default Home;

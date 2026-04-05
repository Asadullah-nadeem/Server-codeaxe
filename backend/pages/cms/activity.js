import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Container, Badge, InputGroup, Form } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, ClockHistory, Bell, Trash } from 'react-bootstrap-icons';

const ActivityCMS = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllActivities = async () => {
        try {
            setLoading(true);
            const [usersRes, chatsRes, contactRes] = await Promise.allSettled([
                fetchApi('/admin/users/registered'),
                fetchApi('/admin/chat/overview'),
                fetchApi('/admin/contact/submissions')
            ]);

            let mergedList = [];

            if (usersRes.status === 'fulfilled' && usersRes.value?.success) {
                usersRes.value.data.forEach(u => {
                    mergedList.push({
                        id: `usr_${u.id}`, type: 'USER_REGISTRATION', title: 'New Registration',
                        message: `${u.first_name || ''} ${u.last_name || ''} (${u.email}) joined.`,
                        date: u.created_at, link: '/cms/users',
                        variant: 'primary', icon: 'fe-user'
                    });
                });
            }

            if (chatsRes.status === 'fulfilled' && chatsRes.value?.success) {
                chatsRes.value.data.forEach(c => {
                    mergedList.push({
                        id: `chat_${c.request_id}`, type: 'LIVE_CHAT', title: 'Client Chat',
                        message: c.message ? `"${c.message}"` : 'Client started a live chat.',
                        date: c.created_at || c.updated_at, link: '/cms/chats',
                        variant: 'success', icon: 'fe-message-square'
                    });
                });
            }

            if (contactRes.status === 'fulfilled' && contactRes.value?.success) {
                contactRes.value.data.forEach(s => {
                    mergedList.push({
                        id: `sub_${s.id}`, type: 'FORM_SUBMISSION', title: 'Contact Inquiry',
                        message: `${s.name} (${s.company}) sent: "${s.message?.substring(0, 50)}..."`,
                        date: s.submitted_at, link: '/cms/contact',
                        variant: 'info', icon: 'fe-mail'
                    });
                });
            }

            mergedList.sort((a, b) => new Date(b.date) - new Date(a.date));
            setActivities(mergedList);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllActivities(); }, []);

    const filteredActivities = activities.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="px-6 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">System Activity Log</h2>
                    <p className="text-muted small mb-0">Unified history of registrations, chats, and form submissions.</p>
                </div>
                <Button variant="outline-primary" size="sm" onClick={fetchAllActivities}>
                    <ClockHistory size={14} className="me-2"/> Refresh Log
                </Button>
            </div>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom py-3">
                    <Row className="align-items-center">
                        <Col>
                            <InputGroup size="sm" style={{maxWidth: '300px'}}>
                                <InputGroup.Text className="bg-light border-end-0"><Search size={12}/></InputGroup.Text>
                                <Form.Control 
                                    className="bg-light border-start-0"
                                    placeholder="Filter by type, name or message..." 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col xs="auto">
                             <Badge bg="light" text="dark" className="border px-3 py-2 fw-bold">
                                Total Events: {filteredActivities.length}
                             </Badge>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="py-5"><LoadingSpinner text="Aggregating activity streams..."/></div>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4">Time</th>
                                    <th>Event Type</th>
                                    <th>Summary</th>
                                    <th className="text-end px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActivities.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-5 text-muted">No activities found matching your criteria.</td></tr>
                                ) : (
                                    filteredActivities.map(item => (
                                        <tr key={item.id} className="align-middle">
                                            <td className="px-4 text-nowrap">
                                                <small className="fw-bold text-dark">{new Date(item.date).toLocaleDateString()}</small><br/>
                                                <small className="text-muted">{new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                            </td>
                                            <td>
                                                <Badge bg={`light-${item.variant}`} className={`text-${item.variant} border-0 px-2 py-1`}>
                                                    {item.type}
                                                </Badge>
                                            </td>
                                            <td style={{maxWidth: '400px'}}>
                                                <div className="fw-bold text-dark mb-0">{item.title}</div>
                                                <div className="text-muted small text-truncate">{item.message}</div>
                                            </td>
                                            <td className="text-end px-4">
                                                <Button variant="light" size="sm" className="fw-bold text-primary" href={item.link}>
                                                    Manage &rarr;
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ActivityCMS;

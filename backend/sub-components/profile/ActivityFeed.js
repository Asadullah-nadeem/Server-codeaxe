import React, { useState, useEffect } from 'react';
import { ListGroup, Card, Spinner } from 'react-bootstrap';
import { fetchApi } from 'utils/api';

const ActivityFeed = (props) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystemEvents = async () => {
            try {
                const [usersRes, chatsRes, contactRes] = await Promise.allSettled([
                    fetchApi('/admin/users/registered'),
                    fetchApi('/admin/chat/overview'),
                    fetchApi('/admin/contact/submissions')
                ]);

                let mergedList = [];

                if (usersRes.status === 'fulfilled' && usersRes.value?.success) {
                    usersRes.value.data.forEach(u => {
                        mergedList.push({
                            id: `usr_${u.id}`, title: 'Staff Registration',
                            message: `${u.first_name || 'Admin'} ${u.last_name || ''} joined.`,
                            date: new Date(u.created_at), variant: 'primary'
                        });
                    });
                }

                if (chatsRes.status === 'fulfilled' && chatsRes.value?.success) {
                    chatsRes.value.data.forEach(c => {
                        mergedList.push({
                            id: `chat_${c.request_id}`, title: 'Chat Inquiry',
                            message: c.message || 'Started a new support session.',
                            date: new Date(c.created_at || c.updated_at), variant: 'success'
                        });
                    });
                }

                if (contactRes.status === 'fulfilled' && contactRes.value?.success) {
                    contactRes.value.data.forEach(s => {
                        mergedList.push({
                            id: `sub_${s.id}`, title: 'Contact Submission',
                            message: `${s.name} sent: "${s.message?.substring(0, 30)}..."`,
                            date: new Date(s.submitted_at), variant: 'info'
                        });
                    });
                }

                mergedList.sort((a, b) => b.date - a.date);
                setActivities(mergedList.slice(0, 10)); // Top 10 for feed
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSystemEvents();
    }, []);

    const timeAgo = (date) => {
        const diff = new Date() - date;
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-bottom-0 d-flex justify-content-between align-items-center">
                <h4 className="mb-0">{props.title || 'Recent Activity'}</h4>
            </Card.Header>
            <Card.Body className="p-0">
                {loading ? (
                    <div className="text-center py-5"><Spinner animation="border" variant="primary" size="sm" /></div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-5 text-muted small">No recent activity detected.</div>
                ) : (
                    <ListGroup variant="flush">
                        {activities.map((item) => (
                            <ListGroup.Item key={item.id} className="py-4 border-bottom-0">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className={`bg-light-${item.variant} text-${item.variant} rounded-circle p-2 me-3 d-flex align-items-center justify-content-center`} style={{width:'32px', height:'32px'}}>
                                            <i className="fe fe-activity fs-6"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-bold">{item.title}</h5>
                                            <p className="mb-0 text-muted small">{item.message}</p>
                                        </div>
                                    </div>
                                    <small className="text-muted text-nowrap ms-2">{timeAgo(item.date)}</small>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
};

export default ActivityFeed;

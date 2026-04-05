import { useState, useEffect } from 'react';
import { Col, Row, Card, Spinner } from 'react-bootstrap';
import { fetchApi } from 'utils/api';

const AboutMe = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetchApi('/admin/profile');
                if (res.success) setProfile(res.data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    if (loading) {
        return (
            <Card className="border-0 shadow-sm mb-6">
                <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </Card.Body>
            </Card>
        );
    }

    const adminEmail = profile?.email || 'admin@codeaxe.com';
    const adminRole = profile?.role || 'Administrator';

    return (
        <Card className="border-0 shadow-sm mb-6">
            <Card.Body>
                <Card.Title as="h4" className="mb-4 fw-bold">About Me</Card.Title>
                <div className="mb-4">
                    <span className="text-uppercase fw-bold text-muted fs-6 ls-1">Profile Info</span>
                    <p className="mt-2 text-dark fs-5">You are currently logged in as <span className="fw-bold text-primary">{adminRole}</span>. Your account has full access to the management dashboard.</p>
                </div>
                <Row className="g-4">
                    <Col xs={12} md={6}>
                        <h6 className="text-uppercase fw-bold text-muted fs-6 ls-1">Role</h6>
                        <p className="mb-0 text-dark fw-medium text-uppercase">{adminRole}</p>
                    </Col>
                    <Col xs={12} md={6}>
                        <h6 className="text-uppercase fw-bold text-muted fs-6 ls-1">Email</h6>
                        <p className="mb-0 text-dark fw-medium">{adminEmail}</p>
                    </Col>
                    <Col xs={12}>
                        <h6 className="text-uppercase fw-bold text-muted fs-6 ls-1">Username</h6>
                        <p className="mb-0 text-primary fw-bold font-monospace">@{profile?.username || 'superadmin'}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default AboutMe;
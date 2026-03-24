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
            <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
                <Card><Card.Body className="text-center py-5"><Spinner animation="border" variant="primary" /></Card.Body></Card>
            </Col>
        );
    }

    const adminEmail = profile?.email || 'admin@codeaxe.com';
    const adminRole = profile?.role || 'Administrator';

    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            <Card>
                <Card.Body>
                    <Card.Title as="h4">About Me</Card.Title>
                    <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Profile Info</span>
                    <p className="mt-2 mb-6">You are currently logged in as {adminRole}. Your account has full access to the management dashboard.
                    </p>
                    <Row>
                        <Col xs={12} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Role</h6>
                            <p className="mb-0 text-uppercase">{adminRole}</p>
                        </Col>
                        <Col xs={12}>
                            <h6 className="text-uppercase fs-5 ls-2">Email </h6>
                            <p className="mb-0">{adminEmail}</p>
                        </Col>
                        <Col xs={12} className="mt-5">
                            <h6 className="text-uppercase fs-5 ls-2">Username</h6>
                            <p className="mb-0 font-monospace">@{profile?.username || 'admin'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default AboutMe;
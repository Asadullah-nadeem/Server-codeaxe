import { Col, Row, Card } from 'react-bootstrap';
import useMounted from 'hooks/useMounted';

const AboutMe = () => {
    const hasMounted = useMounted();
    const adminEmail = hasMounted && typeof window !== 'undefined' ? localStorage.getItem('admin_email') || 'admin@codeaxe.com' : 'admin@codeaxe.com';
    const adminRole = hasMounted && typeof window !== 'undefined' ? localStorage.getItem('admin_role') || 'Administrator' : 'Administrator';

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
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default AboutMe;
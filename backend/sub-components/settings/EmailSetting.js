// import node module libraries
import { Col, Row, Form, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import { fetchApi } from 'utils/api';

const EmailSetting = () => {
  const [email, setEmail] = useState('');
  const [passwordData, setPasswordData] = useState({
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await fetchApi('/admin/profile/update', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      if (data.success) {
        setMessage({ type: 'success', text: 'Email updated successfully!' });
        setEmail('');
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      setMessage({ type: 'danger', text: 'Passwords do not match!' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await fetchApi('/admin/profile/update', {
        method: 'POST',
        body: JSON.stringify(passwordData)
      });

      if (data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ password: '', password_confirmation: '' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Email & Password</h4>
          <p className="mb-0 fs-5 text-muted">Secure your account </p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card id="edit">
          <Card.Body>
            {message.text && (
              <Alert variant={message.type} className="mb-4">
                {message.text}
              </Alert>
            )}

            <div className="mb-6">
              <h4 className="mb-1">Email</h4>
            </div>
            <Form onSubmit={handleEmailSubmit}>
              <Row className="mb-3">
                <Form.Label className="col-sm-4" htmlFor="newEmailAddress">New email</Form.Label>
                <Col md={8} xs={12}>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email address" 
                    id="newEmailAddress" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </Col>
                <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Update Email"}
                  </Button>
                </Col>
              </Row>
            </Form>

            <div className="mb-6 mt-6">
              <h4 className="mb-1">Change your password</h4>
            </div>
            <Form onSubmit={handlePasswordSubmit}>
              <Row className="mb-3">
                <Form.Label className="col-sm-4" htmlFor="newPassword">New password</Form.Label>
                <Col md={8} xs={12}>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter New password" 
                    id="newPassword" 
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    required 
                  />
                </Col>
              </Row>

              <Row className="align-items-center">
                <Form.Label className="col-sm-4" htmlFor="confirmNewpassword">Confirm new password</Form.Label>
                <Col md={8} xs={12}>
                  <Form.Control 
                    type="password" 
                    placeholder="Confirm new password" 
                    id="confirmNewpassword" 
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                    required 
                  />
                </Col>
                <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                  <h6 className="mb-1">Password requirements:</h6>
                  <p className="small text-muted">Minimum 8 characters long.</p>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Update Password"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EmailSetting;
// import node module libraries
import { Col, Row, Form, Card, Button, Image, Alert, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { fetchApi } from "utils/api";

const GeneralSetting = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchApi("/admin/profile");
        if (data.success) {
          setFormData({
            name: data.data.name || "",
            username: data.data.username || "",
          });
        }
      } catch (err) {
        setMessage({ type: "danger", text: err.message });
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = await fetchApi("/admin/profile/update", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        localStorage.setItem("admin_name", data.data.name);
        localStorage.setItem("admin_username", data.data.username);
      }
    } catch (err) {
      setMessage({ type: "danger", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">General Setting</h4>
          <p className="mb-0 fs-5 text-muted">Profile configuration settings </p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card>
          <Card.Body>
            <div className=" mb-6">
              <h4 className="mb-1">General Settings</h4>
            </div>
            
            {message.text && (
              <Alert variant={message.type} className="mb-4">
                {message.text}
              </Alert>
            )}

            <div className="mb-6">
              <h4 className="mb-1">Basic information</h4>
            </div>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <label htmlFor="name" className="col-sm-4 col-form-label form-label">Full name</label>
                <div className="col-sm-8 mb-3 mb-lg-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </Row>
              <Row className="mb-3">
                <label htmlFor="username" className="col-sm-4 col-form-label form-label">Username</label>
                <div className="col-md-8 col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter username"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              </Row>

              <Row className="align-items-center">
                <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
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

export default GeneralSetting;

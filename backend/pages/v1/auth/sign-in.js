// import node module libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Card, Form, Button, Image, Alert, Spinner } from "react-bootstrap";
import Link from "next/link";

// import authlayout to override default layout
import AuthLayout from "layouts/AuthLayout";

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ssoProcessing, setSsoProcessing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Artificial 1.5s splash screen as requested
    const timer = setTimeout(() => setPageLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const { token } = router.query;
    if (token) {
        handleSsoLogin(token);
    }
  }, [router.query]);

  const handleSsoLogin = async (token) => {
    setSsoProcessing(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/admin/auth/check?admin_token=${token}`, {
            headers: { 'Accept': 'application/json', 'X-App-Key': process.env.NEXT_PUBLIC_APP_KEY || '' }
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem("admin_token", data.data.token);
            localStorage.setItem("admin_role", data.data.role);
            localStorage.setItem("admin_name", data.data.name);
            localStorage.setItem("admin_email", data.data.email);
            localStorage.setItem("admin_username", data.data.username);
            localStorage.setItem("admin_login_type", data.data.login_type || 'password');
            router.push("/");
        }
    } catch (err) { console.error("SSO Failed", err); }
    finally { setSsoProcessing(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-App-Key": process.env.NEXT_PUBLIC_APP_KEY || '',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save token and user details
        localStorage.setItem("admin_token", data.data.token);
        localStorage.setItem("admin_role", data.data.role);
        localStorage.setItem("admin_name", data.data.name);
        localStorage.setItem("admin_email", data.data.email);
        localStorage.setItem("admin_username", data.data.username);
        localStorage.setItem("admin_login_type", data.data.login_type || 'password');

        // Redirect to dashboard
        router.push("/");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while trying to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-white shadow-soft">
        <Spinner animation="border" variant="primary" style={{ width: '3.5rem', height: '3.5rem', borderWidth: '0.25rem' }} role="status" className="mb-4" />
        <h4 className="fw-bold text-primary mb-1">Code Axe Admin</h4>
        <p className="text-muted small">Initializing Secure Management Panel...</p>
      </div>
    );
  }

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100 bg-light bg-opacity-50">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md border-0">
          {/* Card body */}
          <Card.Body className="p-6">
            {ssoProcessing && (
              <div className="text-center py-5">
                <Spinner animation="grow" variant="primary" size="sm" className="me-2" />
                <p className="mb-0 fw-bold d-inline-block">Detecting Secure Session...</p>
              </div>
            )}
            <div className={ssoProcessing ? "d-none" : "mb-4"}>
              <Link href="/">
                <h3 className="fw-bold text-primary mb-1">Code Axe</h3>
              </Link>
              <p className="mb-6 text-muted">Please enter your admin credentials.</p>
            </div>

            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

            {/* Form */}
            <Form onSubmit={handleLogin}>
              {/* Username */}
              <Form.Group className="mb-3" controlId="username">
                <Form.Label className="small fw-semibold text-muted">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-light border-0 py-2"
                />
              </Form.Group>
               {/* Password */}
               <Form.Group className="mb-3" controlId="password">
                 <Form.Label className="small fw-semibold text-muted">Password</Form.Label>
                 <Form.Control
                   type="password"
                   name="password"
                   placeholder="**************"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="bg-light border-0 py-2"
                 />
               </Form.Group>

               <div className="d-grid mt-4">
                 <Button variant="primary" type="submit" disabled={loading} className="py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                   {loading ? (
                     <>
                       <Spinner animation="border" size="sm" variant="light" />
                       <span>Authenticating...</span>
                     </>
                   ) : "Sign In"}
                 </Button>
               </div>
             </Form>
           </Card.Body>
         </Card>
       </Col>
     </Row>
   );
};

SignIn.Layout = AuthLayout;

export default SignIn;


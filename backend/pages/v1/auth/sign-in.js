// import node module libraries
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useRef } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner, InputGroup } from "react-bootstrap";
import { Eye, EyeOff, Shield, Lock } from "react-feather";

// import authlayout to override default layout
import AuthLayout from "layouts/AuthLayout";

// ── Security helpers ──────────────────────────────────────────────────────────

/** Basic session token checks (expiry, structure) */
const isTokenValid = (token) => {
  if (!token || typeof token !== "string") return false;
  // Tokens are usually 3-part JWTs or opaque strings; just validate non-empty and min-length
  if (token.length < 10) return false;
  return true;
};

/** Sanitize input to prevent XSS via payload */
const sanitize = (str) =>
  typeof str === "string" ? str.replace(/[<>"'`]/g, "") : "";

// ── Rate-limit state (client-side, resets on refresh – server should enforce too) ──
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000; // 1 minute

// ─────────────────────────────────────────────────────────────────────────────

const SignIn = () => {
  const router = useRouter();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // ── UX state ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [ssoProcessing, setSsoProcessing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const didInit = useRef(false); // guard: run splash check only once

  // ── Rate limiting ────────────────────────────────────────────────────────────
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [lockCountdown, setLockCountdown] = useState(0);
  const countdownRef = useRef(null);

  // ── Redirect if already logged in (runs ONCE on mount only) ────────────────
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("admin_token");
        if (isTokenValid(token)) {
          // Always clear the splash BEFORE navigating
          setPageLoading(false);
          router.replace("/");
          return;
        }
      }
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — run only on mount

  // ── Countdown timer for lockout ───────────────────────────────────────────────
  useEffect(() => {
    if (lockedUntil) {
      countdownRef.current = setInterval(() => {
        const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setLockedUntil(null);
          setAttempts(0);
          setLockCountdown(0);
          clearInterval(countdownRef.current);
        } else {
          setLockCountdown(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(countdownRef.current);
  }, [lockedUntil]);

  // ── SSO token handling ────────────────────────────────────────────────────────
  const handleSsoLogin = useCallback(
    async (token) => {
      setSsoProcessing(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/check?admin_token=${encodeURIComponent(token)}`,
          {
            headers: {
              Accept: "application/json",
              "X-API-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
            },
          }
        );
        if (!response.ok) throw new Error("SSO check failed");
        const data = await response.json();
        if (data.success) {
          _storeSession(data.data);
          router.replace("/");
        } else {
          setError("SSO session is invalid or expired. Please log in manually.");
          setSsoProcessing(false);
        }
      } catch (err) {
        console.error("SSO Failed", err);
        setError("SSO authentication failed. Please log in manually.");
        setSsoProcessing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!router.isReady) return;
    const ssoToken = router.query.token;
    if (ssoToken && typeof ssoToken === "string") {
      handleSsoLogin(ssoToken);
    }
  }, [router.isReady, router.query.token, handleSsoLogin]);

  // ── Store session securely ─────────────────────────────────────────────────────
  const _storeSession = (data) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_role", data.role);
    localStorage.setItem("admin_name", data.name);
    localStorage.setItem("admin_email", data.email);
    localStorage.setItem("admin_username", data.username);
    localStorage.setItem("admin_login_type", data.login_type || "password");
    // store session timestamp for expiry detection on client
    localStorage.setItem("admin_session_at", Date.now().toString());
  };

  // ── Main login handler ────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side lockout check
    if (lockedUntil && Date.now() < lockedUntil) {
      setError(`Too many failed attempts. Please wait ${lockCountdown}s before trying again.`);
      return;
    }

    const cleanUsername = sanitize(username.trim());
    const cleanPassword = password; // don't sanitize password (may contain special chars intentionally)

    if (!cleanUsername || !cleanPassword) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          },
          body: JSON.stringify({ username: cleanUsername, password: cleanPassword }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an unexpected response. Please try again.");
      }

      if (response.ok && data.success) {
        // Validate the returned token before storing
        if (!isTokenValid(data.data?.token)) {
          throw new Error("Received an invalid session token from the server.");
        }
        _storeSession(data.data);
        setAttempts(0);
        router.replace("/");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockUntil = Date.now() + LOCKOUT_MS;
          setLockedUntil(lockUntil);
          setError(`Account temporarily locked after ${MAX_ATTEMPTS} failed attempts. Please wait 60 seconds.`);
        } else {
          const remaining = MAX_ATTEMPTS - newAttempts;
          setError(
            (data.message || "Invalid credentials.") +
              ` (${remaining} attempt${remaining !== 1 ? "s" : ""} remaining)`
          );
        }
      }
    } catch (err) {
      setError(err.message || "Connection error. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Splash screen ──────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center min-vh-100"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
      >
        <div
          className="mb-4 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10"
          style={{ width: 72, height: 72 }}
        >
          <Shield size={36} className="text-primary" />
        </div>
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "2.5rem", height: "2.5rem", borderWidth: "0.2rem" }}
          role="status"
          className="mb-3"
        />
        <h5 className="fw-bold text-white mb-1">Code Axe Admin</h5>
        <p className="text-white-50 small">Initializing Secure Session...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <Row
      className="align-items-center justify-content-center g-0 min-vh-100"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
    >
      <Col xxl={4} lg={5} md={7} xs={12} className="py-6 py-xl-0">
        {/* SSO inline overlay */}
        {ssoProcessing && (
          <div className="text-center py-5 text-white">
            <Spinner animation="grow" variant="light" size="sm" className="me-2" />
            <span className="fw-bold">Validating Secure Session...</span>
          </div>
        )}

        {!ssoProcessing && (
          <Card
            className="border-0"
            style={{
              borderRadius: 16,
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              background: "rgba(255,255,255,0.97)",
            }}
          >
            <Card.Body className="p-5">
              {/* Header */}
              <div className="mb-4 text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  }}
                >
                  <Lock size={24} className="text-white" />
                </div>
                <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  Admin Portal
                </h4>
                <p className="text-muted small mb-0">
                  Sign in with your admin credentials
                </p>
              </div>

              {/* Error alert */}
              {error && (
                <Alert
                  variant={lockedUntil ? "warning" : "danger"}
                  className="py-2 small d-flex align-items-start gap-2"
                  style={{ borderRadius: 10 }}
                >
                  <Shield size={14} className="mt-1 flex-shrink-0" />
                  <span>{error}</span>
                </Alert>
              )}

              {/* Login form */}
              <Form onSubmit={handleLogin} autoComplete="off" noValidate>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="small fw-semibold" style={{ color: "#374151" }}>
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    disabled={!!lockedUntil || loading}
                    className="py-2"
                    style={{ borderRadius: 10, background: "#f8fafc", borderColor: "#e2e8f0" }}
                    maxLength={64}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="small fw-semibold" style={{ color: "#374151" }}>
                    Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPass ? "text" : "password"}
                      name="password"
                      placeholder="••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      disabled={!!lockedUntil || loading}
                      className="py-2 border-end-0"
                      style={{ borderRadius: "10px 0 0 10px", background: "#f8fafc", borderColor: "#e2e8f0" }}
                      maxLength={128}
                    />
                    <InputGroup.Text
                      onClick={() => setShowPass((p) => !p)}
                      style={{
                        cursor: "pointer",
                        background: "#f8fafc",
                        borderColor: "#e2e8f0",
                        borderRadius: "0 10px 10px 0",
                      }}
                    >
                      {showPass ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading || !!lockedUntil}
                    className="fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: 10, fontSize: "0.95rem" }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" variant="light" />
                        <span>Authenticating...</span>
                      </>
                    ) : lockedUntil ? (
                      `Locked – wait ${lockCountdown}s`
                    ) : (
                      <>
                        <Shield size={15} />
                        <span>Sign In Securely</span>
                      </>
                    )}
                  </Button>
                </div>
              </Form>

            </Card.Body>
          </Card>
        )}
      </Col>
    </Row>
  );
};

SignIn.Layout = AuthLayout;

export default SignIn;

// import node module libraries
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useRef } from "react";
import { Alert, Button, Col, Form, Row, Spinner, InputGroup, Container, ProgressBar } from "react-bootstrap";
import Head from "next/head";

// import authlayout to override default layout
import AuthLayout from "layouts/AuthLayout";

/** 
 * CODEAXE IDENTITY - THE SYNTHETIC HORIZON 
 * Strict implementation of Phase 1 Design Strategy.
 * Prioritizes Depth, Luminescence, and Editorial-Grade Typography.
 */

const isTokenValid = (token) => {
  if (!token || typeof token !== "string") return false;
  if (token.length < 40) return false; // Enterprise tokens are 80-char hashes
  if (/[<>"'`\s]/.test(token)) return false; // Prevent injection payloads
  return true;
};

const sanitize = (str) =>
  typeof str === "string" ? str.replace(/[<>"'`]/g, "") : "";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

const SignIn = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const didInit = useRef(false);

  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [lockCountdown, setLockCountdown] = useState(0);
  const countdownRef = useRef(null);

  // Enterprise Security: Persist lockout state across reloads via session storage
  useEffect(() => {
    const storedLock = sessionStorage.getItem("codeaxe_sec_lockout");
    if (storedLock) {
      const parsedTime = parseInt(storedLock, 10);
      if (parsedTime > Date.now()) {
        setLockedUntil(parsedTime);
      } else {
        sessionStorage.removeItem("codeaxe_sec_lockout");
      }
    }
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      setLoadProgress((prev) => (prev >= 100 ? 100 : prev + 12));
    }, 100);
    setTimeout(() => {
       clearInterval(interval);
       setPageLoading(false);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (isTokenValid(token)) {
        router.replace("/");
      }
    }
  }, [router]);

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

  const _storeSession = (data) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_role", data.role);
    localStorage.setItem("admin_name", data.name);
    localStorage.setItem("admin_email", data.email);
    localStorage.setItem("admin_username", data.username);
    localStorage.setItem("admin_login_type", data.login_type || "password");
    localStorage.setItem("admin_session_at", Date.now().toString());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (lockedUntil && Date.now() < lockedUntil) {
      setError(`Platform Lockout. Re-attempt in ${lockCountdown}s.`);
      return;
    }

    const cleanUsername = sanitize(username.trim());
    const cleanPassword = password;

    if (!cleanUsername || !cleanPassword) {
      setError("Identification required.");
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
        throw new Error("Protocol handshake failure.");
      }

      if (response.ok && data.success) {
        if (!isTokenValid(data.data?.token)) {
          throw new Error("Identity Mismatch. Protocol rejected.");
        }
        _storeSession(data.data);
        setAttempts(0);
        router.replace("/");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_MS;
          setLockedUntil(lockTime);
          sessionStorage.setItem("codeaxe_sec_lockout", lockTime.toString());
          setError(`Security trigger: Maximum attempts reached. Platform lockout engaged.`);
        } else {
          setError(data.message || "Authorization failed.");
        }
      }
    } catch (err) {
      setError(err.message || "Connection interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Codeaxe Technology</title>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </Head>

      <style jsx global>{`
        :root {
          /* Color Architecture */
          --surface-lowest: #0a0f1c;
          --surface: #0f172a;
          --surface-container-low: #1e293b;
          --surface-container-high: #334155;
          
          /* Modern Gradient Colors */
          --primary: #818cf8;
          --secondary: #38bdf8;
          
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --border-color: rgba(255, 255, 255, 0.1);
        }

        body { 
          margin: 0 !important; 
          padding: 0 !important; 
          background-color: var(--surface-lowest) !important;
          background-image: 
            radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 40%), 
            radial-gradient(circle at 85% 30%, rgba(56, 189, 248, 0.12) 0%, transparent 40%);
          font-family: 'Inter', sans-serif !important;
          color: var(--text-secondary) !important;
          min-height: 100vh;
          overflow-x: hidden !important;
        }

        /* Typography System */
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .text-gradient {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Elevation & Layering */
        .glass-portal {
            background: rgba(15, 23, 42, 0.8) !important;
            backdrop-filter: blur(24px) !important;
            -webkit-backdrop-filter: blur(24px) !important;
            border-radius: 24px !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05) inset !important;
        }

        /* Ambient Shadows */
        .ambient-glow {
            box-shadow: 0 10px 40px rgba(99, 102, 241, 0.08);
        }

        /* Inputs */
        .axe-input {
           background: rgba(30, 41, 59, 0.5) !important;
           border: 1px solid var(--border-color) !important;
           color: var(--text-primary) !important;
           padding: 1rem 1.25rem !important;
           border-radius: 12px !important;
           font-size: 0.95rem;
           transition: all 0.3s ease;
        }
        .axe-input:focus {
           background: rgba(30, 41, 59, 0.8) !important;
           border-color: var(--primary) !important;
           box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
           outline: none;
        }
        .axe-input::placeholder {
           color: var(--text-muted);
        }

        /* Buttons */
        .btn-liquid-metal {
           background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important;
           border: none !important;
           color: #ffffff !important;
           font-weight: 600 !important;
           padding: 1rem 1.5rem !important;
           border-radius: 12px !important; 
           font-family: 'Inter', sans-serif;
           letter-spacing: 0.5px;
           font-size: 1rem;
           transition: all 0.3s ease;
           box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.5);
        }
        .btn-liquid-metal:hover:not(:disabled) {
           transform: translateY(-2px);
           box-shadow: 0 15px 25px -10px rgba(99, 102, 241, 0.6);
           filter: brightness(1.1);
        }

        .axe-slash-logo {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 16px;
            box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.4);
            color: #fff;
        }

        .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        label {
            color: var(--text-secondary);
            font-size: 0.85rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .progress-line-Luxe {
           position: fixed;
           top: 0; left: 0; width: 100%; height: 3px;
           z-index: 10000;
           background: rgba(255,255,255,0.02);
        }
        .progress-inner-Luxe {
           height: 100%;
           background: linear-gradient(90deg, var(--primary), var(--secondary));
           box-shadow: 0 0 15px var(--primary);
           transition: width 0.4s ease;
        }
      `}</style>

      <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#0a0f1c', backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)', position: 'fixed', top: 0, left: 0, zIndex: 9999, overflowY: 'auto' }}>
      
      {/* Network Establishing Overlay */}
      {loading && (
         <div className="d-flex flex-column align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10005, background: 'rgba(10, 15, 28, 0.85)', backdropFilter: 'blur(12px)' }}>
            <Spinner animation="border" style={{ width: '4.5rem', height: '4.5rem', color: '#818cf8', borderWidth: '0.3rem' }} />
            <h4 className="font-manrope text-white mt-4 fw-bold text-uppercase" style={{ letterSpacing: '0.15em', fontSize: '1.25rem' }}>Establishing Connection</h4>
            <span style={{ color: '#38bdf8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="mt-2">Negotiating Security Handshake...</span>
         </div>
      )}

      <div className="progress-line-Luxe">
         <div className="progress-inner-Luxe" style={{ width: `${loadProgress}%` }} />
      </div>

      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-xl-5">
         {pageLoading ? (
            <Spinner animation="border" variant="primary" />
         ) : (
            <Row className="w-100 align-items-center justify-content-center" style={{ maxWidth: '1200px', gap: '4rem' }}>
               
               {/* Editorial Identity Side (Asymmetrical Flex) */}
               <Col lg={6} className="d-none d-lg-flex flex-column pe-lg-5">
                  <div className="d-flex align-items-center gap-3 mb-5 pb-2">
                     <div className="axe-slash-logo d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                        <span className="material-symbols-outlined fs-2">terminal</span>
                     </div>
                     <span className="font-manrope fw-bold text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Codeaxe</span>
                  </div>
                  
                  <div className="mb-5">
                     <h1 className="font-manrope text-white mb-4" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                        Architecting the <br /> <span className="text-gradient">Synthetic Horizon</span>.
                     </h1>
                     <p style={{ fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '32rem', color: 'var(--text-secondary)' }}>
                        Access your premium technology suite. Manage infrastructure, deploy solutions, and scale your digital atmosphere with architectural precision.
                     </p>
                  </div>

                  <Row className="pt-4 g-4" style={{ maxWidth: '32rem' }}>
                     <Col xs={6}>
                        <div className="p-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                           <span className="d-block mb-1 text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Network Uptime</span>
                           <h3 className="font-manrope fw-bold text-white fs-3 mb-0">99.99%</h3>
                        </div>
                     </Col>
                     <Col xs={6}>
                        <div className="p-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                           <span className="d-block mb-1 text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Infrastructure</span>
                           <h3 className="font-manrope fw-bold text-white fs-3 mb-0">Tier 4</h3>
                        </div>
                     </Col>
                  </Row>
               </Col>

               {/* Interaction Plane */}
               <Col lg={5} md={8} sm={10} className="d-flex justify-content-center p-0">
                  <div className="w-100 glass-portal p-5 ambient-glow">
                     
                     {/* Mobile Branding */}
                     <div className="d-flex d-lg-none align-items-center justify-content-center mb-4 gap-3">
                        <div className="axe-slash-logo d-flex align-items-center justify-content-center rounded-3" style={{ width: 44, height: 44 }}>
                           <span className="material-symbols-outlined fs-4 text-white">terminal</span>
                        </div>
                        <span className="font-manrope fw-bolder text-white fs-4">Codeaxe</span>
                     </div>

                     <div className="mb-4">
                        <h2 className="font-manrope fw-bold text-white mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter administrative credentials to proceed.</p>
                     </div>

                     {error && (
                        <Alert variant="danger" className="py-3 px-4 mb-4 small fw-medium" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
                           {error}
                        </Alert>
                     )}

                     <form onSubmit={handleLogin}>
                        <div className="mb-4">
                           <label className="d-block">User Identifier</label>
                           <Form.Control
                              type="text"
                              placeholder="admin@codeaxe.com"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="axe-input w-100"
                           />
                        </div>

                        <div className="mb-5">
                           <div className="d-flex justify-content-between align-items-center mb-2">
                              <label className="mb-0">Secret Access Key</label>
                              <Link href="/v1/auth/forget-password">
                                 <span className="text-decoration-none fw-semibold" style={{ cursor: 'pointer', color: 'var(--primary)', fontSize: '0.85rem' }}>Lost Key?</span>
                              </Link>
                           </div>
                           <div className="position-relative">
                              <Form.Control
                                 type={showPass ? "text" : "password"}
                                 placeholder="••••••••"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                                 className="axe-input w-100 pe-5"
                              />
                              <button onClick={() => setShowPass(!showPass)} type="button" className="btn border-0 p-0 position-absolute end-0 top-50 translate-middle-y me-3 text-muted d-flex align-items-center">
                                 <span className="material-symbols-outlined fs-5" style={{ color: 'var(--text-secondary)' }}>{showPass ? 'visibility_off' : 'visibility'}</span>
                              </button>
                           </div>
                        </div>

                        <button 
                           type="submit" 
                           disabled={loading || !!lockedUntil}
                           className="w-100 btn-liquid-metal d-flex align-items-center justify-content-center gap-2"
                        >
                           {loading ? <span>Connecting...</span> : (
                              <>
                                 <span>Establish Connection</span>
                                 <span className="material-symbols-outlined fs-5">bolt</span>
                              </>
                           )}
                        </button>
                     </form>
                  </div>
               </Col>
            </Row>
         )}
      </Container>
      </div>
    </>
  );
};

SignIn.Layout = AuthLayout;

export default SignIn;

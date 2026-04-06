// import node module libraries
import Link from "next/link";
import { Row, Col, Form, Spinner, Container, Alert } from "react-bootstrap";
import Head from "next/head";
import { useState, useEffect } from "react";

// import authlayout to override default layout
import AuthLayout from "layouts/AuthLayout";

/** 
 * CODEAXE IDENTITY - THE SYNTHETIC HORIZON (RECOVERY)
 * Strict implementation of Phase 1 Design Strategy.
 */

const ForgetPassword = () => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRestore = async (e) => {
    e.preventDefault();
    if (!email || email.trim() === "") {
        setError("Registered Dispatch Email is required.");
        return;
    }
    
    // Simple basic regex check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Syntax Error: Invalid email format detected.");
        return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Contacting the newly integrated backend High-Level Security database
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/forget-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-API-KEY': process.env.NEXT_PUBLIC_APP_KEY || ''
            },
            body: JSON.stringify({ email: email.trim() })
        });
        
        let data;
        try { data = await response.json(); } catch(e) { throw new Error("Handshake Error"); }

        if (response.ok && data.success) {
            setSuccess(data.message);
        } else {
            setError(data.message || "Request rejected by security protocols.");
        }
    } catch (err) {
        setError("Network routing failure. Core system unavailable.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setLoadProgress((prev) => (prev >= 100 ? 100 : prev + 25));
    }, 120);
    setTimeout(() => {
       clearInterval(interval);
       setPageLoading(false);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Restoration | Codeaxe Technology</title>
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
        }

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
            <h4 className="font-manrope text-white mt-4 fw-bold text-uppercase" style={{ letterSpacing: '0.15em', fontSize: '1.25rem' }}>Authorizing Request</h4>
            <span style={{ color: '#38bdf8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="mt-2">Dispatching Keys...</span>
         </div>
      )}

      <div className="progress-line-Luxe">
         <div className="progress-inner-Luxe" style={{ width: `${loadProgress}%` }} />
      </div>

      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-xl-5" style={{ zIndex: 10 }}>
         {pageLoading ? (
            <Spinner animation="border" variant="primary" />
         ) : (
            <Row className="w-100 align-items-center justify-content-center" style={{ maxWidth: '1200px', gap: '4rem' }}>
               
               {/* Left Content Side */}
               <Col lg={6} className="d-none d-lg-flex flex-column pe-lg-5">
                  <div className="d-flex align-items-center gap-3 mb-5 pb-2">
                     <div className="axe-slash-logo d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                        <span className="material-symbols-outlined fs-2">shield</span>
                     </div>
                     <span className="font-manrope fw-bold text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Codeaxe</span>
                  </div>
                  
                  <div className="mb-5">
                     <h1 className="font-manrope text-white mb-4" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                        Identity Restoration <br /> <span className="text-gradient">Protocol Sequence</span>.
                     </h1>
                     <p style={{ fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '32rem', color: 'var(--text-secondary)' }}>
                        Unauthorized access mitigation. High-level encryption key restoration for administrative dispatch profiles.
                     </p>
                  </div>

                  <div className="p-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: 'max-content' }}>
                     <span className="d-block mb-1 text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status Check</span>
                     <h3 className="font-manrope fw-bold text-white fs-4 mb-0">ENCRYPTED: AES-256</h3>
                  </div>
               </Col>

               {/* Interaction Plane */}
               <Col lg={5} md={8} sm={10} className="d-flex justify-content-center p-0">
                  <div className="w-100 glass-portal p-5 ambient-glow">
                     
                     <div className="mb-4">
                        <h2 className="font-manrope fw-bold text-white mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>Request Recovery</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Authorization keys will be dispatched to your registered handle.</p>
                     </div>

                     {error && (
                        <Alert variant="danger" className="py-3 px-4 mb-4 small fw-medium" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
                           {error}
                        </Alert>
                     )}

                     {success && (
                        <Alert variant="success" className="py-3 px-4 mb-4 small fw-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
                           {success}
                        </Alert>
                     )}

                     <form onSubmit={handleRestore}>
                        <div className="mb-5">
                           <label className="d-block">Registered Dispatch Email</label>
                           <div className="position-relative">
                              <Form.Control
                                 type="email"
                                 placeholder="ADMIN@CODEAXE.SYSTEMS"
                                 className="axe-input w-100 pe-5"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                              />
                               <span className="material-symbols-outlined position-absolute end-0 top-50 translate-middle-y me-3 d-flex align-items-center" style={{ color: 'var(--text-muted)' }}>mail</span>
                           </div>
                        </div>

                        <div className="pt-2 d-grid gap-4">
                           <button type="submit" disabled={loading} className="w-100 btn-liquid-metal d-flex align-items-center justify-content-center gap-2">
                              {loading ? <span>Processing...</span> : (
                                  <>
                                     <span>Authorize Restore</span>
                                     <span className="material-symbols-outlined fs-5">lock_reset</span>
                                  </>
                              )}
                           </button>
                           
                           <Link href="/v1/auth/sign-in" className="text-center text-decoration-none mt-2">
                              <span className="fw-semibold d-inline-flex align-items-center gap-2 transition-opacity" style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                                 <span className="material-symbols-outlined fs-6">arrow_back</span>
                                 Return to Identity Gateway
                              </span>
                           </Link>
                        </div>
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

ForgetPassword.Layout = AuthLayout;

export default ForgetPassword;

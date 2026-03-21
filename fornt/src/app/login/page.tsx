"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function Login() {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  // If redirected from an email verification link
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("verify");
    if (token) {
      document.body.style.cursor = "wait";
      fetch(`${API}/auth/verify?token=${token}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setVerificationMessage(data.message);
          } else {
            setError(data.message || "Invalid or expired link.");
          }
        })
        .catch(() => setError("Network error parsing verification link."))
        .finally(() => {
          document.body.style.cursor = "default";
          window.history.replaceState({}, document.title, window.location.pathname); // clear token from url
        });
    }
  }, []);

  useEffect(() => {
    fetch(`${API}/auth/page/login`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setPageData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingData(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setVerificationMessage(null);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        // Store API Token local
        localStorage.setItem("api_token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("mock_session", "true"); // Ensures UI elements like Navbar see auth state
        setVerificationMessage("Successfully logged in! Redirecting...");
        setTimeout(() => {
            window.location.href = "/dashboard"; // Direct user to dashboard
        }, 1500);
      } else {
        setError(data.message || "Failed to login.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="fullscreen-loader">
        <Loader2 className="animate-spin text-primary" size={56} />
      </div>
    );
  }

  return (
    <div className="container py-24 md:py-32 flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md border border-border p-8 md:p-12"
      >
        <h1 className="text-3xl font-display mb-2">{pageData?.title || "Log In"}</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          {pageData?.description || "Welcome back."}
        </p>

        {verificationMessage && (
          <div className="flex items-center gap-2 mb-6 text-sm text-green-600 border border-green-600/20 bg-green-50 px-4 py-3">
            <CheckCircle size={14} className="shrink-0" />
            <span>{verificationMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-destructive border border-destructive/20 bg-destructive/5 px-4 py-3">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <><Loader2 size={14} className="animate-spin" /> Fetching…</>
            ) : (
              <>{pageData?.button_text || "Log In"} <ArrowRight size={14} strokeWidth={1.5} /></>
            )}
          </button>

          <div className="text-center pt-4 border-t border-border mt-6 space-y-2">
            <p className="text-xs text-muted-foreground font-mono-label">
              <Link href="/forgot-password" className="text-foreground hover:text-accent transition-colors">
                Forgot your password?
              </Link>
            </p>
            <p className="text-xs text-muted-foreground font-mono-label">
              Don't have an account?{" "}
              <Link href="/signup" className="text-foreground hover:text-accent transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function ForgotPassword() {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API}/auth/page/forgot_password`)
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

    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to process request.");
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
        className="w-full max-w-md border border-border p-8 md:p-12 relative"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8 transition-colors absolute top-10 left-10"
        >
          <ArrowLeft size={12} /> Back
        </Link>
        <div className="mt-10">
          <h1 className="text-3xl font-display mb-2">{pageData?.title || "Forgot Password"}</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            {pageData?.description || "Enter your email address to receive a secure password reset link."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <CheckCircle size={48} className="text-accent mx-auto mb-4" strokeWidth={1} />
              <p className="text-muted-foreground mb-6">
                If your email is registered, we've sent a password reset link to <strong className="text-foreground">{email}</strong>.
              </p>
              <Link
                href="/login"
                className="bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors inline-block"
              >
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive border border-destructive/20 bg-destructive/5 px-4 py-3">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Processing…</>
                ) : (
                  <>{pageData?.button_text || "Send Link"} <Send size={14} strokeWidth={1.5} /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPassword() {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Extract from URL ?token=...&email=...
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
    setEmail(params.get("email") || "");

    fetch(`${API}/auth/page/reset_password`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setPageData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingData(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      setError("Missing reset token or email. Please click the link in your email again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to reset password.");
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
        <div className="mt-6 mb-10">
          <h1 className="text-3xl font-display mb-2">{pageData?.title || "Reset Password"}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {pageData?.description || "Create a fast, secure, and memorable new password."}
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
              <h2 className="text-xl font-display mb-2">Password Updated</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. You can now use it to log in.
              </p>
              <Link
                href="/login"
                className="bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors inline-block"
              >
                Go to Login
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
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {!token || !email ? (
                <div className="flex items-center gap-2 text-sm text-destructive border border-destructive/20 bg-destructive/5 px-4 py-3">
                  <AlertCircle size={14} className="shrink-0" />
                  <span className="leading-tight">Invalid Link: Missing token or email. Please check the link from your email.</span>
                </div>
              ) : null}

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive border border-destructive/20 bg-destructive/5 px-4 py-3">
                  <AlertCircle size={14} className="shrink-0" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !token || !email}
                className="w-full inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Updating…</>
                ) : (
                  <>{pageData?.button_text || "Reset Password"} <KeyRound size={14} strokeWidth={1.5} /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

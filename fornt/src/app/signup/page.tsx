"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function Signup() {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/auth/page/signup`)
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
    setSuccessMsg(null);

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setForm({ username: "", email: "", password: "" }); // Reset
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch {
      setError("Email and username must exist.");
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
        <h1 className="text-3xl font-display mb-2">{pageData?.title || "Sign Up"}</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          {pageData?.description || "Create a new account."}
        </p>

        {successMsg ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-8"
          >
            <CheckCircle size={48} className="text-accent mx-auto" strokeWidth={1} />
            <p className="text-foreground">{successMsg}</p>
            <Link
              href="/login"
              className="inline-block mt-4 text-xs font-mono-label uppercase tracking-widest text-muted-foreground hover:text-foreground border-b border-border pb-1 transition-colors"
            >
              Go to Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Username
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                placeholder="johndoe"
              />
            </div>

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
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                placeholder="••••••••"
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
              className="w-full inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <><Loader2 size={14} className="animate-spin" /> Fetching…</>
              ) : (
                <>{pageData?.button_text || "Sign Up"} <ArrowRight size={14} strokeWidth={1.5} /></>
              )}
            </button>

            <div className="text-center pt-4 border-t border-border mt-6">
              <p className="text-xs text-muted-foreground font-mono-label">
                Already have an account?{" "}
                <Link href="/login" className="text-foreground hover:text-accent transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

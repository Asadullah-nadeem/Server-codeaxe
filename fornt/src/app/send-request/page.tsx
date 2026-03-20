"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function SendRequest() {
  const router = useRouter();
  const [ui, setUi] = useState<any>(null);
  const [loadingUi, setLoadingUi] = useState(true);

  const [form, setForm] = useState({ title: "", service_type: "", budget: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("api_token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    fetch(`${API}/dashboard/request/ui`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setUi(res.data);
      })
      .finally(() => setLoadingUi(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem("api_token");

    try {
      const res = await fetch(`${API}/dashboard/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to submit request.");
        if (data.message.includes("Unauthorized")) {
          localStorage.removeItem("api_token");
          router.push("/login");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUi) {
    return (
      <div className="fullscreen-loader">
        <Loader2 className="animate-spin text-primary" size={56} />
      </div>
    );
  }

  return (
    <div className="container py-24 md:py-32 min-h-[80vh]">
      <div className="max-w-2xl mx-auto border border-border p-8 md:p-12">
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display mb-2">{ui?.title || "New Request"}</h1>
          <p className="text-muted-foreground text-sm">{ui?.subtitle || "Submit details to start a new project."}</p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle size={48} className="text-accent mx-auto mb-4" strokeWidth={1} />
              <h2 className="text-xl font-display mb-2">Request Submitted</h2>
              <p className="text-muted-foreground mb-8">
                Your project request has been securely delivered to our team. We'll review it and get back to you shortly.
              </p>
              <Link
                href="/dashboard"
                className="bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors"
              >
                Return to Dashboard
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
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                  placeholder="e.g. E-Commerce Redesign"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                    Service Type *
                  </label>
                  <select
                    required
                    value={form.service_type}
                    onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors appearance-none"
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Cloud Architecture">Cloud Architecture</option>
                    <option value="Other">Other / Strategy</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                    Budget (Optional)
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors appearance-none"
                  >
                    <option value="" disabled>Select range</option>
                    <option value="< $5k">&lt; $5,000</option>
                    <option value="$5k - $10k">$5k - $10k</option>
                    <option value="$10k - $25k">$10k - $25k</option>
                    <option value="$25k+">$25k+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                  placeholder="Tell us everything we need to know..."
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
                  <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                ) : (
                  <>Submit Request <Send size={14} strokeWidth={1.5} /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

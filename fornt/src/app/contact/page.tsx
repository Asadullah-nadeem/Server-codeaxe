"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import * as LucideIcons from "lucide-react";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pageData, setPageData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    fetch(`${API}/contact`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setPageData(res.data);
      })
      .catch((err) => console.error("Failed fetching contact page data", err))
      .finally(() => setIsLoadingData(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API}/contact/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to send message. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="fullscreen-loader">
        <LucideIcons.Loader2 className="animate-spin text-primary" size={56} />
      </div>
    );
  }

  const { header, direct_info = [], response_times = [] } = pageData || {};

  return (
    <>
      <div className="container py-24 md:py-32">
        <SectionHeader
          index={header?.section_index || "00"}
          label={header?.label || "CONTACT"}
          title={header?.title || "Start a Project"}
          description={header?.description || "Tell us about your requirements. We respond within 48 hours."}
        />

        <div className="grid md:grid-cols-12 gap-16">
          {/* ── Form Column ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="md:col-span-7"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ── Thank You State ─────────────────────── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                  className="border border-border p-12 text-center space-y-4"
                >
                  <LucideIcons.CheckCircle size={40} strokeWidth={1} className="text-accent mx-auto" />
                  <h3 className="text-2xl font-display">Message Received</h3>
                  <p className="text-muted-foreground">
                    We've sent a confirmation to <strong>{form.email}</strong>.
                    <br />
                    Our team will review your project and respond within 48 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", message: "" }); }}
                    className="mt-4 font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200 border border-border px-6 py-2"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                /* ── Contact Form ────────────────────────── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { name: "name", label: "Name *", type: "text", required: true },
                      { name: "email", label: "Email *", type: "email", required: true },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          required={field.required}
                          value={form[field.name as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                          className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                          placeholder={field.name === "name" ? "John Doe" : "john@company.com"}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Company
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                      placeholder="Acme Corp (optional)"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      Project Description *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your project, goals, and timeline..."
                      className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 resize-none"
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive border border-destructive/20 bg-destructive/5 px-4 py-3">
                      <LucideIcons.AlertCircle size={14} strokeWidth={1.5} />
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none w-full md:w-auto justify-center"
                  >
                    {isSubmitting ? (
                      <><LucideIcons.Loader2 size={14} className="animate-spin" /> Sending…</>
                    ) : (
                      <>Send Message <LucideIcons.ArrowRight size={14} strokeWidth={1.5} /></>
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground font-mono-label">
                    A confirmation email will be sent to your inbox automatically.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Info Column ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...transition, delay: 0.1 }}
            className="md:col-span-5"
          >
            <div className="border border-border p-8 space-y-8">
              {direct_info.length > 0 && (
                <div>
                  <h3 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-6">
                    Direct Contact
                  </h3>
                  <div className="space-y-4">
                    {direct_info.map((item: any) => {
                      const Icon = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;
                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          target={item.href !== "#" ? "_blank" : undefined}
                          rel="noreferrer"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 break-all"
                        >
                          <Icon size={15} strokeWidth={1.5} className="shrink-0" />
                          {item.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {response_times.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    Response Time
                  </h3>
                  <div className="space-y-2">
                    {response_times.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm gap-4">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-mono-label text-xs text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-6">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  View Our Work <LucideIcons.ArrowRight size={12} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;

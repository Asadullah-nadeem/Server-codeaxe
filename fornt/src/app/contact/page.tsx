"use client";
import { useState } from "react";
import { motion } from "framer-motion";

import SectionHeader from "@/components/SectionHeader";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <div className="container py-24 md:py-32">
        <SectionHeader index="00" label="CONTACT" title="Start a Project" description="Tell us about your requirements. We respond within 48 hours." />
        <div className="grid md:grid-cols-12 gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={transition} className="md:col-span-7">
            {submitted ? (
              <div className="border border-border p-12 text-center">
                <h3 className="text-2xl font-display mb-2">Message Received</h3>
                <p className="text-muted-foreground">We'll review your project details and respond within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: "name", label: "Name", type: "text", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "company", label: "Company", type: "text", required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{field.label}</label>
                    <input
                      type={field.type}
                      required={field.required}
                      value={form[field.name as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                    />
                  </div>
                ))}
                <div>
                  <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Project Description</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 resize-none"
                  />
                </div>
                <button type="submit" className="bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200 w-full md:w-auto">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: 0.1 }} className="md:col-span-5">
            <div className="border border-border p-8 space-y-6">
              <h3 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">Direct Contact</h3>
              {[
                { icon: Mail, label: "hello@codeaxe.co.in", href: "mailto:hello@codeaxe.co.in" },
                { icon: Github, label: "github.com/codeaxe", href: "https://github.com/codeaxe" },
                { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/codeaxe" },
                { icon: MapPin, label: "Remote — Worldwide", href: "#" },
              ].map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <item.icon size={16} strokeWidth={1.5} /> {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;

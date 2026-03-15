"use client";
import { motion } from "framer-motion";

import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const services = [
  { index: "01", title: "Web Development", description: "Custom websites, platforms, dashboards, and business tools. We build with React, Next.js, and modern frameworks that scale from MVP to enterprise.", points: ["Single Page Applications", "Admin Dashboards", "E-commerce Platforms", "SaaS Products"] },
  { index: "02", title: "Software Development", description: "Custom internal tools and software systems tailored to your business processes. Built for reliability, maintainability, and long-term scalability.", points: ["Internal Business Tools", "Workflow Automation", "Data Management Systems", "Custom CRM/ERP"] },
  { index: "03", title: "API Development", description: "Secure, scalable backend APIs with type-safe contracts, comprehensive documentation, and thorough testing. Designed for high-throughput environments.", points: ["RESTful APIs", "GraphQL Endpoints", "Webhook Systems", "API Gateway Design"] },
  { index: "04", title: "Chrome Extensions", description: "Browser extensions that automate repetitive tasks, integrate with existing tools, and improve team productivity across the organization.", points: ["Productivity Tools", "Data Scrapers", "Platform Integrations", "Content Automation"] },
  { index: "05", title: "Mobile Applications", description: "Android and iOS applications designed for real-world use. Focused on performance, native UX patterns, and reliable offline support.", points: ["Cross-Platform Apps", "Native iOS/Android", "Offline-First Design", "Push Notifications"] },
  { index: "06", title: "System Integration", description: "Connecting APIs, services, and databases to create automated systems that eliminate manual processes and reduce operational overhead.", points: ["API-First Architecture", "Database Migrations", "Third-Party Integrations", "Modular Integration"] },
];

const Services = () => (
  <>
    <div className="container py-24 md:py-32">
      <SectionHeader index="00" label="SERVICES" title="What We Build" description="Full-stack engineering services from architecture to deployment." />
      <div className="space-y-0">
        {services.map((s, i) => (
          <motion.div key={s.index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.05 }} className="border-t border-border py-12 md:py-16 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-1">
              <span className="font-mono-label text-xs text-muted-foreground">{s.index}</span>
            </div>
            <div className="md:col-span-4">
              <h3 className="text-2xl font-display">{s.title}</h3>
            </div>
            <div className="md:col-span-4">
              <p className="text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
            <div className="md:col-span-3">
              <ul className="space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="font-mono-label text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 bg-muted-foreground" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="border-t border-border pt-16 mt-8 text-center">
        <h2 className="text-3xl font-display tracking-tighter">Have a project in mind?</h2>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200 mt-8">
          Start Project <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  </>
);

export default Services;

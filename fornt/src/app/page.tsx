"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Code2, Server, Chrome, Smartphone, Workflow, ArrowRight, Shield, Zap, Lock, CheckCircle } from "lucide-react";

import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import ProjectCard from "@/components/ProjectCard";
import googleLogo from "@/assets/partners/google.png";
import facebookLogo from "@/assets/partners/facebook.png";
import amazonLogo from "@/assets/partners/amazon.png";
import microsoftLogo from "@/assets/partners/microsoft.png";
import appleLogo from "@/assets/partners/apple.png";
import slackLogo from "@/assets/partners/slack.png";
import spotifyLogo from "@/assets/partners/spotify.png";
import netflixLogo from "@/assets/partners/netflix.png";
import reactLogo from "@/assets/tech/react.png";
import nodejsLogo from "@/assets/tech/nodejs.png";
import typescriptLogo from "@/assets/tech/typescript.png";
import pythonLogo from "@/assets/tech/python.png";
import dockerLogo from "@/assets/tech/docker.png";
import postgresqlLogo from "@/assets/tech/postgresql.png";
import awsLogo from "@/assets/tech/aws.png";
import firebaseLogo from "@/assets/tech/firebase.png";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const services = [
  { index: "01", title: "Web Development", description: "Custom websites, platforms, dashboards, and business tools built with modern frameworks.", icon: Globe },
  { index: "02", title: "Custom Software", description: "Internal tools and software systems engineered for your specific business requirements.", icon: Code2 },
  { index: "03", title: "API Development", description: "Secure, scalable backend APIs with type-safe contracts and comprehensive documentation.", icon: Server },
  { index: "04", title: "Chrome Extensions", description: "Browser extensions that automate tasks and improve team productivity at scale.", icon: Chrome },
  { index: "05", title: "Mobile Applications", description: "Android and iOS applications designed for real-world use and performance.", icon: Smartphone },
  { index: "06", title: "System Automation", description: "Connecting APIs, services, and databases to create fully automated workflows.", icon: Workflow },
];

const projects = [
  { title: "DataVault Platform", description: "Enterprise data management system handling 2M+ records with real-time sync and role-based access control.", tags: ["React", "Node.js", "PostgreSQL"], year: "2025" },
  { title: "FlowSync API", description: "High-throughput API gateway processing 50K requests/minute with automatic failover and load balancing.", tags: ["TypeScript", "Redis", "Docker"], year: "2025" },
  { title: "TaskForge Extension", description: "Chrome extension automating project management workflows across 12 integrated platforms.", tags: ["Chrome API", "React", "WebSocket"], year: "2024" },
];

const stats = [
  { value: "99.9%", label: "Uptime Architecture" },
  { value: "0.4s", label: "Avg. Load Time" },
  { value: "124+", label: "Delivered Systems" },
  { value: "48h", label: "Response Time" },
];

const Index = () => (
  <>
    {/* Hero */}
    <section className="border-b border-border">
      <div className="container pt-8 pb-20 md:pt-12 md:pb-32">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          <div className="md:col-span-3">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: 0 }} className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Software Engineering Partner
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tighter text-balance leading-[0.95]">
              We build software that scales before you do.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 }} className="text-lg text-muted-foreground max-w-[55ch] mt-8 leading-relaxed">
              CodeAxe is a technical partner for companies requiring high-availability systems, custom browser tooling, and automated infrastructure. No fluff. Just engineering.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.3 }} className="flex flex-wrap gap-4 mt-10">
              <Link href="/work" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200">
                View Work <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-border px-8 py-4 font-mono-label text-sm uppercase tracking-widest text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-200">
                Start Project
              </Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: 0.4 }} className="md:col-span-2 border border-border p-6 hidden md:block">
            <div className="font-mono-label text-xs text-muted-foreground mb-4 uppercase tracking-widest">System Status</div>
            <div className="space-y-3">
              {[
                { label: "API Gateway", status: "Operational", ping: "12ms" },
                { label: "Database Cluster", status: "Operational", ping: "4ms" },
                { label: "CDN Edge Nodes", status: "Operational", ping: "8ms" },
                { label: "Auth Service", status: "Operational", ping: "6ms" },
                { label: "Build Pipeline", status: "Operational", ping: "22ms" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-label text-xs text-muted-foreground">{item.ping}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="border-b border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.1 }} className={`py-10 md:py-16 text-center ${i < 3 ? "border-r border-border" : ""}`}>
              <div className="text-3xl md:text-4xl font-display">{stat.value}</div>
              <div className="font-mono-label text-xs text-muted-foreground mt-2 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Partners */}
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={transition}>
          <span className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest block text-center mb-12">Partners</span>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 md:gap-12 items-center justify-items-center">
            {[
              { src: googleLogo, name: "Google" },
              { src: facebookLogo, name: "Facebook" },
              { src: amazonLogo, name: "Amazon" },
              { src: microsoftLogo, name: "Microsoft" },
              { src: appleLogo, name: "Apple" },
              { src: slackLogo, name: "Slack" },
              { src: spotifyLogo, name: "Spotify" },
              { src: netflixLogo, name: "Netflix" },
            ].map((partner, i) => (
              <motion.div key={partner.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.05 }} className="flex flex-col items-center gap-3 group">
                <img src={partner.src.src} alt={partner.name} className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-200" />
                <span className="font-mono-label text-[10px] text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors duration-200">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    <section className="border-b border-border">
      <div className="container py-24 md:py-32">
        <SectionHeader index="01" label="CAPABILITIES" title="Engineering Services" description="Full-stack development services built on modern, scalable architecture." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border overflow-hidden">
          {services.map((s) => (
            <ServiceCard key={s.index} {...s} />
          ))}
        </div>
      </div>
    </section>

    {/* Featured Work */}
    <section className="border-b border-border">
      <div className="container py-24 md:py-32">
        <SectionHeader index="02" label="FEATURED WORK" title="Selected Projects" description="Systems built for performance, reliability, and scale." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/work" className="inline-flex items-center gap-2 font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200">
            View All Projects <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>

    {/* Why CodeAxe */}
    <section className="border-b border-border">
      <div className="container py-24 md:py-32">
        <SectionHeader index="03" label="WHY CODEAXE" title="Engineering Principles" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border overflow-hidden">
          {[
            { icon: Zap, title: "Clean Architecture", desc: "Modular, maintainable codebases that scale with your team." },
            { icon: Shield, title: "Secure Backend", desc: "Defense-in-depth security with encrypted data at rest and in transit." },
            { icon: Lock, title: "Reliable Systems", desc: "99.9% uptime architecture with automated failover and monitoring." },
            { icon: CheckCircle, title: "Professional Delivery", desc: "On-time delivery with clear communication and documentation." },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.1 }} className="p-8 bg-background">
              <item.icon size={20} strokeWidth={1.5} className="text-muted-foreground mb-4" />
              <h3 className="font-display text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Best Technologies */}
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={transition}>
          <span className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest block text-center mb-12">Best Technologies We Use</span>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 md:gap-12 items-center justify-items-center">
            {[
              { src: reactLogo, name: "React" },
              { src: nodejsLogo, name: "Node.js" },
              { src: typescriptLogo, name: "TypeScript" },
              { src: pythonLogo, name: "Python" },
              { src: dockerLogo, name: "Docker" },
              { src: postgresqlLogo, name: "PostgreSQL" },
              { src: awsLogo, name: "AWS" },
              { src: firebaseLogo, name: "Firebase" },
            ].map((tech, i) => (
              <motion.div key={tech.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.05 }} className="flex flex-col items-center gap-3 group">
                <img src={tech.src.src} alt={tech.name} className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-200" />
                <span className="font-mono-label text-[10px] text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors duration-200">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    <section className="border-b border-border grid-bg">
      <div className="container py-24 md:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={transition}>
          <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">Ready to build?</span>
          <h2 className="text-4xl md:text-5xl font-display tracking-tighter mt-4">Let's engineer your next system.</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-[50ch] mx-auto">From architecture to deployment — we handle the full stack.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200 mt-10">
            Start Your Project <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
);

export default Index;

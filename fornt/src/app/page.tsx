"use client";
export const dynamic = 'force-static';
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Chrome, Code2, Globe, Loader2, Lock, Server, Shield, Smartphone, Workflow, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import amazonLogo from "@/assets/partners/amazon.png";
import appleLogo from "@/assets/partners/apple.png";
import facebookLogo from "@/assets/partners/facebook.png";
import googleLogo from "@/assets/partners/google.png";
import microsoftLogo from "@/assets/partners/microsoft.png";
import netflixLogo from "@/assets/partners/netflix.png";
import slackLogo from "@/assets/partners/slack.png";
import spotifyLogo from "@/assets/partners/spotify.png";
import awsLogo from "@/assets/tech/aws.png";
import dockerLogo from "@/assets/tech/docker.png";
import firebaseLogo from "@/assets/tech/firebase.png";
import nodejsLogo from "@/assets/tech/nodejs.png";
import postgresqlLogo from "@/assets/tech/postgresql.png";
import pythonLogo from "@/assets/tech/python.png";
import reactLogo from "@/assets/tech/react.png";
import typescriptLogo from "@/assets/tech/typescript.png";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const iconMap: any = { Globe, Code2, Server, Chrome, Smartphone, Workflow, Zap, Shield, Lock, CheckCircle };
const techImageMap: any = {
  reactLogo, nodejsLogo, typescriptLogo, pythonLogo,
  dockerLogo, postgresqlLogo, awsLogo, firebaseLogo
};
const partnerImageMap: any = {
  googleLogo, facebookLogo, amazonLogo, microsoftLogo, appleLogo, slackLogo, spotifyLogo, netflixLogo
};

const Index = () => {
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [principles, setPrinciples] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [hero, setHero] = useState<any>({});
  const [cta, setCta] = useState<any>({});
  const [sectionHeaders, setSectionHeaders] = useState<any>({
    system_status: {}, partners: {}, capabilities: {}, featured_work: {}, why_codeaxe: {}, technologies: {}
  });
  const [settings, setSettings] = useState<any>({});
  const [sections, setSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;
  const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY || "";

  // Returns true (visible) by default when section isn't configured yet
  const isVisible = (key: string): boolean => {
    if (Object.keys(sections).length === 0) return true;
    return sections[key] !== false;
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API}/sections`).then(r => r.json()).catch(() => ({ success: false })),
      fetch(`${API}/home`, { headers: { 'X-API-KEY': APP_KEY } }).then(r => r.json()).catch(() => ({ success: false })),
    ]).then(([secRes, homeRes]) => {
      if (secRes?.success && secRes?.data) setSections(secRes.data);

      if (homeRes?.success && homeRes?.data) {
        const d = homeRes.data;
        if (d.services?.length > 0)
          setServices(d.services.map((s: any) => ({ ...s, icon: iconMap[s.icon] || Globe })));
        if (d.projects?.length > 0) setProjects(d.projects);
        if (d.stats?.length > 0) setStats(d.stats);
        if (d.principles?.length > 0) setPrinciples(d.principles);
        if (d.technologies?.length > 0)
          setTechnologies(d.technologies.map((t: any) => ({ ...t, src: techImageMap[t.src] || reactLogo })));
        if (d.system_status?.length > 0) setSystemStatus(d.system_status);
        if (d.partners?.length > 0)
          setPartners(d.partners.map((p: any) => ({ ...p, src: partnerImageMap[p.src] || googleLogo })));
        if (d.hero) setHero(d.hero);
        if (d.cta) setCta(d.cta);
        if (d.section_headers) setSectionHeaders((prev: any) => ({ ...prev, ...d.section_headers }));
        if (d.settings) setSettings((prev: any) => ({ ...prev, ...d.settings }));
      }
    }).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="fullscreen-loader">
        <Loader2 className="animate-spin text-primary" size={56} />
      </div>
    );
  }

  return (
    <>
      {/* ── Hero ── */}
      {isVisible('hero') && (
        <section className="border-b border-border">
          <div className="container pt-8 pb-20 md:pt-12 md:pb-32">
            <div className="grid md:grid-cols-5 gap-16 items-start">
              <div className="md:col-span-3">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: 0 }} className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-6">
                  {hero.badge}
                </motion.p>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tighter text-balance leading-[0.95]">
                  {hero.title}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 }} className="text-lg text-muted-foreground max-w-[55ch] mt-8 leading-relaxed">
                  {hero.description}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.3 }} className="flex flex-wrap gap-4 mt-10">
                  <Link href={settings?.home_hero_btn1_link || "#"} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200">
                    {settings?.home_hero_btn1_label} <ArrowRight size={14} strokeWidth={1.5} />
                  </Link>
                  <Link href={settings?.home_hero_btn2_link || "#"} className="inline-flex items-center gap-2 border border-border px-8 py-4 font-mono-label text-sm uppercase tracking-widest text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-200">
                    {settings?.home_hero_btn2_label}
                  </Link>
                </motion.div>
              </div>
              {isVisible('system_status') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: 0.4 }} className="md:col-span-2 border border-border p-6 hidden md:block">
                  <div className="font-mono-label text-xs text-muted-foreground mb-4 uppercase tracking-widest">{sectionHeaders.system_status.label}</div>
                  <div className="space-y-3">
                    {systemStatus.map((item) => (
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
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats ── */}
      {isVisible('stats') && stats.length > 0 && (
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
      )}

      {/* ── Partners ── */}
      {isVisible('partners') && partners.length > 0 && (
        <section className="border-b border-border">
          <div className="container py-16 md:py-24">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={transition}>
              <span className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest block text-center mb-12">{sectionHeaders.partners.label}</span>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-8 md:gap-12 items-center justify-items-center">
                {partners.map((partner, i) => (
                  <motion.div key={partner.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.05 }} className="flex flex-col items-center gap-3 group">
                    <img src={partner.src.src} alt={partner.name} className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-mono-label text-[10px] text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors duration-200">{partner.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Services ── */}
      {isVisible('services') && services.length > 0 && (
        <section className="border-b border-border">
          <div className="container py-24 md:py-32">
            {sectionHeaders?.capabilities && (
              <SectionHeader index={sectionHeaders.capabilities.section_index} label={sectionHeaders.capabilities.label} title={sectionHeaders.capabilities.title} description={sectionHeaders.capabilities.description} />
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border overflow-hidden">
              {services.map((s, idx) => (
                <ServiceCard key={s.id || s.index || idx} {...s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Projects ── */}
      {isVisible('projects') && projects.length > 0 && (
        <section className="border-b border-border">
          <div className="container py-24 md:py-32">
            {sectionHeaders?.featured_work && (
              <SectionHeader index={sectionHeaders.featured_work.section_index} label={sectionHeaders.featured_work.label} title={sectionHeaders.featured_work.title} description={sectionHeaders.featured_work.description} />
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, idx) => (
                <ProjectCard key={p.id || p.title || idx} {...p} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href={settings?.home_featured_btn_link || "#"} className="inline-flex items-center gap-2 font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200">
                {settings?.home_featured_btn_label} <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Principles / Why CodeAxe ── */}
      {isVisible('principles') && principles.length > 0 && (
        <section className="border-b border-border">
          <div className="container py-24 md:py-32">
            {sectionHeaders?.why_codeaxe && (
              <SectionHeader index={sectionHeaders.why_codeaxe.section_index} label={sectionHeaders.why_codeaxe.label} title={sectionHeaders.why_codeaxe.title} description={sectionHeaders.why_codeaxe.description} />
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border overflow-hidden">
              {principles.map((item, i) => {
                const IconComp = iconMap[item.icon] || Zap;
                return (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.1 }} className="p-8 bg-background">
                    <IconComp size={20} strokeWidth={1.5} className="text-muted-foreground mb-4" />
                    <h3 className="font-display text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Technologies ── */}
      {isVisible('technologies') && technologies.length > 0 && (
        <section className="border-b border-border">
          <div className="container py-16 md:py-24">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={transition}>
              <span className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest block text-center mb-12">{sectionHeaders?.technologies?.label}</span>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-8 md:gap-12 items-center justify-items-center">
                {technologies.map((tech, i) => (
                  <motion.div key={tech.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.05 }} className="flex flex-col items-center gap-3 group">
                    <img src={tech.src.src} alt={tech.name} className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-mono-label text-[10px] text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors duration-200">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Founder ── */}
      {isVisible('hero') && settings.site_founder_name && (
        <section className="border-b border-border bg-muted/30">
          <div className="container py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={transition} className="mb-12">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
                  <Globe className="text-primary" size={40} />
                </div>
                <h2 className="text-3xl md:text-5xl font-display tracking-tighter mb-8 leading-tight italic">
                  {settings.site_founder_message || "We don't just build websites; we craft digital experiences that drive growth and innovation."}
                </h2>
                <div className="flex flex-col items-center">
                  <span className="font-display text-xl">{settings.site_founder_name}</span>
                  <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mt-2">Founder & CEO, CodeAxe</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {isVisible('cta') && (
        <section className="border-b border-border grid-bg">
          <div className="container py-24 md:py-32 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={transition}>
              <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{cta.badge}</span>
              <h2 className="text-4xl md:text-5xl font-display tracking-tighter mt-4">{cta.title}</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-[50ch] mx-auto">{cta.description}</p>
              <Link href={cta?.button_link || "#"} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200 mt-10">
                {cta?.button_label} <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
};

export default Index;

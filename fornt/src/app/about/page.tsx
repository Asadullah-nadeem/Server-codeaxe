"use client";
import { motion } from "framer-motion";

import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const About = () => (
  <>
    <div className="container py-24 md:py-32">
      <SectionHeader index="00" label="ABOUT" title="Code as Infrastructure" description="We treat software not as a creative expression, but as a reliable utility. If it doesn't scale, it doesn't ship." />
      <div className="grid md:grid-cols-2 gap-16 mt-16">
        {[
          { title: "Our Mission", text: "To build reliable digital systems that companies can depend on. Every line of code we write is designed for production, every architecture decision is made for longevity." },
          { title: "Development Philosophy", text: "We follow engineering-first principles: type safety, automated testing, infrastructure as code, and continuous deployment. Our systems are built to handle failure gracefully." },
          { title: "Technology Expertise", text: "React, TypeScript, Node.js, Go, PostgreSQL, Redis, Docker, Kubernetes, AWS, and GCP. We choose the right tool for the problem, not the trendiest framework." },
          { title: "Quality Commitment", text: "Every project includes comprehensive documentation, automated CI/CD pipelines, monitoring dashboards, and a handoff process designed for long-term maintainability." },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: i * 0.1 }} className="border-t border-border pt-8">
            <h3 className="text-xl font-display mb-4">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
      <div className="border-t border-border pt-16 mt-20 text-center">
        <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200">
          Work With Us <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  </>
);

export default About;

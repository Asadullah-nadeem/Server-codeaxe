"use client";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };
const API = process.env.NEXT_PUBLIC_API_URL;

const About = () => {
  const [header, setHeader] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/pages/about`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.header) setHeader(res.data.header);
          if (res.data.sections?.length > 0) setSections(res.data.sections);
        }
      })
      .catch((err) => console.error("Failed fetching about page", err))
      .finally(() => setIsLoading(false));
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
      <div className="container py-24 md:py-32">
        {header && (
          <SectionHeader
            index={header.section_index}
            label={header.label}
            title={header.title}
            description={header.description}
          />
        )}

        <div className="grid md:grid-cols-2 gap-16 mt-16">
          {sections.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: i * 0.1 }}
              className="border-t border-border pt-8"
            >
              <h3 className="text-xl font-display mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>

        {header?.cta_link && (
          <div className="border-t border-border pt-16 mt-20 text-center">
            <Link
              href={header.cta_link}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200"
            >
              {header.cta_label || "Work With Us"} <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default About;

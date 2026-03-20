"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const Services = () => {
  const [header, setHeader] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [cta, setCta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}/services`, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.header) setHeader(res.data.header);
          if (res.data.services?.length > 0) setServices(res.data.services);
          if (res.data.cta) setCta(res.data.cta);
        }
      })
      .catch((err) => console.error("Failed fetching services data", err))
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
        {/* Page Header */}
        {header && (
          <SectionHeader
            index={header.section_index}
            label={header.label}
            title={header.title}
            description={header.description}
          />
        )}

        {/* Services List */}
        <div className="space-y-0">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: i * 0.05 }}
              className="border-t border-border py-12 md:py-16 grid md:grid-cols-12 gap-8"
            >
              {/* Index */}
              <div className="md:col-span-1">
                <span className="font-mono-label text-xs text-muted-foreground">{s.sort_index}</span>
              </div>

              {/* Title */}
              <div className="md:col-span-4">
                <h3 className="text-2xl font-display">{s.title}</h3>
              </div>

              {/* Description */}
              <div className="md:col-span-4">
                <p className="text-muted-foreground leading-relaxed">{s.description}</p>
              </div>

              {/* Points */}
              <div className="md:col-span-3">
                <ul className="space-y-2">
                  {Array.isArray(s.points) && s.points.map((p: string) => (
                    <li key={p} className="font-mono-label text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 bg-muted-foreground" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        {cta && (
          <div className="border-t border-border pt-16 mt-8 text-center">
            <h2 className="text-3xl font-display tracking-tighter">{cta.heading}</h2>
            <Link
              href={cta.button_link || "#"}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-mono-label text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-200 mt-8"
            >
              {cta.button_label} <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Services;

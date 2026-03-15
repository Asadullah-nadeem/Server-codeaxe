"use client";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const ServiceCard = ({ index, title, description, icon: Icon, href = "/services" }: { index: string; title: string; description: string; icon: LucideIcon; href?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={transition}
    whileHover={{ y: -4 }}
    className="border border-border p-8 bg-background flex flex-col gap-4 group hover:border-foreground transition-colors duration-200"
  >
    <span className="font-mono-label text-xs text-muted-foreground">{index}</span>
    <Icon size={24} strokeWidth={1.5} className="text-muted-foreground" />
    <h3 className="text-xl font-display">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    <Link href={href} className="mt-auto pt-6 flex items-center gap-2 font-mono-label text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors duration-200">
      Learn More <ArrowRight size={14} strokeWidth={1.5} />
    </Link>
  </motion.div>
);

export default ServiceCard;

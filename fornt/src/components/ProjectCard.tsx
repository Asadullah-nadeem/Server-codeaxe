"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const ProjectCard = ({ title, description, tags, year }: { title: string; description: string; tags: string[]; year: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={transition}
    className="border border-border group hover:border-foreground transition-colors duration-200 overflow-hidden"
  >
    <div className="aspect-[21/9] bg-muted grid-bg relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest">{title}</span>
      </div>
      <div className="absolute left-0 right-0 h-px bg-accent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] top-0" />
    </div>
    <div className="p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-display">{title}</h3>
        <ArrowUpRight size={16} strokeWidth={1.5} className="text-muted-foreground group-hover:text-accent transition-colors duration-200 mt-1" />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="flex items-center gap-3 mt-2 flex-wrap">
        <span className="font-mono-label text-xs text-muted-foreground">{year}</span>
        <span className="w-px h-3 bg-border" />
        {tags.map((tag) => (
          <span key={tag} className="font-mono-label text-xs text-muted-foreground">{tag}</span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default ProjectCard;

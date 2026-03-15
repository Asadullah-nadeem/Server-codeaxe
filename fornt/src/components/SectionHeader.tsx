"use client";
import { motion } from "framer-motion";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const SectionHeader = ({ index, label, title, description }: { index: string; label: string; title: string; description?: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={transition} className="mb-16">
    <span className="font-mono-label text-xs text-muted-foreground">{index} // {label}</span>
    <h2 className="text-4xl md:text-5xl font-display tracking-tighter mt-2">{title}</h2>
    {description && <p className="text-lg text-muted-foreground max-w-[65ch] mt-4">{description}</p>}
  </motion.div>
);

export default SectionHeader;

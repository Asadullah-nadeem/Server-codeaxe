"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

const ProjectCard = ({
  title,
  description,
  tags,
  year,
  image_url,
  project_url,
}: {
  title: string;
  description: string;
  tags: string[];
  year: string;
  image_url?: string;
  project_url?: string;
}) => {
  const CardWrapper = project_url ? "a" : "div";
  const wrapperProps = project_url
    ? { href: project_url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={transition}
    >
      <CardWrapper
        {...(wrapperProps as any)}
        className="block border border-border group hover:border-foreground transition-colors duration-200 overflow-hidden cursor-pointer"
      >
        {/* Image / Thumbnail */}
        <div className="aspect-[21/9] bg-muted relative overflow-hidden">
          {image_url ? (
            <img
              src={image_url}
              alt={title || "Project Thumbnail"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 grid-bg flex items-center justify-center">
              <span className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest">
                {title}
              </span>
            </div>
          )}
          {/* Scan line hover effect */}
          <div className="absolute left-0 right-0 h-px bg-accent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] top-0" />

          {/* "Open link" badge overlaid on image when URL exists */}
          {project_url && (
            <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm border border-border p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ExternalLink size={12} strokeWidth={1.5} className="text-accent" />
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-6 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-display">{title}</h3>
            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              className={`mt-1 transition-colors duration-200 ${
                project_url
                  ? "text-muted-foreground group-hover:text-accent"
                  : "text-muted-foreground"
              }`}
            />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="font-mono-label text-xs text-muted-foreground">{year}</span>
            <span className="w-px h-3 bg-border" />
            {Array.isArray(tags) &&
              tags.map((tag) => (
                <span key={tag} className="font-mono-label text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            {project_url && (
              <>
                <span className="w-px h-3 bg-border" />
                <span className="font-mono-label text-xs text-accent group-hover:underline">
                  View Project ↗
                </span>
              </>
            )}
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
};

export default ProjectCard;

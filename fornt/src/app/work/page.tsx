"use client";
export const dynamic = 'force-static';

import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Work = () => {
  const [header, setHeader] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/work`, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.header) setHeader(res.data.header);
          if (res.data.categories?.length > 0) setCategories(res.data.categories);
        }
      })
      .catch((err) => console.error("Failed fetching work data", err))
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
        {categories.map((cat, ci) => (
          <div key={cat.id} className="mb-20 last:mb-0">
            <span className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest mb-8 block">
              {String(ci + 1).padStart(2, "0")} // {cat.label}
            </span>
            <Carousel opts={{ align: "start" }} className="w-full relative">
              <CarouselContent>
                {cat.projects?.map((p: any) => (
                  <CarouselItem key={p.id} className="md:basis-1/2">
                    <ProjectCard {...p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-12 lg:-left-16" />
                <CarouselNext className="-right-12 lg:-right-16" />
              </div>
            </Carousel>
          </div>
        ))}
      </div>
    </>
  );
};

export default Work;

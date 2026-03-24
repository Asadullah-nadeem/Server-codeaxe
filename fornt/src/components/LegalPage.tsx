"use client";
import SectionHeader from "@/components/SectionHeader";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

const LegalPage = ({ type }: { type: string }) => {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    fetch(`${API}/pages/legal/${type}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setPage(res.data.page);
          setSections(res.data.sections || []);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [type]);

  if (isLoading) {
    return (
      <div className="fullscreen-loader">
        <Loader2 className="animate-spin text-primary" size={56} />
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="container py-24 md:py-32 max-w-3xl text-center">
        <p className="text-muted-foreground font-mono-label text-sm">This page is currently unavailable.</p>
      </div>
    );
  }

  return (
    <>
      <div className="container py-24 md:py-32 max-w-3xl">
        <SectionHeader index="00" label={page.label} title={page.title} />
        <div className="space-y-12">
          {sections.map((s) => (
            <div key={s.id} className="border-t border-border pt-8">
              <h3 className="text-lg font-display mb-3">{s.heading}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-16 font-mono-label">
          Last updated: {page.last_updated}
        </p>
      </div>
    </>
  );
};

export default LegalPage;

"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import ProjectCard from "@/components/ProjectCard";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const KEY = process.env.NEXT_PUBLIC_APP_KEY || "";

const Portfolio = () => {
  const { category: slug } = useParams<{ category: string }>();
  const router = useRouter();

  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Load all active categories for the tab bar (no API key needed - public)
  useEffect(() => {
    fetch(`${API}/portfolio`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setAllCategories(res.data);
          // If no slug, redirect to first active category
          if (!slug && res.data[0]) {
            router.replace(`/portfolio/${res.data[0].slug}`);
          }
        }
      })
      .catch((err) => console.error("Failed fetching portfolio categories", err));
  }, []);

  // Load items for current category + page
  const loadItems = useCallback(
    (page: number) => {
      if (!slug) return;
      page === 1 ? setIsLoading(true) : setIsPageLoading(true);

      fetch(`${API}/portfolio/${slug}?page=${page}&per_page=6`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) {
            setCategoryData(res.data.category);
            setItems(res.data.items);
            setCurrentPage(res.data.current_page);
            setTotalPages(res.data.total_pages);
            setTotal(res.data.total);
          }
        })
        .catch((err) => console.error("Failed fetching portfolio items", err))
        .finally(() => {
          setIsLoading(false);
          setIsPageLoading(false);
        });
    },
    [slug]
  );

  useEffect(() => {
    setCurrentPage(1);
    loadItems(1);
  }, [slug]);

  const handlePageChange = (page: number) => {
    loadItems(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="fullscreen-loader">
        <Loader2 className="animate-spin text-primary" size={56} />
      </div>
    );
  }

  const startIndex = (currentPage - 1) * 6;

  return (
    <>
      <div className="container py-24 md:py-32">
        {/* Page Header */}
        <SectionHeader
          index="00"
          label="PORTFOLIO"
          title={categoryData?.label || "Portfolio"}
          description={categoryData?.description || "Our work."}
        />

        {/* Category Tabs — driven by DB */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-border pb-6">
          {allCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/portfolio/${cat.slug}`}
              onClick={() => setCurrentPage(1)}
              className={`px-4 py-2 font-mono-label text-xs uppercase tracking-widest transition-colors duration-200 border ${
                slug === cat.slug
                  ? "border-foreground text-foreground bg-foreground text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Projects Grid */}
        {isPageLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : (
          <motion.div
            key={`${slug}-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((p) => (
              <ProjectCard
                key={p.id}
                title={p.title}
                description={p.description}
                tags={Array.isArray(p.tags) ? p.tags : []}
                year={p.project_year || ""}
                image_url={p.image_url}
                project_url={p.project_url}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center font-mono-label text-xs transition-colors duration-200 border ${
                  page === currentPage
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {String(page).padStart(2, "0")}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>

            <span className="ml-4 font-mono-label text-xs text-muted-foreground">
              {startIndex + 1}–{Math.min(startIndex + 6, total)} of {total}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Portfolio;

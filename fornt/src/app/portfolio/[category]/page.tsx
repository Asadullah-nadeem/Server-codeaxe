"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import SectionHeader from "@/components/SectionHeader";
import ProjectCard from "@/components/ProjectCard";

const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };
const ITEMS_PER_PAGE = 6;

const categories = [
  { slug: "chrome-extensions", label: "Chrome Extensions" },
  { slug: "web-tools", label: "Web Tools" },
  { slug: "app-store", label: "App Store" },
  { slug: "play-store", label: "Play Store" },
  { slug: "client-projects", label: "Client Projects" },
];

const portfolioData: Record<string, { title: string; description: string; projects: { title: string; description: string; tags: string[]; year: string }[] }> = {
  "chrome-extensions": {
    title: "Chrome Extensions",
    description: "Browser tools engineered for productivity and automation.",
    projects: [
      { title: "TaskForge", description: "Project management automation across 12 platforms with real-time sync.", tags: ["Chrome API", "React", "WebSocket"], year: "2024" },
      { title: "DataSnap", description: "Automated data extraction tool with configurable selectors and export formats.", tags: ["Chrome API", "TypeScript"], year: "2024" },
      { title: "TabManager Pro", description: "Intelligent tab grouping and session management for power users.", tags: ["Chrome API", "IndexedDB"], year: "2023" },
      { title: "FormFiller", description: "Auto-fill browser extension with encrypted credential storage and team sharing.", tags: ["Chrome API", "AES-256"], year: "2023" },
      { title: "PageMonitor", description: "Website change detection and alert system for competitive analysis.", tags: ["Chrome API", "Diff Engine"], year: "2023" },
      { title: "LinkVault", description: "Bookmark manager with tagging, search, and cross-device sync.", tags: ["Chrome API", "Firebase"], year: "2022" },
      { title: "ScreenCapture+", description: "Full-page screenshot and annotation tool with cloud storage.", tags: ["Chrome API", "Canvas API"], year: "2022" },
      { title: "AdBlock Custom", description: "Customizable content filter with whitelist rules for enterprise use.", tags: ["Chrome API", "RegExp"], year: "2022" },
    ],
  },
  "web-tools": {
    title: "Web Tools",
    description: "Online utilities and tools built for developers and businesses.",
    projects: [
      { title: "APITester", description: "Browser-based API testing tool with request history and team sharing.", tags: ["React", "IndexedDB", "WebWorkers"], year: "2025" },
      { title: "JSONForge", description: "Advanced JSON editor with schema validation and diff comparison.", tags: ["TypeScript", "Monaco Editor"], year: "2024" },
      { title: "CSSGrid Builder", description: "Visual CSS grid layout builder with export to production code.", tags: ["React", "CSS Grid"], year: "2024" },
      { title: "ColorPalette Pro", description: "AI-powered color palette generator with accessibility contrast checker.", tags: ["React", "Color Theory"], year: "2024" },
      { title: "MarkdownLive", description: "Real-time collaborative markdown editor with export to PDF and HTML.", tags: ["React", "WebSocket", "PDF.js"], year: "2023" },
      { title: "RegexPlayground", description: "Interactive regex builder with visual matching and test suite generation.", tags: ["TypeScript", "RegExp"], year: "2023" },
      { title: "SVG Optimizer", description: "Batch SVG optimization tool reducing file sizes by up to 60%.", tags: ["Node.js", "SVGO"], year: "2023" },
    ],
  },
  "app-store": {
    title: "App Store",
    description: "iOS applications designed for real-world performance.",
    projects: [
      { title: "FocusTimer", description: "Pomodoro-based productivity app with analytics and widget support.", tags: ["Swift", "SwiftUI", "CoreData"], year: "2024" },
      { title: "ExpenseLog", description: "Personal finance tracker with bank sync and receipt scanning.", tags: ["Swift", "Vision API", "CloudKit"], year: "2024" },
      { title: "MealPlanner", description: "Nutrition tracking app with barcode scanning and weekly meal plans.", tags: ["Swift", "HealthKit"], year: "2024" },
      { title: "HabitLoop", description: "Habit tracking app with streak analytics and motivational nudges.", tags: ["SwiftUI", "CoreData"], year: "2023" },
      { title: "VoiceMemo Pro", description: "Audio recording app with transcription and cloud backup.", tags: ["Swift", "Speech API", "iCloud"], year: "2023" },
      { title: "PhotoVault", description: "Private photo storage with Face ID lock and encrypted albums.", tags: ["Swift", "CryptoKit"], year: "2023" },
      { title: "WeatherNow", description: "Hyper-local weather app with radar maps and severe weather alerts.", tags: ["SwiftUI", "WeatherKit"], year: "2022" },
    ],
  },
  "play-store": {
    title: "Play Store",
    description: "Android applications built for reliability.",
    projects: [
      { title: "RouteOptimizer", description: "Delivery route optimization app reducing travel time by 35%.", tags: ["Kotlin", "Google Maps API"], year: "2025" },
      { title: "FieldReport", description: "Offline-first field reporting app for construction teams.", tags: ["Kotlin", "Room DB", "WorkManager"], year: "2024" },
      { title: "InventorySync", description: "Warehouse inventory management with barcode scanning and real-time sync.", tags: ["Kotlin", "ML Kit"], year: "2024" },
      { title: "FleetTracker", description: "Real-time vehicle tracking and driver management system.", tags: ["Kotlin", "Firebase", "Maps SDK"], year: "2024" },
      { title: "TaskRunner", description: "Field service management app with job assignment and GPS tracking.", tags: ["Kotlin", "Jetpack Compose"], year: "2023" },
      { title: "SafeCheck", description: "Workplace safety inspection app with photo documentation and compliance reports.", tags: ["Kotlin", "CameraX"], year: "2023" },
      { title: "TimeSheet Pro", description: "Employee time tracking with geofencing and payroll integration.", tags: ["Kotlin", "Geofencing API"], year: "2023" },
    ],
  },
  "client-projects": {
    title: "Client Projects",
    description: "Delivered systems for businesses across industries.",
    projects: [
      { title: "DataVault Platform", description: "Enterprise data management handling 2M+ records with RBAC.", tags: ["React", "Node.js", "PostgreSQL"], year: "2025" },
      { title: "SecureVault", description: "E2E encrypted document management for legal firms.", tags: ["React", "AES-256", "AWS S3"], year: "2024" },
      { title: "PayBridge", description: "Unified payment gateway integrating Stripe, PayPal, and regional providers.", tags: ["Node.js", "Stripe API"], year: "2025" },
      { title: "LogiFlow ERP", description: "Custom ERP system for logistics company managing 500+ daily shipments.", tags: ["React", "PostgreSQL", "Docker"], year: "2024" },
      { title: "MediTrack", description: "Patient management platform for healthcare clinics with HIPAA compliance.", tags: ["React", "Node.js", "MongoDB"], year: "2024" },
      { title: "EduPortal", description: "Online learning platform with live classes and automated grading.", tags: ["React", "WebRTC", "Redis"], year: "2023" },
      { title: "PropManage", description: "Property management system with tenant portal and maintenance tracking.", tags: ["React", "Express", "PostgreSQL"], year: "2023" },
      { title: "RetailPOS", description: "Cloud-based point-of-sale system with multi-location inventory sync.", tags: ["React", "Node.js", "Stripe"], year: "2023" },
    ],
  },
};

const Portfolio = () => {
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const data = portfolioData[category || ""] || { title: "Portfolio", description: "Our work.", projects: [] };

  const totalPages = Math.ceil(data.projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = data.projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when category changes
  const currentCategory = category;
  useState(() => { setCurrentPage(1); });

  return (
    <>
      <div className="container py-24 md:py-32">
        <SectionHeader index="00" label="PORTFOLIO" title={data.title} description={data.description} />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-border pb-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/portfolio/${cat.slug}`}
              onClick={() => setCurrentPage(1)}
              className={`px-4 py-2 font-mono-label text-xs uppercase tracking-widest transition-colors duration-200 border ${
                currentCategory === cat.slug
                  ? "border-foreground text-foreground bg-foreground text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          key={`${category}-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {paginatedProjects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </motion.div>

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
              {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, data.projects.length)} of {data.projects.length}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Portfolio;

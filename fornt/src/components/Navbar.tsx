"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// No supabase

const portfolioItems = [
  { label: "Chrome Extensions", path: "/portfolio/chrome-extensions" },
  { label: "Web Tools", path: "/portfolio/web-tools" },
  { label: "App Store", path: "/portfolio/app-store" },
  { label: "Play Store", path: "/portfolio/play-store" },
  { label: "Client Projects", path: "/portfolio/client-projects" },
];

const infoItems = [
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Refund & Cancellation", path: "/refund-cancellation" },
  { label: "Refund Policy", path: "/refund-policy" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("mock_session"));
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("mock_session"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tighter">
          Code<span className="text-accent">Axe</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={`font-mono-label text-xs uppercase tracking-widest transition-colors duration-200 ${isActive("/") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Home</Link>
          <Link href="/work" className={`font-mono-label text-xs uppercase tracking-widest transition-colors duration-200 ${isActive("/work") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Work</Link>
          <Link href="/services" className={`font-mono-label text-xs uppercase tracking-widest transition-colors duration-200 ${isActive("/services") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Services</Link>

          {/* Portfolio Dropdown */}
          <div className="relative" onMouseEnter={() => setOpenDropdown("portfolio")} onMouseLeave={() => setOpenDropdown(null)}>
            <button className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1">
              Portfolio <ChevronDown size={12} strokeWidth={1.5} />
            </button>
            <AnimatePresence>
              {openDropdown === "portfolio" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 mt-2 w-48 border border-border bg-background p-2">
                  {portfolioItems.map((item) => (
                    <Link key={item.path} href={item.path} className="block px-3 py-2 font-mono-label text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200">{item.label}</Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Dropdown */}
          <div className="relative" onMouseEnter={() => setOpenDropdown("info")} onMouseLeave={() => setOpenDropdown(null)}>
            <button className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1">
              Info <ChevronDown size={12} strokeWidth={1.5} />
            </button>
            <AnimatePresence>
              {openDropdown === "info" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="absolute top-full right-0 mt-2 w-48 border border-border bg-background p-2">
                  {infoItems.map((item) => (
                    <Link key={item.path} href={item.path} className="block px-3 py-2 font-mono-label text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200">{item.label}</Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/send-request" className="bg-accent text-accent-foreground px-4 py-2.5 font-mono-label text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors duration-200 flex items-center gap-2">
                <Send size={12} /> Send Request
              </Link>
              <Link href="/dashboard" className="bg-primary text-primary-foreground px-6 py-2.5 font-mono-label text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors duration-200">Dashboard</Link>
            </div>
          ) : (
            <Link href="/login" className="bg-primary text-primary-foreground px-6 py-2.5 font-mono-label text-xs uppercase tracking-widest hover:bg-accent transition-colors duration-200">Login</Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t border-border">
            <div className="container py-6 flex flex-col gap-4">
              {[
                { label: "Home", path: "/" },
                { label: "Work", path: "/work" },
                { label: "Services", path: "/services" },
                ...portfolioItems,
                ...infoItems,
                ...(isLoggedIn
                  ? [{ label: "Dashboard", path: "/dashboard" }, { label: "Send Request", path: "/send-request" }, { label: "Profile", path: "/profile" }]
                  : [{ label: "Login", path: "/login" }, { label: "Sign Up", path: "/signup" }]),
              ].map((item) => (
                <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)} className="font-mono-label text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200">{item.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

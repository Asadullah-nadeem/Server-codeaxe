"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Send, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import * as Icons from "lucide-react";

// Helper component for dynamic Lucide Icons
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  if (!name) return null;
  const IconComponent = Icons[name as keyof typeof Icons] as React.ElementType;
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mainItems, setMainItems] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [infoItems, setInfoItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("mock_session"));
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("mock_session"));
    window.addEventListener("storage", handleStorage);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/nav`, {
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_APP_KEY || ""
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          // deduplicate by path to prevent React StrictMode double-fetch duplicates
          const dedup = (arr: any[]) => {
            const seen = new Set();
            return arr.filter((item) => {
              if (seen.has(item.path)) return false;
              seen.add(item.path);
              return true;
            });
          };
          if (res.data.mainItems?.length > 0) setMainItems(dedup(res.data.mainItems));
          if (res.data.portfolioItems?.length > 0) setPortfolioItems(dedup(res.data.portfolioItems));
          if (res.data.infoItems?.length > 0) setInfoItems(dedup(res.data.infoItems));
          if (res.data.settings) {
            setSettings((prev: any) => ({ ...prev, ...res.data.settings }));
          }
        }
      })
      .catch(err => console.error("Failed fetching nav", err));

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isActive = (path: string) => pathname === path;

  const [logoError, setLogoError] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          {settings.site_logo_url && !logoError ? (
            <img
              src={settings.site_logo_url}
              fetchPriority="high"
              decoding="async"
              alt={`${settings.site_name_prefix || 'Code'}${settings.site_name_accent || 'Axe'} Brand Logo`}
              className="h-8 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="font-display text-xl tracking-tighter">
              {settings.site_name_prefix || 'Code'} <span className="text-accent">{settings.site_name_accent || 'Axe'}</span>
            </span>
          )}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {mainItems.map((item) => (
              <Link key={`main-${item.id || item.path}`} href={item.path || '#'} className={`flex items-center gap-1.5 font-mono-label text-xs uppercase tracking-widest transition-colors duration-200 ${isActive(item.path) ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {item.icon && <DynamicIcon name={item.icon} className="w-3.5 h-3.5" />}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Portfolio Dropdown */}
          <div className="relative" onMouseEnter={() => setOpenDropdown("portfolio")} onMouseLeave={() => setOpenDropdown(null)}>
            <button aria-expanded={openDropdown === "portfolio"} aria-haspopup="true" className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1">
              {settings.nav_portfolio_label} <ChevronDown size={12} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {openDropdown === "portfolio" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 mt-2 w-48 border border-border bg-background p-2">
                  {portfolioItems.map((item) => (
                    <Link key={`portfolio-${item.id || item.path}`} href={item.path || '#'} className="flex items-center gap-2 px-3 py-2 font-mono-label text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200">
                      {item.icon && <DynamicIcon name={item.icon} className="w-3.5 h-3.5" />}
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Dropdown */}
          <div className="relative" onMouseEnter={() => setOpenDropdown("info")} onMouseLeave={() => setOpenDropdown(null)}>
            <button aria-expanded={openDropdown === "info"} aria-haspopup="true" className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1">
              {settings.nav_info_label} <ChevronDown size={12} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {openDropdown === "info" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="absolute top-full right-0 mt-2 w-48 border border-border bg-background p-2">
                  {infoItems.map((item) => (
                    <Link key={`info-${item.id || item.path}`} href={item.path || '#'} className="flex items-center gap-2 px-3 py-2 font-mono-label text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200">
                      {item.icon && <DynamicIcon name={item.icon} className="w-3.5 h-3.5" />}
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/send-request" className="bg-accent text-accent-foreground px-4 py-2.5 font-mono-label text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors duration-200 flex items-center gap-2">
                <Send size={12} /> {settings.nav_btn_send_request}
              </Link>
              <Link href="/dashboard" className="bg-primary text-primary-foreground px-6 py-2.5 font-mono-label text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors duration-200">{settings.nav_btn_dashboard}</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-6 py-2.5 font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200">{settings.nav_btn_login || "Login"}</Link>
              <Link href="/signup" className="bg-primary text-primary-foreground px-6 py-2.5 font-mono-label text-xs uppercase tracking-widest hover:bg-accent transition-colors duration-200">{settings.nav_btn_signup || "Sign Up"}</Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={20} strokeWidth={1.5} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t border-border">
            <div className="container py-6 flex flex-col gap-4">
              {[
                ...mainItems,
                ...portfolioItems,
                ...infoItems,
                ...(isLoggedIn
                  ? [{ label: settings.nav_btn_dashboard, path: "/dashboard" }, { label: settings.nav_btn_send_request, path: "/send-request" }, { label: settings.nav_btn_profile, path: "/profile" }]
                  : [{ label: settings.nav_btn_login, path: "/login" }, { label: settings.nav_btn_signup, path: "/signup" }]),
              ].map((item, i) => (
                <Link key={i + '-' + item.path} href={item.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-mono-label text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200">
                  {item.icon && <DynamicIcon name={item.icon} className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

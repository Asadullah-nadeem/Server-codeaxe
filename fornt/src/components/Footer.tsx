"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Footer = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}/footer`, {
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_APP_KEY || ""
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          // Backward compatibility check
          if (Array.isArray(res.data)) {
            if (res.data.length > 0) setSections(res.data);
          } else {
            if (res.data.sections?.length > 0) setSections(res.data.sections);
            if (res.data.settings) setSettings((prev: any) => ({ ...prev, ...res.data.settings }));
          }
        }
      })
      .catch(err => console.error("Failed fetching footer", err));
  }, []);

  return (
    <footer className="border-t border-border">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {sections.map(section => (
            <div key={section.type}>
              <h4 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">{section.title}</h4>
              <div className="flex flex-col gap-3">
                {section.links?.map((link: any, i: number) => (
                  link.is_external || link.url?.startsWith('http') || link.url?.startsWith('mailto') ? (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{link.label}</a>
                  ) : (
                    <Link key={i} href={link.url} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{link.label}</Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center">
            {settings.site_logo_url ? (
              <img
                src={settings.site_logo_url}
                alt={`${settings.site_name_prefix || 'Code'}${settings.site_name_accent || 'Axe'} Logo`}
                className="h-8 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span className="font-display text-lg tracking-tighter">
                {settings.site_name_prefix}<span className="text-accent">{settings.site_name_accent}</span>
              </span>
            )}
          </Link>
          <span className="font-mono-label text-xs text-muted-foreground text-center md:text-right" dangerouslySetInnerHTML={{ __html: settings.footer_copyright }}></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

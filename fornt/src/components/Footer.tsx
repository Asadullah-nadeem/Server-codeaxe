"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import * as Icons from "lucide-react";

// Helper component for dynamic Lucide Icons
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  if (!name) return null;
  const IconComponent = Icons[name as keyof typeof Icons] as React.ElementType;
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const Footer = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [logoError, setLogoError] = useState(false);

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

  if (settings.footer_is_visible === "0" || settings.footer_is_visible === 0) {
    return null;
  }

  return (
    <footer className="border-t border-border">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {sections.map(section => (
            <div key={section.type}>
              <h4 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">{section.title}</h4>
              <div className="flex flex-col gap-3">
                {/* Prepend Global Contact Email/Phone to the Contact Section */}
                {section.title?.toUpperCase() === 'CONTACT' && (
                  <>
                    {settings.footer_contact_email && (
                      <a href={`mailto:${settings.footer_contact_email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                        <Icons.Mail className="w-4 h-4" />
                        {settings.footer_contact_email}
                      </a>
                    )}
                    {settings.footer_contact_phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icons.Phone className="w-4 h-4" />
                        {settings.footer_contact_phone}
                      </div>
                    )}
                  </>
                )}
                {section.links?.map((link: any, i: number) => (
                  link.is_external || link.url?.startsWith('http') || link.url?.startsWith('mailto') ? (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {link.icon && <DynamicIcon name={link.icon} className="w-4 h-4" />}
                      {link.label}
                    </a>
                  ) : (
                    <Link key={i} href={link.url} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {link.icon && <DynamicIcon name={link.icon} className="w-4 h-4" />}
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center">
            {settings.site_logo_url && !logoError ? (
              <img
                src={settings.site_logo_url}
                alt={`${settings.site_name_prefix || 'Code'}${settings.site_name_accent || 'Axe'} Logo`}
                className="h-8 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-display text-lg tracking-tighter">
                {settings.site_name_prefix || 'Code'} <span className="text-accent">{settings.site_name_accent || 'Axe'}</span>
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

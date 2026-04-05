"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/footer`, {
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
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
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
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center">
              {(settings.site_footer_logo_url || settings.site_logo_url) && !logoError ? (
                  <img
                    src={settings.site_footer_logo_url || settings.site_logo_url}
                    alt={`${settings.site_name_prefix || 'Code'}${settings.site_name_accent || 'Axe'} Brand Logo`}
                    loading="lazy"
                    decoding="async"
                    className="h-8 w-auto object-contain"
                    onError={() => setLogoError(true)}
                  />
              ) : (
                <span className="font-display text-lg tracking-tighter">
                  {settings.site_name_prefix || 'Code'} <span className="text-accent">{settings.site_name_accent || 'Axe'}</span>
                </span>
              )}
            </Link>
            <div className="flex items-center flex-wrap gap-4 mt-2">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile" className="text-muted-foreground hover:text-foreground transition-colors" title="Facebook">
                  <Icons.Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" className="text-muted-foreground hover:text-foreground transition-colors" title="Twitter/X">
                  <Icons.Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="text-muted-foreground hover:text-foreground transition-colors" title="Instagram">
                  <Icons.Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="text-muted-foreground hover:text-foreground transition-colors" title="LinkedIn">
                  <Icons.Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.social_whatsapp && (
                <a href={settings.social_whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Contact" className="text-muted-foreground hover:text-foreground transition-colors" title="WhatsApp">
                  <Icons.MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube Channel" className="text-muted-foreground hover:text-foreground transition-colors" title="YouTube">
                  <Icons.Youtube className="w-4 h-4" />
                </a>
              )}
              {(() => {
                try {
                  const extra = settings.social_custom_links ? (typeof settings.social_custom_links === 'string' ? JSON.parse(settings.social_custom_links) : settings.social_custom_links) : [];
                  return Array.isArray(extra) ? extra.map((link: any, idx: number) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`External link to ${link.label}`} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1" title={link.label}>
                      <Icons.Link className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase tracking-tighter font-mono-label">{link.label}</span>
                    </a>
                  )) : null;
                } catch { return null; }
              })()}
            </div>

          </div>
          <span className="font-mono-label text-xs text-muted-foreground text-center md:text-right" dangerouslySetInnerHTML={{ __html: settings.footer_copyright }}></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Layout from "../components/Layout";
import "../index.css";

import { Metadata } from 'next';
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const fallbackMetadata: Metadata = {
    title: "CodeAxe Web Agency",
    description: "Leading Web Development & Digital Solutions Agency",
    openGraph: {
      type: 'website',
      title: 'CodeAxe Web Agency',
      description: 'Leading Web Development & Digital Solutions Agency',
    }
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nav`, {
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_APP_KEY || "",
        'Accept': 'application/json'
      }
    });

    if (!res.ok) return fallbackMetadata;

    const text = await res.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch { return fallbackMetadata; }

    if (result?.success && result?.data?.settings) {
      const {
        site_name_prefix,
        site_name_accent,
        seo_title,
        seo_description,
        site_founder_name,
        seo_google_search_console_id,
        site_favicon_url,
        site_apple_icon_url,
        seo_keywords,
        social_facebook,
        social_instagram,
        social_linkedin,
        social_twitter
      } = result.data.settings;

      const siteName = `${site_name_prefix || 'Code'}${site_name_accent || 'Axe'}`;
      const title = seo_title || siteName;
      const description = seo_description || `${siteName} Web Agency`;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://codeaxe.co.in';

      return {
        title: title,
        description: description,
        keywords: seo_keywords || undefined,
        metadataBase: new URL(baseUrl),
        alternates: {
          canonical: '/',
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
        authors: site_founder_name ? [{ name: site_founder_name }] : undefined,
        creator: site_founder_name || undefined,
        publisher: siteName,
        icons: {
          icon: site_favicon_url || '/favicon.ico',
          apple: site_apple_icon_url || '/apple-touch-icon.png',
        },
        verification: {
          google: seo_google_search_console_id || undefined,
        },
        openGraph: {
          title: title,
          description: description,
          siteName: siteName,
          locale: 'en_US',
          type: 'website',
          url: baseUrl,
        },
        twitter: {
          card: 'summary_large_image',
          title: title,
          description: description,
          creator: site_founder_name ? `@${site_founder_name.replace(/\s+/g, '')}` : undefined,
          site: social_twitter || undefined,
        },
        other: {
          'founder': site_founder_name || '',
          'facebook-page': social_facebook || '',
          'instagram-page': social_instagram || '',
          'linkedin-profile': social_linkedin || '',
        }
      };
    }
  } catch (e) {
    console.error('Failed to load SEO metatags', e);
  }

  return fallbackMetadata;
}

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let gaId = '';
  let settings: any = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nav`, {
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_APP_KEY || "",
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const text = await res.text();
      try {
        const result = JSON.parse(text);
        gaId = result?.data?.settings?.seo_google_analytics_id;
        settings = result?.data?.settings || {};
      } catch (parseError) {
        console.warn("Could not parse Nav API JSON for GA ID", parseError);
      }
    }
  } catch (e) {
    console.error("RootLayout data fetch failed (likely offline backend)", e);
  }

  const siteName = `${settings.site_name_prefix || 'Code'}${settings.site_name_accent || 'Axe'}`;

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        ) : null}
        <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": siteName,
            "url": process.env.NEXT_PUBLIC_BASE_URL || "https://codeaxe.co.in",
            "logo": settings.site_logo_url || "https://api.codeaxe.co.in/api/dms/media/RWNPiJ/12",
            "sameAs": [
              settings.social_facebook,
              settings.social_instagram,
              settings.social_linkedin,
              settings.social_twitter
            ].filter(Boolean)
          })}
        </Script>
        <TooltipProvider>
          <Layout>
            {children}
          </Layout>
        </TooltipProvider>
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}

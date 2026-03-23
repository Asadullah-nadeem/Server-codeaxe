import { Inter } from 'next/font/google';
import Script from 'next/script';
import "../index.css";
import Layout from "../components/Layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}/nav`, {
      headers: { 'X-API-KEY': process.env.NEXT_PUBLIC_APP_KEY || "" },
      next: { revalidate: 60 }
    });
    const result = await res.json();
    if (result?.success && result?.data?.settings) {
      const { 
        site_name_prefix, 
        site_name_accent, 
        seo_title, 
        seo_description, 
        site_founder_name, 
        seo_google_search_console_id 
      } = result.data.settings;
      
      const siteName = `${site_name_prefix || 'Code'}${site_name_accent || 'Axe'}`;
      const title = seo_title || siteName;
      const description = seo_description || `${siteName} Web Agency`;
      
      return {
        title: title,
        description: description,
        authors: site_founder_name ? [{ name: site_founder_name }] : undefined,
        creator: site_founder_name || undefined,
        publisher: siteName,
        verification: {
          google: seo_google_search_console_id || undefined,
        },
        openGraph: {
          title: title,
          description: description,
          siteName: siteName,
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: title,
          description: description,
          creator: site_founder_name ? `@${site_founder_name.replace(/\s+/g, '')}` : undefined,
        },
        other: {
          'founder': site_founder_name || '',
        }
      };
    }
  } catch (e) {
    console.error('Failed to load SEO metatags', e);
  }
  
  return { 
    title: "CodeAxe Web Agency", 
    description: "Leading Web Development & Digital Solutions Agency",
    openGraph: {
      type: 'website',
      title: 'CodeAxe Web Agency',
      description: 'Leading Web Development & Digital Solutions Agency',
    }
  };
}

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let gaId = '';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}/nav`, {
      headers: { 'X-API-KEY': process.env.NEXT_PUBLIC_APP_KEY || "" },
      next: { revalidate: 300 }
    });
    const result = await res.json();
    gaId = result?.data?.settings?.seo_google_analytics_id;
  } catch (e) {
    console.error("RootLayout data fetch failed", e);
  }

  return (
    <html lang="en">
      <head>
        {gaId && (
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
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>
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
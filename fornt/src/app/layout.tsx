import { Inter } from 'next/font/google';
import "../index.css";
import Layout from "../components/Layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    // We can fetch from either /footer or /nav because both controllers return seo_% settings if we add them, 
    // actually we just added it to /nav
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}/nav`, {
      headers: { 'X-API-KEY': process.env.NEXT_PUBLIC_APP_KEY || "" },
      next: { revalidate: 60 }
    });
    const result = await res.json();
    if (result?.success && result?.data?.settings) {
      const { site_name_prefix, site_name_accent, seo_title, seo_description } = result.data.settings;
      const siteName = `${site_name_prefix || 'Code'}${site_name_accent || 'Axe'}`;
      
      return {
        title: seo_title || siteName,
        description: seo_description || `${siteName} Web Agency`,
      };
    }
  } catch (e) {
    console.error('Failed to load SEO metatags', e);
  }
  
  return { title: "CodeAxe", description: "CodeAxe Web Agency" };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
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
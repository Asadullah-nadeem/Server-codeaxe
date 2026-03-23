import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY || '';

interface SeoPageConfig {
  title: string;
  description: string;
  path: string;
  keywords?: string;
}

/**
 * Fetch global site settings once and build page-specific metadata.
 * Falls back to sensible defaults if the API is unavailable.
 */
export async function generatePageMetadata(page: SeoPageConfig): Promise<Metadata> {
  let siteName = 'CodeAxe';
  let siteDesc = 'Leading Web Development & Digital Solutions Agency';
  let gaConsole: string | undefined;

  try {
    const res = await fetch(`${API}/nav`, {
      headers: { 'X-API-KEY': APP_KEY },
      next: { revalidate: 300 },
    });
    const result = await res.json();
    if (result?.success && result?.data?.settings) {
      const s = result.data.settings;
      siteName = `${s.site_name_prefix || 'Code'}${s.site_name_accent || 'Axe'}`;
      siteDesc = s.seo_description || siteDesc;
      gaConsole = s.seo_google_search_console_id;
    }
  } catch { /* use defaults */ }

  const fullTitle = `${page.title} | ${siteName}`;

  return {
    title: fullTitle,
    description: page.description || siteDesc,
    keywords: page.keywords,
    openGraph: {
      title: fullTitle,
      description: page.description || siteDesc,
      siteName,
      locale: 'en_US',
      type: 'website',
      url: `https://codeaxe.co.in${page.path}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: page.description || siteDesc,
    },
    alternates: {
      canonical: `https://codeaxe.co.in${page.path}`,
    },
    ...(gaConsole && {
      verification: { google: gaConsole },
    }),
  };
}

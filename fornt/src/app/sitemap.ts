import { MetadataRoute } from 'next'

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://codeaxe.co.in';
  const API = process.env.NEXT_PUBLIC_API_URL;
  const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY || "";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  try {
    const [servicesRes, portfolioRes] = await Promise.all([
      fetch(`${API}/services`, { headers: { 'X-API-KEY': APP_KEY } }).then(r => r.json()),
      fetch(`${API}/portfolio`, { headers: { 'X-API-KEY': APP_KEY } }).then(r => r.json()),
    ]);

    const serviceUrls = (servicesRes.data || []).map((s: any) => ({
      url: `${baseUrl}/services/${s.slug || s.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const portfolioUrls = (portfolioRes.data || []).map((p: any) => ({
      url: `${baseUrl}/portfolio/${p.slug || p.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticPages, ...serviceUrls, ...portfolioUrls];
  } catch (e) {
    return staticPages;
  }
}

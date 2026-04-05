import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://codeaxe.co.in';

  const routes = [
    { path: '', priority: 1, freq: 'daily' },
    { path: '/about', priority: 0.8, freq: 'weekly' },
    { path: '/services', priority: 0.8, freq: 'weekly' },
    { path: '/portfolio', priority: 0.9, freq: 'weekly' },
    { path: '/work', priority: 0.9, freq: 'weekly' },
    { path: '/contact', priority: 0.7, freq: 'monthly' },
    { path: '/login', priority: 0.5, freq: 'yearly' },
    { path: '/signup', priority: 0.5, freq: 'yearly' },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.freq as any,
    priority: route.priority,
  }));
}

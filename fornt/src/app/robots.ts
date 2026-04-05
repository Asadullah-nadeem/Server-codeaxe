import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/cms/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://codeaxe.co.in'}/sitemap.xml`,
  };
}

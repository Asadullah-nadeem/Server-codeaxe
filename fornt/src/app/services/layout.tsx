import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Services',
    description: 'Explore CodeAxe full-stack services — web design, app development, SEO, cloud infrastructure, and digital transformation.',
    path: '/services',
    keywords: 'web development services, app development, SEO services, cloud solutions, digital agency',
  });
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

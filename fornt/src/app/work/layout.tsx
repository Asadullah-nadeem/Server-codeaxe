import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Our Work',
    description: 'Browse CodeAxe portfolio of projects — from startups to enterprise, we deliver results across web, mobile, and SaaS.',
    path: '/work',
    keywords: 'web development portfolio, projects, case studies, digital agency work',
  });
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

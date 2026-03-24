import type { Metadata } from 'next';
export const dynamic = 'force-static';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Portfolio',
    description: 'Browse CodeAxe portfolio — web apps, mobile projects, SaaS platforms, and creative digital solutions delivered worldwide.',
    path: '/portfolio',
    keywords: 'portfolio, web projects, digital portfolio, design portfolio, app portfolio',
  });
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

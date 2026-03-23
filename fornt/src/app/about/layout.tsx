import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'About Us',
    description: 'Learn about CodeAxe — our story, our team, and the values that drive us to build exceptional digital products.',
    path: '/about',
    keywords: 'about codeaxe, web agency team, software development company, digital solutions',
  });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

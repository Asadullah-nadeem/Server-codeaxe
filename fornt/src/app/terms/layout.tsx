import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Terms of Service',
    description: 'Review the CodeAxe Terms of Service — the rules and conditions for using our website and services.',
    path: '/terms',
    keywords: 'terms of service, terms and conditions, legal, user agreement',
  });
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

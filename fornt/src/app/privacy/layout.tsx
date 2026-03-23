import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Privacy Policy',
    description: 'Read the CodeAxe Privacy Policy to understand how we collect, use, and protect your personal information.',
    path: '/privacy',
    keywords: 'privacy policy, data protection, GDPR, cookies policy',
  });
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

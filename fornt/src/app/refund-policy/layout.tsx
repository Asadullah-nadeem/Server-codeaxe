import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Refund Policy',
    description: 'Understand the CodeAxe refund and cancellation policy before purchasing our products or services.',
    path: '/refund-policy',
    keywords: 'refund policy, cancellation policy, money back, service refund',
  });
}

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

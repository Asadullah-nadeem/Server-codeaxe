import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Contact Us',
    description: 'Get in touch with CodeAxe. Start a project, ask a question, or explore how we can help grow your digital presence.',
    path: '/contact',
    keywords: 'contact codeaxe, hire web developer, start a project, web agency contact',
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

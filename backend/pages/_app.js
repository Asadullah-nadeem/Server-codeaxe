// import node module libraries
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { Analytics } from '@vercel/analytics/react';

// import theme style scss file
import 'styles/theme.scss';

// import default layouts
import DefaultDashboardLayout from 'layouts/DefaultDashboardLayout';

import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pageURL = (process.env.baseURL || 'http://localhost:3001') + router.pathname;
  const description = "Code Axe Admin Panel."
  const keywords = "CMS, Admin, Dashboard"
  
  const [settings, setSettings] = useState({
    seo_title: 'CodeAxe Admin Panel',
    site_favicon_url: '/favicon.ico',
    site_name_prefix: 'Code',
    site_name_accent: 'Axe'
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      const isAuthPage = router.pathname.startsWith('/v1/auth/');

      if (!token && !isAuthPage) {
        router.push('/v1/auth/sign-in');
      }

      // Load dynamic branding
      const loadSettings = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/nav`);
          const result = await res.json();
          if (result?.success && result.data.settings) {
            setSettings(prev => ({ ...prev, ...result.data.settings }));
          }
        } catch (error) {
          console.error("Failed to load admin branding:", error);
        }
      };
      loadSettings();
    }
  }, [router.pathname]);

  // Identify the layout
  const Layout = Component.Layout || (router.pathname.includes('dashboard') ?
  (router.pathname.includes('instructor') || router.pathname.includes('student') ?
  DefaultDashboardLayout : DefaultDashboardLayout) : DefaultDashboardLayout)

  const siteName = `${settings.site_name_prefix}${settings.site_name_accent}`;
  const displayTitle = `${settings.seo_title} | CMS Dashboard`;

  return (
    <SSRProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <link rel="icon" href={settings.site_favicon_url} />
      </Head>
      <NextSeo
        title={displayTitle}
        description={description}
        canonical={pageURL}
        openGraph={{
          url: pageURL,
          title: displayTitle,
          description: description,
          site_name: siteName
        }}
      />
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
    </SSRProvider>
  )
}

export default MyApp

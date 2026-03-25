// import node module libraries
import { Analytics } from '@vercel/analytics/react';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { useEffect, useState, useCallback, useRef } from 'react';

// import theme style scss file
import 'styles/theme.scss';

// import default layouts
import DefaultDashboardLayout from 'layouts/DefaultDashboardLayout';
import { fetchApi } from 'utils/api';

// ── Constants ──────────────────────────────────────────────────────────────────
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours

// ── Global Page Loader ─────────────────────────────────────────────────────────
// Shows a white overlay with a black spinning circle while:
//   1. The app is doing its initial auth check
//   2. Between page navigations (route transitions)
const PageLoader = ({ visible }) => {
  if (!visible) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.25s ease',
      }}
    >
      {/* Black ring spinner */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '4px solid #e5e7eb',
          borderTopColor: '#111827',
          animation: 'ca-spin 0.7s linear infinite',
        }}
      />
      <style>{`
        @keyframes ca-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ── Main App ───────────────────────────────────────────────────────────────────
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pageURL = (process.env.baseURL) + router.pathname;
  const description = 'Code Axe Admin Panel.';
  const keywords = 'CMS, Admin, Dashboard';

  // ── Branding ────────────────────────────────────────────────────────────────
  const [settings, setSettings] = useState({
    seo_title: 'CodeAxe Admin Panel',
    site_favicon_url: '/favicon.ico',
    site_name_prefix: 'Code',
    site_name_accent: 'Axe',
  });

  // ── Loader state ────────────────────────────────────────────────────────────
  // Start true so the loader covers everything on first paint
  const [appReady, setAppReady] = useState(false);
  const [routeChanging, setRouteChanging] = useState(false);
  const authChecked = useRef(false);

  // Loader is visible during initial check OR during route transitions
  const showLoader = !appReady || routeChanging;

  // ── Auth guard + branding (runs once on mount) ───────────────────────────────
  const clearSession = useCallback(() => {
    [
      'admin_token', 'admin_role', 'admin_name', 'admin_email',
      'admin_username', 'admin_login_type', 'admin_session_at',
    ].forEach((k) => localStorage.removeItem(k));
  }, []);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    if (typeof window === 'undefined') {
      setAppReady(true);
      return;
    }

    const isAuthPage = router.pathname.startsWith('/v1/auth/');
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const sessionAt = parseInt(typeof window !== 'undefined' ? localStorage.getItem('admin_session_at') || '0' : '0', 10);
    const tokenValid = token && token.length > 10;
    const sessionExpired = sessionAt && Date.now() - sessionAt > SESSION_MAX_AGE_MS;

    if (isAuthPage) {
      setAppReady(true);
    }

    if (!isAuthPage && (!tokenValid || sessionExpired)) {
      clearSession();
      const authPath = '/v1/auth/sign-in';
      if (router.pathname !== authPath && router.pathname !== '/v1/auth/sign_in') {
        router.replace(authPath).then(() => setAppReady(true));
      } else {
        setAppReady(true);
      }
      return;
    }

    // Load dynamic branding in background (don't block the loader)
    if (tokenValid && !sessionExpired) {
      fetchApi('/nav')
        .then((result) => {
          if (result?.success && result.data.settings) {
            setSettings((prev) => ({ ...prev, ...result.data.settings }));
          }
        })
        .catch(() => {}) // branding is non-critical
        .finally(() => setAppReady(true));
    } else {
      setAppReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  // ── Route transition loader ──────────────────────────────────────────────────
  useEffect(() => {
    const onStart = () => setRouteChanging(true);
    const onDone = () => setRouteChanging(false);

    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onDone);
    router.events.on('routeChangeError', onDone);

    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onDone);
      router.events.off('routeChangeError', onDone);
    };
  }, [router.events]);

  // ── Layout ──────────────────────────────────────────────────────────────────
  const Layout =
    Component.Layout ||
    (router.pathname.includes('dashboard') ? DefaultDashboardLayout : DefaultDashboardLayout);

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
          site_name: siteName,
        }}
      />

      {/* Full-screen loader — covers admin panel until auth check is done */}
      <PageLoader visible={showLoader} />

      {/* Always render the layout tree so JS/CSS loads in background */}
      <div style={{ visibility: showLoader ? 'hidden' : 'visible' }}>
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
      </div>
    </SSRProvider>
  );
}

export default MyApp;

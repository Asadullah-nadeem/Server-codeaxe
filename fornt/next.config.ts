import type { NextConfig } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchRewrites(): Promise<{ source: string; destination: string }[]> {
  const fallback = [{ source: "/_api/v1/:path*", destination: "/:path*" }];
  try {
    const res = await fetch(`${API_BASE}/rewrites`, {
      cache: "no-store",
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      console.warn(`[next.config] Rewrites API returned status ${res.status}. Using fallback.`);
      return fallback;
    }

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.warn("[next.config] Rewrites API returned invalid JSON. Using fallback.");
      return fallback;
    }

    if (json?.success && Array.isArray(json.data)) {
      console.log(`[next.config] Successfully loaded ${json.data.length} rewrite rules.`);
      return json.data.map((r: any) => ({
        source: r.source,
        destination: r.destination,
      }));
    }
  } catch (err) {
    console.warn("[next.config] Could not reach backend for rewrites — using fallback.", err);
  }

  return fallback;
}

const nextConfig: NextConfig = {
  // Use a relative path if building locally for XAMPP, otherwise use root
  basePath: process.env.LOCAL_BUILD === 'true' ? '/update-codeaxewebsite/fornt/out' : '',
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

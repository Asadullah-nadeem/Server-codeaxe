import type { NextConfig } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function fetchRewrites(): Promise<{ source: string; destination: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/rewrites`, { cache: "no-store" });
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((r: any) => ({
        source: r.source,
        destination: r.destination,
      }));
    }
  } catch (err) {
    console.warn("[next.config] Could not fetch rewrites from API — using fallback.", err);
  }

  // Hardcoded fallback in case backend is unreachable at startup
  return [{ source: "/_api/v1/:path*", destination: "/:path*" }];
}

const nextConfig: NextConfig = {
  async rewrites() {
    const rules = await fetchRewrites();
    console.log("[next.config] Loaded rewrite rules:", rules);
    return rules;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

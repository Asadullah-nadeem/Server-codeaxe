import PortfolioClient from "@/components/PortfolioClient";

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${API}/portfolio`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data.map((cat: any) => ({
        category: cat.slug,
      }));
    }
  } catch (e) {
    console.error("Failed to fetch categories for static params", e);
  }
  return [];
}

export default function Page() {
  return <PortfolioClient />;
}

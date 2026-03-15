import { Inter } from 'next/font/google';
import "../index.css";
import Layout from "../components/Layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

export const metadata = { title: "CodeAxe", description: "CodeAxe Web Agency" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          <TooltipProvider>
            <Layout>
              {children}
            </Layout>
          </TooltipProvider>
          <Toaster />
          <Sonner />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthModal from "@/components/auth/AuthModal";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SWRProvider from "@/components/SWRProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://13.201.30.242:5001/api/v1';
    const res = await fetch(`${apiUrl}/settings`, { 
      next: { revalidate: 60 } // cache for 60 seconds
    });
    
    if (res.ok) {
      const { data } = await res.json();
      return {
        title: data?.metaTitle || data?.storeName || "Kevix | Premium Mobile Accessories",
        description: data?.metaDescription || "Shop for the best quality chargers, cables, earbuds, and more.",
        keywords: data?.metaKeywords || "",
      };
    }
  } catch (error) {
    console.error("Failed to fetch metadata", error);
  }

  // Fallback metadata
  return {
    title: "Kevix | Premium Mobile Accessories",
    description: "Shop for the best quality chargers, cables, earbuds, and more.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <SWRProvider>
          <Header />
          {children}
          <AuthModal />
          <Footer />
        </SWRProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthModal from "@/components/auth/AuthModal";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arbuda | Premium Mobile Accessories",
  description: "Shop for the best quality chargers, cables, earbuds, and more.",
};

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
        <Header />
        {children}
        <AuthModal />
        <Footer />
      </body>
    </html>
  );
}

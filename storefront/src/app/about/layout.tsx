import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Kevix Store',
  description: 'Learn more about Kevix, your trusted destination for premium mobile accessories, chargers, cables, and more.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

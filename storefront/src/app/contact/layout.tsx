import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Kevix Store',
  description: 'Get in touch with Kevix for support, inquiries, or any assistance regarding our mobile accessories.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

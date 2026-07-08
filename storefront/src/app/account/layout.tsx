import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Kevix Store',
  description: 'Manage your Kevix account, view order history, update your profile, and track your shipments.',
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

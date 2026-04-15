import type { Metadata } from 'next';
import { AuthProvider } from '@/src/components/provider/AuthProvider';
import { GlobalSimpleHeader } from '@/src/features/header';
import { GlobalSimpleFooter } from '@/src/features/footer';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GlobalSimpleHeader />
      <main>{children}</main>
      <GlobalSimpleFooter />
    </AuthProvider>
  );
}

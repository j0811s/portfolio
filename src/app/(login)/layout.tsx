import { GlobalHeader } from '@/src/features/header';
import { GlobalFooter } from '@/src/features/footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalHeader />
      <main>{children}</main>
      <GlobalFooter />
    </>
  );
}

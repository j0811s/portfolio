import type { Metadata } from 'next';
import { GlobalSimpleHeader } from '@/src/features/header';
import { GlobalSimpleFooter } from '@/src/features/footer';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// SessionProvider は置かない。初回の /api/auth/session 取得がログイン時の signIn と並行すると、
// その応答が CSRF Cookie を上書きして CSRF 検証に失敗するため（ログイン画面ではセッションは不要）
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalSimpleHeader />
      <main>{children}</main>
      <GlobalSimpleFooter />
    </>
  );
}

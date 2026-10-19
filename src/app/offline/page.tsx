import styles from '@/src/styles/pages/offline.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'オフライン',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className={styles.container}>
      <p className={styles.title}>オフラインです</p>
      <p className={styles.description}>接続を確認して再読み込みしてください。</p>
      {/* react-doctor-disable-next-line react-doctor/nextjs-no-a-element -- Service Worker が返す独立ページで、全リロードで再接続を試みるため意図的に通常の a を使う */}
      <a className={styles.link} href="/">
        再読み込み
      </a>
    </div>
  );
}

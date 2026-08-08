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
      <a className={styles.link} href="/">
        再読み込み
      </a>
    </div>
  );
}

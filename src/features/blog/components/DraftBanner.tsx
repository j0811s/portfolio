import styles from '@/src/features/blog/styles/DraftBanner.module.css';
import Link from 'next/link';

export default function DraftBanner() {
  return (
    <div className={styles.banner}>
      <p className={styles.banner__text}>プレビューモードで表示中</p>
      <Link className={styles.banner__link} href="/api/draft/disable">
        プレビューを終了する
      </Link>
    </div>
  );
}

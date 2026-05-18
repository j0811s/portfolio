'use client';

import styles from '@/src/features/footer/styles/GlobalFooter.module.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const PageTop = dynamic(() => import('./PageTop'), { ssr: false });

export default function GlobalFooter() {
  return (
    <>
      <PageTop />
      <footer className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.top}>
            <Link className={styles.brand} href="/" translate="no">
              j-sato
            </Link>
            <nav className={styles.navigation}>
              <ul className={styles.navigationList}>
                <li className={styles.navigationListItem}>
                  <Link className={styles.navigationListItemLink} href="/">
                    トップページ
                  </Link>
                </li>
                <li className={styles.navigationListItem}>
                  <Link className={styles.navigationListItemLink} href="/blog/">
                    投稿
                  </Link>
                </li>
                <li className={styles.navigationListItem}>
                  <Link className={styles.navigationListItemLink} href="/contact/">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <small className={styles.copyright} translate="no">
            &copy; j-sato
          </small>
        </div>
      </footer>
    </>
  );
}

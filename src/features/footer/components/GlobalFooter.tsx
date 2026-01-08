'use client';

import styles from "@/src/features/footer/styles/GlobalFooter.module.css";
import Link from "next/link";
import dynamic from 'next/dynamic';

const PageTop = dynamic(() => import('./PageTop'), { ssr: false });

export default function GlobalFooter() {
  return (
    <>
      <PageTop />
      <footer className={`${styles.container}`}>
        <div className={styles.navigation}>
          <ul className={styles.navigationList}>
            <li className={styles.navigationListItem}>
              <Link className={`${styles.navigationListItemLink} ${styles.navigationListItemLinkHover}`} href={`/`}>
                <span>トップページ</span>
              </Link>
            </li>
            <li className={styles.navigationListItem}>
              <Link className={`${styles.navigationListItemLink} ${styles.navigationListItemLinkHover}`} href={`/blog/`}>
                <span>投稿</span>
              </Link>
            </li>
          </ul>
        </div>
        <small className={styles.copyright} translate="no">&copy; j-sato</small>
      </footer>
    </>
  )
}

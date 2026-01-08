'use client';

import styles from "@/src/features/footer/styles/GlobalFooter.module.css";
import dynamic from 'next/dynamic';

const PageTop = dynamic(() => import('./PageTop'), { ssr: false });

export default function GlobalSimpleFooter() {
  return (
    <>
      <PageTop />
      <footer className={`${styles.container}`}>
        <small className={styles.copyright} translate="no">&copy; j-sato</small>
      </footer>
    </>
  )
}

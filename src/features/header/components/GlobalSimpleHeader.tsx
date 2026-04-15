'use client';

import styles from '@/src/features/header/styles/GlobalHeader.module.css';
import { Logo } from '@/src/features/header';
import { ThemeProvider, ThemeSwitch } from '@/src/features/theme';

export default function GlobalSimpleHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div aria-hidden="true"></div>
        <Logo link={false} />
        <ThemeSwitch />
        <ThemeProvider />
      </div>
    </header>
  );
}

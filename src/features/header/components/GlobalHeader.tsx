'use client';

import styles from "@/src/features/header/styles/GlobalHeader.module.css";
import { Logo, DrawerOpenButton, DrawerCloseButton, DrawerMenu } from "@/src/features/header";
import { ThemeProvider, ThemeSwitch } from '@/src/features/theme';
import { useSession } from "next-auth/react";

export default function GlobalHeader() { 
  const { status } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {status === 'authenticated' ? <DrawerOpenButton /> : <div aria-hidden="true"></div>}
        <Logo />
        {
          status === 'authenticated' && 
            <DrawerMenu>
              <DrawerCloseButton />
            </DrawerMenu>
        }
        <ThemeSwitch />
        <ThemeProvider />
      </div>
    </header>
  )
}

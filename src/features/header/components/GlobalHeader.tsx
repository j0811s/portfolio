import styles from "@/src/features/header/styles/GlobalHeader.module.css";
import { Logo, DrawerOpenButton, DrawerCloseButton, DrawerMenu } from "@/src/features/header";
import { ThemeProvider, ThemeSwitch } from '@/src/features/theme';

export default function GlobalHeader() { 
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <DrawerOpenButton />
        <Logo />
        <DrawerMenu>
          <DrawerCloseButton />
        </DrawerMenu>
        <ThemeSwitch />
        <ThemeProvider />
      </div>
    </header>
  )
}
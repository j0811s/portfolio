import styles from "@/src/features/header/styles/GlobalHeader.module.css";
import { Logo, DrawerOpenButton, DrawerCloseButton, DrawerMenu } from "@/src/features/header";
import { ThemeProvider, ThemeSwitch } from '@/src/features/theme';
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export default async function GlobalHeader() { 
  const session = await getServerSession(authOptions);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {session ? <DrawerOpenButton /> : <div aria-hidden="true"></div>}
        <Logo />
        {
          session && 
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
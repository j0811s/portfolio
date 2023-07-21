'use client'
import {
  container, wrapper,
  navigation, navigationList, navigationListItem, navigationListItemLink
} from "./index.css"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HumburgerButton } from "../humburgerButton";
import { Logo } from "./Logo";


export const Header = () => {
  const pathname = usePathname();

  return (
    <header className={container}>
      <div className={wrapper}>
        <Logo pathname={pathname} />
        <nav className={navigation}>
          <ul className={navigationList}>
            <li className={navigationListItem}>
              <Link className={navigationListItemLink} href={`/`}>トップページ</Link>
            </li>
            <li className={navigationListItem}>
              <Link className={navigationListItemLink} href={`/about/`}>私について</Link>
            </li>
            <li className={navigationListItem}>
              <Link className={navigationListItemLink} href={`/blog/`}>ブログ</Link>
            </li>
          </ul>
        </nav>
        <HumburgerButton modClass={'js-drawerTrigger'} />
      </div>
    </header>
  )
}
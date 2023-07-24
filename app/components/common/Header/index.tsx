'use client'
import {
  container, wrapper,
  navigation, navigationList, navigationListItem, navigationListItemLink
} from "./index.css"
import Link from "next/link";
import { usePathname } from "next/navigation";
import DrawerMenu, {isMatches, isOpen} from "@/app/components/common/Modal";
import { Logo } from "./Logo";


export const Header = () => {
  const pathname = usePathname();

  const DrawerMenuOptions = {
    // initOpen: true,
    // animation: false,
    // disableMediaQuery: 'screen and (min-width: 768px)',
    // classes: {
    //   modClassName: 'mod-humb',
    // },
    // disableScroll: false,
    // on: {
    //   afterOpen: (e: Event) => {
    //     console.log('afterOpen', e)
    //   },
    //   matches: (isMatches: isMatches, isOpen: boolean) => {
    //     if (isMatches) {
    //       console.log('IS MATCHES')
    //       if (isOpen) { console.log('IS OPEN') };
    //     }
    //   }
    // }
  }

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
        
        <DrawerMenu options={DrawerMenuOptions}>
          <nav>
            <ul>
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
        </DrawerMenu>
      </div>
    </header>
  )
}
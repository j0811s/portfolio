'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBreadSlice, faUser, faFileLines, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import {
  container, wrapper,
  navigation, navigationList, navigationListItem, navigationListItemLink
} from "./index.css"

import Link from "next/link";
import { usePathname } from "next/navigation";
import DrawerMenu from "@/app/components/common/Modal";
import { Logo } from "./Logo";

export const Header = () => {
  const pathname = usePathname();
  
  const isActivePage = (pathname: string, pagename: string): boolean => pathname.startsWith(pagename);

  const DrawerMenuOptions = {
    // initOpen: true,
    // animation: false,
    disableMediaQuery: 'screen and (min-width: 960px)',
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

  const NavigationListElements = () => (
    <nav className={navigation}>
      <ul className={navigationList}>
        <li className={navigationListItem}>
          <Link className={navigationListItemLink} href={`/`} data-page-active={pathname === '/'}><FontAwesomeIcon icon={faBreadSlice} /> トップページ</Link>
        </li>
        <li className={navigationListItem}>
          <Link className={navigationListItemLink} href={`/about/`} data-page-active={isActivePage(pathname, '/about/')}><FontAwesomeIcon icon={faUser} /> 私について</Link>
        </li>
        <li className={navigationListItem}>
          <Link className={navigationListItemLink} href={`/blog/`} data-page-active={isActivePage(pathname, '/blog/')}><FontAwesomeIcon icon={faFileLines} /> ブログ</Link>
        </li>
      </ul>
    </nav>
  )

  return (
    <header className={container}>
      <div className={wrapper}>
        <Logo pathname={pathname} />
        <NavigationListElements />
        <DrawerMenu options={DrawerMenuOptions}>
          <NavigationListElements />
        </DrawerMenu>
      </div>
    </header>
  )
}
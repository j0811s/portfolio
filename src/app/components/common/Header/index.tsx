'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBreadSlice, faUser, faFileLines, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import {
  container, wrapper,
  navigation, navigationList, navigationListItem, navigationListItemLink, navigationItemIcon, navigationItemGithubIcon
} from "./index.css"

import Link from "next/link";
import { usePathname } from "next/navigation";
import DrawerMenu from "@/src/app/components/common/Modal";
import { Logo } from "./Logo";
import useDeviceType from "../../hooks/useDeviceType";
import { useEffect } from "react";
import Image from "next/image";

export const Header = () => {
  const pathname = usePathname();
  const deviceType = useDeviceType();
  
  useEffect(() => {
    if (deviceType) {
      const deviceTypeKeys = Object.keys(deviceType);

      deviceTypeKeys.forEach(key => {
        const deviceData = deviceType[key];
        const deviceDataKeys = Object.keys(deviceData);
        deviceDataKeys.forEach(dataDataKey => {
          if (deviceData[dataDataKey] === true) {
            document.body.classList.add(`is-${dataDataKey}`);
          }
        });
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType]);
  
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
      // afterOpen: (e: Event) => {
      //   console.log('afterOpen', e)
      // },
      // matches: (isMatches: isMatches, isOpen: boolean) => {
      //   if (isMatches) {
      //     console.log('IS MATCHES')
      //     if (isOpen) { console.log('IS OPEN') };
      //   }
      // }
    // }
  }

  const NavigationListElements = () => (
    <nav className={navigation}>
      <ul className={navigationList}>
        <li className={navigationListItem}>
          <Link className={navigationListItemLink} href={`/`} data-page-active={pathname === '/'}>
            <FontAwesomeIcon icon={faBreadSlice} className={navigationItemIcon} /><span>TOP</span>
          </Link>
        </li>
        <li className={navigationListItem}>
          <Link className={navigationListItemLink} href={`/about/`} data-page-active={isActivePage(pathname, '/about/')}>
            <FontAwesomeIcon icon={faUser} className={navigationItemIcon} /><span>ABOUT</span>
          </Link>
        </li>
        <li className={navigationListItem}>
          <Link className={navigationListItemLink} href={`/blog/`} data-page-active={isActivePage(pathname, '/blog/')}>
            <FontAwesomeIcon icon={faFileLines} className={navigationItemIcon} /><span>BLOG</span>
          </Link>
        </li>
        <li className={`${navigationListItem} mod-github`}>
          <Link className={navigationListItemLink} href='https://github.com/j0811s/portfolio' target="_blank">
            <div className={navigationItemGithubIcon}>
              <Image src={`/images/logo/github-mark-white.svg`} width={98} height={96} alt="GitHubリポジトリの外部リンク" />
            </div>
          </Link>
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
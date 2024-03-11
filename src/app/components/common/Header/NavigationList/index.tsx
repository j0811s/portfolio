'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBreadSlice, faUser, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { navigation, navigationList, navigationListItem, navigationListItemLink, navigationListItemLinkHover, navigationItemIcon, navigationItemGithubIcon } from "./index.css";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitch } from "../../ThemeSwitch";

export const NavigationList = ({ pathname, drawerMode }: { pathname: string, drawerMode: boolean }) => {
  const GITHUB_URL = 'https://github.com/j0811s/portfolio';
  const isActivePage = (pathname: string, currentPage: string): boolean => pathname.startsWith(currentPage);
  
  return (
    <nav className={navigation} data-drawer-mode={drawerMode}>
      <ul className={navigationList}>
        <li className={navigationListItem}>
          <Link className={`${navigationListItemLink} ${navigationListItemLinkHover}`} href={`/`} data-page-active={pathname === '/'}>
            <FontAwesomeIcon icon={faBreadSlice} className={navigationItemIcon} /><span>TOP</span>
          </Link>
        </li>
        <li className={navigationListItem}>
          <Link className={`${navigationListItemLink} ${navigationListItemLinkHover}`} href={`/about/`} data-page-active={isActivePage(pathname, '/about/')}>
            <FontAwesomeIcon icon={faUser} className={navigationItemIcon} /><span>ABOUT</span>
          </Link>
        </li>
        <li className={navigationListItem}>
          <Link className={`${navigationListItemLink} ${navigationListItemLinkHover}`} href={`/blog/`} data-page-active={isActivePage(pathname, '/blog/')}>
            <FontAwesomeIcon icon={faFileLines} className={navigationItemIcon} /><span>BLOG</span>
          </Link>
        </li>
        {
          drawerMode && 
            <li className={`${navigationListItem} mod-github`}>
              <Link className={navigationListItemLink} href={GITHUB_URL} target="_blank">
                <div className={navigationItemGithubIcon}>
                  <Image src={`/images/logo/github-mark-white.svg`} width={98} height={96} alt="GitHubリポジトリの外部リンク" />
                </div>
              </Link>
            </li>
        }
      </ul>
    </nav>
  )
}
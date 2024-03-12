'use client'

import { PageTopButton } from "../PageTopButton"
import { container, navigation, navigationList, navigationListItem, navigationListItemLink, navigationListItemLinkHover, copyright } from "./index.css"
import Link from "next/link";

export const Footer = () => {
  return (
    <>
      <PageTopButton />
      <footer className={`${container}`}>
        <div className={navigation}>
          <ul className={navigationList}>
            <li className={navigationListItem}>
              <Link className={`${navigationListItemLink} ${navigationListItemLinkHover}`} href={`/`}>
                <span>TOP</span>
              </Link>
            </li>
            <li className={navigationListItem}>
              <Link className={`${navigationListItemLink} ${navigationListItemLinkHover}`} href={`/about/`}>
                <span>ABOUT</span>
              </Link>
            </li>
            <li className={navigationListItem}>
              <Link className={`${navigationListItemLink} ${navigationListItemLinkHover}`} href={`/blog/`}>
                <span>BLOG</span>
              </Link>
            </li>
          </ul>
        </div>
        <small className={copyright}>&copy; 2023 J.Sato</small>
      </footer>
    </>
  )
}
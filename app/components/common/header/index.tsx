import {
  container, wrapper, pageTitle,
  navigation, navigationList, navigationListItem, navigationListItemLink
} from "./index.css"
import Link from "next/link";
import Image from 'next/image';
import { HumburgerButton } from "../humburgerButton";

export const Header = () => {

  return (
    <header className={container}>
      <div className={wrapper}>
        <h1 className={pageTitle}>J.Sato Portfolio</h1>
        <nav className={navigation}>
          <ul className={navigationList}>
            <li className={navigationListItem}>
              <Link className={navigationListItemLink} href={`/`}>トップページ</Link>
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
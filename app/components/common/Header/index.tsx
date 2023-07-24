'use client'
import {
  container, wrapper,
  navigation, navigationList, navigationListItem, navigationListItemLink
} from "./index.css"
import Link from "next/link";
import { usePathname } from "next/navigation";
import DrawerMenu, {isMatches, onMethodMqCallbackParams} from "@/app/components/common/Modal";
import { Logo } from "./Logo";


export const Header = () => {
  const pathname = usePathname();

  const DrawerMenuOptions = {
    // initOpen: true,
    // animation: false,
    disableMediaQuery: 'screen and (min-width: 960px)',
    // classes: {
    //   modClassName: 'mod-humb',
    // },
    // disableScroll: false,
    on: {
      // afterOpen: (e) => {
      //   console.log('merge')
      // },
      matches: (isMatches: isMatches, {modalOpen, modalClose, isOpen}: onMethodMqCallbackParams) => {
        // console.log(isMatches)
        if (isMatches) {
          if (!isOpen) return;
          // console.log('IS OPEN')
          if (isOpen && modalClose) modalClose();
        }
      }
    }
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
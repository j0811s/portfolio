'use client'

import { container, wrapper, navigationListItem, navigationListItemLink, navigationListItemLinkHover, navigationItemGithubIcon } from "./index.css"

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import useDeviceType from "../../hooks/useDeviceType";
import useMediaQuery from "../../hooks/useMediaQuery";
import { ThemeSwitch } from "@/src/app/components/common/ThemeSwitch";
import { Suspense } from 'react';
import DrawerMenu from "@/src/app/components/common/Modal";
import { Logo } from "./Logo";
import { FirstView } from "../../top/FirstView";
import { StickyNavigation } from "./StickyNavigation";
import { NavigationList } from "./NavigationList";

export const Header = () => {
  const pathname = usePathname();
  const deviceType = useDeviceType();
  const headerRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery('screen and (max-width: 959px)');
  const isDesktop = useMediaQuery('screen and (min-width: 960px)');
  
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

  useEffect(() => {
    if (headerRef?.current) {
      const header = headerRef.current;
      const headerHeight = (header instanceof HTMLElement) ? header.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
  }, [isMobile, isDesktop]);

  const DrawerMenuOptions = {
    disableMediaQuery: 'screen and (min-width: 960px)',
  }

  return (
    <>
      <header className={container} ref={headerRef}>
        <div className={wrapper}>
          <Suspense>
            <DrawerMenu options={DrawerMenuOptions}>
              <NavigationList pathname={pathname} drawerMode={true} />
            </DrawerMenu>
          </Suspense>
          <Logo pathname={pathname} />
          <div className='util-sp'>
            <ThemeSwitch />
          </div>
          <div className={`${navigationListItem} mod-github util-pc`}>
            <Link className={`${navigationListItemLink} ${navigationListItemLinkHover} mod-icon`} href='https://github.com/j0811s/portfolio' target="_blank">
              <div className={navigationItemGithubIcon}>
                <span className="sr-only">GitHubリポジトリのリンク</span>
                <svg className="util-svg" viewBox="0 0 98 96" aria-hidden="true"><use xlinkHref="#svg-github" /></svg>
              </div>
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      </header>
      {pathname === '/' && <FirstView />}
      <StickyNavigation>
        <NavigationList pathname={pathname} drawerMode={false} />
      </StickyNavigation>
    </>
  )
}
'use client'

import { container, wrapper, navigationListItem, navigationListItemLink, navigationListItemLinkHover, navigationItemGithubIcon } from "./index.css"

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
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
  // const isDesktopRange = useMediaQuery('screen and (min-width: 960px)');

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

  const DrawerMenuOptions = {
    disableMediaQuery: 'screen and (min-width: 960px)',
  }

  return (
    <Suspense>
      <header className={container}>
        <div className={wrapper}>
          <DrawerMenu options={DrawerMenuOptions}>
            <NavigationList pathname={pathname} drawerMode={true} />
          </DrawerMenu>
          <Logo pathname={pathname} />
          <div className='util-sp'>
            <ThemeSwitch />
          </div>
          <div className={`${navigationListItem} mod-github util-pc`}>
            <Link className={`${navigationListItemLink} ${navigationListItemLinkHover} mod-icon`} href='https://github.com/j0811s/portfolio' target="_blank">
              <div className={navigationItemGithubIcon}>
                <span className="sr-only">GitHubリポジトリの外部リンク</span>
                <svg className="util-svg" viewBox="0 0 98 96"><use xlinkHref="#svg-github" /></svg>
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
    </Suspense>
  )
}
'use client'
import { useEffect, useState } from "react";

/** 型定義 */
type DeviceList = {
  [key: string]: {
    [prop: string]: boolean
  }
};

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceList>({});

  useEffect(() => {
    resetDeviceType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetDeviceType = () => {
    /** デバイス 判定処理 */
    const UA: string = window.navigator.userAgent.toLowerCase();

    const isWindows = () => UA.indexOf('windows nt') !== -1;
    const isiPhone = () => UA.indexOf('iphone') > 0;
    const isiPad = () => UA.indexOf('ipad') > -1 || (UA.indexOf('macintosh') > -1 && 'ontouchend' in document);
    const isMac = () => UA.indexOf('mac os x') !== -1 && !isiPhone() && !isiPad();
    const isAndroidSP = () => (isAndroid() && UA.indexOf('mobile') > 0);
    const isAndroidTab = () => (isAndroid() && UA.indexOf('mobile') === -1);

    const isiOS = () => isiPhone() || isiPad();
    const isAndroid = () => UA.indexOf('android') > 0;

    // @ts-ignore
    const isIE = () => !!document.documentMode;

    const isTouchPoint = () => 'ontouchend' in document;
    const isSP = () => isiPhone() || isAndroidSP();
    const isTab = () => isiPad() || isAndroidTab();
    const isPC = () => !isSP() && !isTab();

    setDeviceType({
      browser: {
        ie: isIE(),
      },
      os: {
        windows: isWindows(),
        mac: isMac(),
        ios: isiOS(),
        android: isAndroid()
      },
      device: {
        touch: isTouchPoint(),
        iphone: isiPhone(),
        ipad: isiPad(),
        android_sp: isAndroidSP(),
        android_tab: isAndroidTab(),
        sp: isSP(),
        tab: isTab(),
        pc: isPC(),
      }
    })
  }
  
  return deviceType;
}

export default useDeviceType;
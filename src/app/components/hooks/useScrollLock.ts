'use client'
import { useState, useEffect } from 'react';
import useDeviceType from "./useDeviceType";

type UseScrollLock = (target?: React.RefObject<HTMLElement | null>) => {
  enable: () => void;
  disable: () => void;
  isLock: boolean;
};

const useScrollLock: UseScrollLock = (target) => {
  /** 固定の対象要素 */
  const targetElem = target?.current || null;

  /** デバイス判定 */
  const deviceType = useDeviceType();
  const isPC = deviceType?.device?.pc;
  const isiOS = deviceType?.os?.ios;
  
  /** 状態 */
  const [isLock, setIsLock] = useState(false);

  const [previousBodyPaddingRight, setPreviousBodyPaddingRight] = useState('');
  const [currentBodyPaddingRight, setCurrentBodyPaddingRight] = useState(0);
  const [scrollBarWidth, setScrollBarWidth] = useState(0);

  const [touchStartY, setToucheStartY] = useState(0);
  const [previousBodyPosition, setPreviousBodyPosition] = useState({
    position: '',
    top: '',
    left: ''
  });

  /** スクロールロックのイベント処理 */
  const enable = () => setIsLock(true);
  const disable = () => setIsLock(false);

  useEffect(() => {
    getScrollBarWidth();
    getBodyPaddingRight();
    setOverflowHidden();

    return () => {
      unsetOverflowHidden();
    }
  }, [isLock]);


  useEffect(() => {
    const setEvents = () => {
      getPreviousBodyPosition();
      setFixedBodyPosition();
      setTouchCancel();
    }
    const resetEvents = () => {
      resetFixedBodyPosition();
      unsetTouchCancel();
    }

    setEvents();

    return () => {
      resetEvents();
    }
  }, [isLock]);
    


  // 早期リターン
  if (typeof window === 'undefined') {
    return {
      enable: () => { },
      disable: () => { },
      isLock: false,
    }
  }

  const html = document.documentElement;
  const body = document.body;

  /** スクロールバーを考慮したウィンドウ幅のイベント処理 */
  const getScrollBarWidth = () => {
    if (isPC) {
      const bars = window.innerWidth - html.clientWidth;
      setScrollBarWidth(bars);
    }
  }

  const getBodyPaddingRight = () => {
    if (!isPC) return;
    if (!previousBodyPaddingRight) {
      const previousPaddingRight = body.style.paddingRight;
      setPreviousBodyPaddingRight(previousPaddingRight);
    }
    const currentPaddingRight = parseInt(window.getComputedStyle(body).getPropertyValue('padding-right'), 10);
    setCurrentBodyPaddingRight(currentPaddingRight);
  }

  const setWidthExcludingScrollBars = () => {
    getScrollBarWidth();
    getBodyPaddingRight();
  }

  const unsetWidthExcludingScrollBars = () => {
    setScrollBarWidth(0);
    setPreviousBodyPaddingRight('');
    setCurrentBodyPaddingRight(0);
  }

  // iOS以外
  const setOverflowHidden = () => {
    if (isPC && isLock) {
      setWidthExcludingScrollBars();
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${currentBodyPaddingRight + scrollBarWidth}px`;
    }
  }

  const unsetOverflowHidden = () => {
    if (isPC && isLock) {
      unsetWidthExcludingScrollBars();
      body.style.paddingRight = '';
      body.style.overflow = '';
    }
  }

  // iOS用
  const getPreviousBodyPosition = () => {
    if (isiOS && isLock) {
      setPreviousBodyPosition({
        position: body.style.position,
        top: body.style.top,
        left: body.style.left
      });
    }
  }

  const setFixedBodyPosition = () => {
    if (isiOS && isLock) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const innerHeight = window.innerHeight;

      body.style.position = 'fixed';
      body.style.top = -scrollY + 'px';
      body.style.left = -scrollX + 'px';

      setTimeout(() => {
        const bottomBarHeight = innerHeight - window.innerHeight;
        if (bottomBarHeight && scrollY >= innerHeight) {
          body.style.top = `${-(scrollY + bottomBarHeight)}`;
        }
      }, 0);
    }
  }

  const resetFixedBodyPosition = () => {
    if (isiOS && isLock) {
      const y = -parseInt(body.style.top, 10);
      const x = -parseInt(body.style.left, 10);

      body.style.position = previousBodyPosition.position;
      body.style.top = previousBodyPosition.top;
      body.style.left = previousBodyPosition.left;

      window.scrollTo(x, y);

      setPreviousBodyPosition({
        position: '',
        top: '',
        left: '',
      });
    }
  }

  const updateTouchStart = (e: TouchEvent) => {
    setToucheStartY(e.targetTouches[0].clientY);
  }

  const handleIOS = (e: TouchEvent): void => {
    const touchY = e.targetTouches[0].clientY - touchStartY;
    
    const currentScrollTop = touchY > 0 && targetElem?.scrollTop === 0;
    const currentScrollBottom = targetElem ? touchY < 0 && targetElem.scrollHeight - targetElem.scrollTop <= targetElem.clientHeight : false;
    
    if (currentScrollTop || currentScrollBottom) e.preventDefault();
    e.stopPropagation();
  }

  const setTouchCancel = (): void => {
    if (isiOS && isLock) {
      document.addEventListener('touchstart', updateTouchStart);

      const options: AddEventListenerOptions & EventListenerOptions = { passive: false };
      document.addEventListener('touchmove', handleIOS, options);
    }
  }

  const unsetTouchCancel = (): void => {
    if (isiOS && isLock) {
      document.removeEventListener('touchstart', updateTouchStart);

      const options: AddEventListenerOptions & EventListenerOptions = { passive: false };
      document.removeEventListener('touchmove', handleIOS, options);
    }
  }
  

  return {
    enable,
    disable,
    isLock
  }
}

export default useScrollLock;
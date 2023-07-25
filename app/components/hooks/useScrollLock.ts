'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useModalContext } from '@/app/context/ModalContext';
import useDeviceType from "./useDeviceType";

type UseScrollLock = () => {
  enable: () => void;
  disable: () => void;
  isLock: boolean;
};

const useScrollLock: UseScrollLock = () => {
  if (typeof window === 'undefined') {
    return {
      enable: () => { },
      disable: () => { },
      isLock: false,
    }
  }

  /** デバイス判定 */
  const deviceType = useDeviceType();
  const isPC = deviceType.device?.pc;
  const isiOS = deviceType.os?.ios;
  
  /** 状態 */
  const [isReady, setIsReady] = useState(false);
  const [isLock, setIsLock] = useState(false);

  const [previousBodyPaddingRight, setPreviousBodyPaddingRight] = useState('');
  const [currentBodyPaddingRight, setCurrentBodyPaddingRight] = useState(0);
  const [scrollBarWidth, setScrollBarWidth] = useState(0);

  const [toucheStartY, setToucheStartY] = useState(0);
  const [toucheCurrentY, setToucheCurrentY] = useState(0);

  const [isOpen, openModal, closeModal] = useModalContext();
  
  /** スクロールバーを考慮したウィンドウ幅のイベント処理 */
  const html = document.documentElement;
  const body = document.body;

  const getScrollBarWidth = () => {
    const bars = window.innerWidth - html.clientWidth;
    setScrollBarWidth(bars);
  }

  const getBodyPaddingRight = () => {
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
    body.style.paddingRight = `${currentBodyPaddingRight + scrollBarWidth}px`;
    body.style.overflow = 'hidden';
  }

  const unsetWidthExcludingScrollBars = () => {
    body.style.paddingRight = '';
    body.style.overflow = '';
    setScrollBarWidth(0);
    setPreviousBodyPaddingRight('');
    setCurrentBodyPaddingRight(0);
  }

  /** スクロールロックのイベント処理 */
  const enable = () => setIsLock(true);
  const disable = () => setIsLock(false);

 /** 副作用 */
  useEffect(() => {
    setIsReady(true);

    return () => {
      setIsReady(false);
    }
  }, []);

  useEffect(() => {
    if (isPC) {
      getScrollBarWidth();
      getBodyPaddingRight();
    }
    if (isPC && isLock) setWidthExcludingScrollBars();

    return () => {
      if (isPC && isLock) unsetWidthExcludingScrollBars();
    }
  }, [isReady, isLock]);
    

  /** return */
  return {
    enable, disable, isLock
  }
}

export default useScrollLock;

// export default class useScrollLock {
//   // 対象
//   target: HTMLElement;
//   // デバイス判定
//   iOS: boolean;
//   PC: boolean;
//   // タッチポイント
//   private toucheStartY: number;
//   private toucheCurrentY: number;
//   // ステータス
//   isLock: boolean;
//   // ウィンドウ幅
//   scrollBarWidth: number;

//   constructor(target?: any) {
//     this.target = target == null ? document.documentElement : target;

//     const device = useDeviceType();
//     this.iOS = device.is?.ios;
//     this.PC = device.is?.pc;
//     this.toucheStartY = 0;
//     this.toucheCurrentY = 0;
//     this._iOSLock = this._iOSLock.bind(this);

//     this.isLock = false;

//     this.scrollBarWidth = this._getWidthScrollBars();
//     this._setWidthExcludingScrollBars = this._setWidthExcludingScrollBars.bind(this);
//   }

//   get status(): boolean {
//     return this.isLock;
//   }

//   private _getWidthScrollBars(): number {
//     return window.innerWidth - document.documentElement.clientWidth;
//   }

//   private _setWidthExcludingScrollBars(): void {
//     const width = window.innerWidth - this.scrollBarWidth;

//     document.documentElement.style.width = `${width}px`;
//     this.target.style.width = `${width}px`;
//   }

//   private _addResize(): void {
//     window.addEventListener('resize', this._setWidthExcludingScrollBars);
//   }

//   private _removeResize(): void {
//     window.removeEventListener('resize', this._setWidthExcludingScrollBars);
//   }

//   private _iOSLock(e: TouchEvent): void {
//     this.toucheCurrentY = e.changedTouches[0].pageY;
//     const height = this.target.offsetHeight;
//     const currentScrollTop = this.toucheStartY <= this.toucheCurrentY && this.target.scrollTop === 0;
//     const currentScrollBottom =
//       this.toucheStartY >= this.toucheCurrentY && this.target.scrollHeight - this.target.scrollTop === height;

//     if (currentScrollTop || currentScrollBottom) e.preventDefault();
//   }

//   private _setTouchCancel(): void {
//     document.addEventListener('touchstart', (e) => {
//       this.toucheStartY = e.changedTouches[0].pageY;
//     });

//     const options: AddEventListenerOptions & EventListenerOptions = { passive: false };
//     document.addEventListener('touchmove', this._iOSLock, options);
//   }

//   private _unsetTouchCancel(): void {
//     const options: AddEventListenerOptions & EventListenerOptions = { passive: false };
//     document.removeEventListener('touchmove', this._iOSLock, options);
//   }

//   private _setOverflowHidden(): void {
//     if (this.PC) {
//       this._setWidthExcludingScrollBars();
//     }
//     document.documentElement.style.overflow = 'hidden';
//   }

//   private _unsetOverflowHidden(): void {
//     if (this.PC) {
//       document.documentElement.style.width = '';
//       this.target.style.width = '';
//     }
//     document.documentElement.style.overflow = '';
//   }

//   public enable(): void {
//     if (this.status) return;
//     this.iOS ? this._setTouchCancel() : this._setOverflowHidden();
//     if (this.PC) {
//       this._addResize();
//     }
//     this.isLock = true;
//   }

//   public disable(): void {
//     if (!this.status) return;
//     this.iOS ? this._unsetTouchCancel() : this._unsetOverflowHidden();
//     if (this.PC) {
//       this._removeResize();
//     }
//     this.isLock = false;
//   }
// }
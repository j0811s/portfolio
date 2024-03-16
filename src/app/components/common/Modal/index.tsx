'use client';

import merge from "ts-deepmerge";
import { btn, lines, line } from "./trigger.css";
import { modalRoot, modalAnimation, modalContainer, modalOverlay, modalWrapper } from "./index.css";

import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ContentPortal } from "./ContentPortal";
import { useModalContext } from '@/src/app/context/ModalContext';

import useModalStatus from "./hooks/useModalStatus";
import useScrollLock from "@/src/app/components/hooks/useScrollLock";
import useMediaQuery from "@/src/app/components/hooks/useMediaQuery";


/** 型 */
export type isMatches = boolean;
export type isOpen = boolean;

type onMethodCommon = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isMatches: isMatches) => void;
type onMethodMq = (isMatches: isMatches, isOpen: isOpen) => void;

type Options = {
  initOpen?: boolean;
  animation?: boolean;
  disableScroll?: boolean;
  disableMediaQuery?: string,
  classes?: {
    openClassName?: string;
    closeClassName?: string;
    modClassName?: string;
  };
  on?: {
    beforeOpen?: onMethodCommon;
    afterOpen?: onMethodCommon;
    beforeClose?: onMethodCommon;
    afterClose?: onMethodCommon;
    matches?: onMethodMq;
  };
}

type callbackProps = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mediaQueryList: isMatches) => void;

/** コンポーネント */
const defaultOptions = {
  initOpen: false,
  animation: true,
  disableScroll: true,
  disableMediaQuery: undefined,
  classes: {
    openClassName: 'add-openModal',
    closeClassName: 'add-closeModal',
    modClassName: ''
  },
  on: {
    beforeOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isMatches: isMatches) => {},
    afterOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isMatches: isMatches) => {},
    beforeClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isMatches: isMatches) => {},
    afterClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isMatches: isMatches) => { },
    matches: (isMatches: isMatches, isOpen: isOpen) => { }
  }
}

export default function GenerateModal({ options, children }: { options: Options, children?: JSX.Element }) {
  // 設定値
  const config = merge(defaultOptions, options);
  const { initOpen, animation, disableMediaQuery, classes, disableScroll } = config;
  const openClassName = classes?.openClassName;
  const closeClassName = classes?.closeClassName;
  const modClassName = classes?.modClassName;
  const animationOpenClass = 'add-openAnimation';
  const animationCloseClass = 'add-closeAnimation';
  const isMatches = useMediaQuery(disableMediaQuery);

  // ページ情報
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 要素
  const modalTriggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 状態
  const [isReady, setIsReady] = useState(false);
  const { isOpen, openModal, closeModal } = useModalStatus({ initialValue: false });
  // const [isOpen, openModal, closeModal] = useModalContext();
  const scrollLock = useScrollLock(modalRef);

  // イベント用 関数
  const cancelEvent = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { target } = e;
    // 'button'か'a'タグでなければ伝搬無効
    if (!(target instanceof HTMLButtonElement) && !(target instanceof HTMLAnchorElement)) {
      e.stopPropagation();
    }
  }

  const openEvent: callbackProps = (e, isMatches) => {
    if (config?.on?.beforeOpen) config.on.beforeOpen(e, isMatches);
    openModal();
    if (config?.on?.afterOpen) config.on.afterOpen(e, isMatches);
  }

  const closeEvent: callbackProps = (e, isMatches) => {
    if (config?.on?.beforeClose) config.on.beforeClose(e, isMatches);
    closeModal();
    if (config?.on?.afterClose) config.on.afterClose(e, isMatches);
  }

  const toggleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    isOpen ? closeEvent(e, isMatches) : openEvent(e, isMatches);
  }

  const scrollLockEnable = () => {
    if (disableScroll && isOpen) scrollLock.enable();
  }
  const scrollLockDisable = () => {
    if (disableScroll && isOpen) scrollLock.disable();
  }
  
  // 初期化
  useEffect(() => {
    setIsReady(true);
    if (initOpen) openModal();

    return () => {
      setIsReady(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL監視
  useEffect(() => {
    if (!isReady) return;
    closeModal();
    setTimeout(() => {
      window.scrollTo({
        top: 0,
      });
    }, 100)
  }, [pathname, searchParams, isMatches]);

  // matchMedia
  useEffect(() => {
    if (!isReady) return;
    if (config?.on?.matches) config.on.matches(isMatches, isOpen);
  }, [isMatches]);

  // モーダルコンテンツ操作
  useEffect(() => {
    if (!isReady) return;
    scrollLockEnable();

    if (openClassName && closeClassName) {
      modalTriggerRef.current?.classList.add(isOpen ? openClassName : closeClassName);
    }
    
    const modalAnimationEvent = () => {
      if (isOpen) return;
      modalRef.current?.classList.remove(animationOpenClass);
      modalRef.current?.classList.remove(animationCloseClass);
    }

    if (animation) {
      modalRef.current?.classList.add(isOpen ? animationOpenClass : animationCloseClass);
      modalRef.current?.addEventListener('animationend', modalAnimationEvent);
    }
    
    return () => {
      scrollLockDisable();
      if (animation && isOpen) {
        modalRef.current?.removeEventListener('animationend', modalAnimationEvent);
      }
    }
  }, [isOpen, scrollLock.isLock]);


  // トリガー要素
  const ModalTrigger = useCallback(() => {
    return (
      isReady && 
      <button className={`${btn}`} type="button" onClick={toggleOpen} ref={modalTriggerRef} aria-label="メニューを開く">
        <div className={lines}>
          <span className={line}></span>
          <span className={line}></span>
          <span className={line}></span>
        </div>
      </button>
    )
  }, [isReady, isOpen])
    
  // コンテンツ要素
  const ModalContent = useCallback(({ children }: { children?: JSX.Element }) => {
    const condition = animation ? (isReady) : (isReady && isOpen);

    return (
      condition && 
      <ContentPortal>
        <div className={`${modalRoot} ${modalAnimation} ${modClassName} ${isOpen ? 'add-open' : ''}`} ref={modalRef} role="dialog" aria-modal onClick={cancelEvent}>
          <div className={modalOverlay} onClick={closeModal}></div>
            <div className={modalContainer}>
              <div className={modalWrapper}>
                {children}
              </div>
            </div>
        </div>
      </ContentPortal>
    )
  }, [isReady, isOpen])

  return (
    <>
      <ModalTrigger />
      <ModalContent>{children}</ModalContent>
    </>
  )
}
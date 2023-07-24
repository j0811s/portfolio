'use client';

import merge from "ts-deepmerge";
import { btn, lines, line, textContainer, text } from "./trigger.css";
import { modalAnimation, modalContainer, modalOverlay, modalWrapper, modalInner } from "./index.css";
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from "react";
import { ContentPortal } from "./ContentPortal";
import useModalStatus from "./hooks/useModalStatus";
// import useScrollLock from "@/app/components/hooks/useScrollLock";
import useMediaQuery from "@/app/components/hooks/useMediaQuery";

/** 型 */
export type isMatches = boolean;
export type isOpen = boolean;

type onMethodCommon = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isMatches: isMatches) => void;

export type onMethodMqCallbackParams = {
  modalOpen?: () => void;
  modalClose?: () => void;
  isOpen?: isOpen;
}
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
    openClassName: 'add-modalOpen',
    closeClassName: 'add-modalClose',
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
  const isMatches = disableMediaQuery ? useMediaQuery(disableMediaQuery) : false;

  // ページ情報
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 状態
  const [isReady, setIsReady] = useState(false);
  const { isOpen, modalOpen, modalClose } = useModalStatus({ initialValue: false });

  // 要素
  const modalTriggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
    modalOpen();
    if (config?.on?.afterOpen) config.on.afterOpen(e, isMatches);
  }

  const closeEvent: callbackProps = (e, isMatches) => {
    if (config?.on?.beforeClose) config.on.beforeClose(e, isMatches);
    modalClose();
    if (config?.on?.afterClose) config.on.afterClose(e, isMatches);
  }

  const toggleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    isOpen ? closeEvent(e, isMatches) : openEvent(e, isMatches);
  }
  
  // 初期化
  useEffect(() => {
    setIsReady(true);
    if (initOpen) modalOpen();

    return () => {
      setIsReady(false);
    }
  }, []);

  // URL監視
  useEffect(() => {
    if (!isReady) return;
    modalClose();
  }, [pathname, searchParams, isMatches]);

  // matchMedia
  useEffect(() => {
    if (!isReady) return;
    if (config?.on?.matches) config.on.matches(isMatches, isOpen);
  }, [isMatches]);

  // モーダルコンテンツ操作
  useEffect(() => {
    if (!isReady) return;
    
    if (disableScroll) {
      document.body.classList[isOpen ? "add" : "remove"]('add-disableScroll');
    }

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
      if (animation && isOpen) {
        modalRef.current?.removeEventListener('animationend', modalAnimationEvent);
      }
    }
  }, [isOpen]);


  // トリガー要素
  const ModalTrigger = () => {
    return (
      isReady && 
      <button className={`${btn}`} type="button" onClick={toggleOpen} ref={modalTriggerRef}>
        <div className={lines}>
          <span className={line}></span>
          <span className={line}></span>
          <span className={line}></span>
        </div>
        <div className={textContainer}>
          <span className={text}>開く</span>
          <span className={text}>閉じる</span>
        </div>
      </button>
    )
  }
    
  // コンテンツ要素
  const ModalContent = ({ children }: { children?: JSX.Element }) => {
    const condition = animation ? (isReady) : (isReady && isOpen);

    return (
      condition &&
      <ContentPortal insertElement={document?.body} >
        <div className={`${modalAnimation} ${modClassName}`} ref={modalRef}>
          <div className={modalOverlay} onClick={modalClose}></div>
          <div className={`${modalContainer}`} onClick={modalClose}>
            <div className={modalWrapper} onClick={cancelEvent}>
              <div className={modalInner}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </ContentPortal>
    )
  }

  return (
    <>
      <ModalTrigger />
      <ModalContent>{children}</ModalContent>
    </>
  )
}
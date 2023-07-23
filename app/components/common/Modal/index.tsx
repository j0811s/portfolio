'use client';

import merge from "ts-deepmerge";
import { btn, lines, line, textContainer, text } from "./trigger.css";
import { modalAnimation, modalContainer, modalOverlay, modalWrapper } from "./index.css";
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from "react";
import { ContentPortal } from "./ContentPortal";
import useModalStatus from "./hooks/useModalStatus";
import useScrollLock from "@/app/components/common/hooks/useScrollLock";

/** 型 */
type Options = {
  initOpen?: boolean;
  animation?: boolean;
  classes?: {
    openClassName?: string;
    closeClassName?: string;
    modClassName?: string;
  };
  disableScroll?: boolean;
  on?: {
    beforeOpen?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
    afterOpen?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
    beforeClose?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
    afterClose?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {}
  };
}


/** コンポーネント */
const defaultOptions = {
  initOpen: false,
  animation: true,
  classes: {
    openClassName: 'add-modalOpen',
    closeClassName: 'add-modalClose',
    modClassName: ''
  },
  disableScroll: true,
  on: {
    beforeOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
    afterOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
    beforeClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
    afterClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {}
  }
}

export default function GenerateModal({ options, children }: {options: Options, children?: JSX.Element} ) {
  // 設定値
  const config = merge(defaultOptions, options);
  const { initOpen, animation, classes, disableScroll } = config;
  const openClassName = classes?.openClassName;
  const closeClassName = classes?.closeClassName;
  const modClassName = classes?.modClassName;
  const animationOpenClass = 'add-openAnimation';
  const animationCloseClass = 'add-closeAnimation';

  // ページ情報
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 状態
  const [isReady, setIsReady] = useState(false);
  const { isOpen, modalOpen, modalClose } = useModalStatus({ initialValue: initOpen });

  // 要素
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // イベント用 関数
  const cancelEvent = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { target } = e;
    // 'button'か'a'タグでなければ伝搬無効
    if (!(target instanceof HTMLButtonElement) && !(target instanceof HTMLAnchorElement)) {
      e.stopPropagation();
    }
  }

  const openEvent = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (config?.on?.beforeOpen) config.on.beforeOpen(e);
    modalOpen();
    if (config?.on?.afterOpen) config.on.afterOpen(e);
  }

  const closeEvent = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (config?.on?.beforeClose) config.on.beforeClose(e);
    modalClose();
    if (config?.on?.afterClose) config.on.afterClose(e);
  }

  const toggleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    isOpen ? closeEvent(e) : openEvent(e);
  }
  
  // 初期化
  useEffect(() => {
    setIsReady(true);
    return () => {
      setIsReady(false);
    }
  }, []);

  // URL監視
  useEffect(() => {
    if (!isReady) return;
    modalClose();
  }, [pathname, searchParams])

  // モーダルコンテンツ操作
  useEffect(() => {
    if (disableScroll) {
      document.body.classList[isOpen ? "add" : "remove"]('add-disableScroll');
    }

    if (openClassName && closeClassName) {
      modalBtnRef.current?.classList.add(isOpen ? openClassName : closeClassName);
    }
    
    const modalAnimationEvent = () => {
      if (isOpen) return;
      modalRef.current?.classList.remove(animationOpenClass);
      modalRef.current?.classList.remove(animationCloseClass);
    }

    if (!animation) return;
    modalRef.current?.classList.add(isOpen ? animationOpenClass : animationCloseClass);
    modalRef.current?.addEventListener('animationend', modalAnimationEvent);
    
    return () => {
      if (animation && isOpen) {
        modalRef.current?.removeEventListener('animationend', modalAnimationEvent);
      }
    }
  }, [isOpen]);

  // トリガー要素
  const ModalTrigger = () => {
    return (
      <button className={`${btn}`} type="button" onClick={toggleOpen} ref={modalBtnRef}>
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
    return condition &&
      <ContentPortal insertElement={document.body} >
        <div className={`${modalAnimation} ${modClassName}`} ref={modalRef}>
          <div className={modalOverlay} onClick={modalClose}></div>
          <div className={`${modalContainer}`} onClick={modalClose}>
            <div className={modalWrapper} onClick={cancelEvent}>
              {children}
            </div>
          </div>
        </div>
      </ContentPortal>
  }

  return (
    <>
      <ModalTrigger />
      <ModalContent>{children}</ModalContent>
    </>
  )
}
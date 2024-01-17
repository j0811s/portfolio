'use client';

import { useEffect, useRef, useState } from "react";
import { container } from "./index.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

export const PageTopButton = () => {
  const isProcessing = useRef(false); 
  const [displayed, setDisplayed] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("scroll", toggleDisplayed);
    return () => {
      window.removeEventListener("scroll", toggleDisplayed);
    };
  }, []);

  const toggleDisplayed = () => {
    const basePosition = 0;
    const scrollPosition = window.scrollY;
    setDisplayed(basePosition < scrollPosition);
  };
  
  const scrollToPageTop = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    if (isProcessing.current) return;
    isProcessing.current = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isProcessing.current = false;
    }, 800);
  }

  const Button = (displayed: boolean = false) => (
    <button className={`${container} ${displayed ? 'add-show' : 'add-hide'}`} onClick={scrollToPageTop} type="button" aria-label="ページトップへ戻る">
      <FontAwesomeIcon icon={faChevronUp} />
    </button>
  )

  return Button(displayed)
}
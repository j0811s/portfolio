'use client';

import { useRef } from "react";

export function usePageTop() {
  const isProcessing = useRef(false);

  const scrollToTop = () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      isProcessing.current = false;
    }, 800);
  };

  return { scrollToTop };
}

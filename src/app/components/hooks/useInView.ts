'use client';

import { useState, useEffect } from "react";

const useInView = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit,
  once: boolean
): boolean => {

  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    const handler = ([ entry ]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      setIsVisible(entry.isIntersecting);
      if (once && entry.isIntersecting) observer.unobserve(entry.target);
    }
    const observer = new IntersectionObserver(handler, options);
    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
        // observer.disconnect();
      }
    }
  }, [ref.current, options.threshold, options.root, options.rootMargin]);

  return isVisible
}

export default useInView;
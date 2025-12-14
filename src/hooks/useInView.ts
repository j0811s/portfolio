'use client';

import { useState, useEffect, useMemo } from "react";

interface UseInViewProps extends IntersectionObserverInit {
  ref: React.RefObject<HTMLElement | null>;
  once?: boolean;
}

type UseInView = (props: UseInViewProps) => boolean;

const useInView: UseInView = ({ ref, once = false, ...options }): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (once && entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      },
      options
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    }
  }, [ref, options, once]);

  return isVisible
}

export default useInView;
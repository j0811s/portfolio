'use client';

import { useState, useEffect, useMemo } from 'react';

interface UseInViewProps extends IntersectionObserverInit {
  ref: React.RefObject<HTMLElement | null>;
  once?: boolean;
}

type UseInView = (props: UseInViewProps) => boolean;

const useInView: UseInView = ({ ref, once = false, ...options }): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { root, rootMargin, threshold } = options;
  const memoOptions = useMemo(
    () => ({ root, rootMargin, threshold }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [root, rootMargin, threshold]
  );

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
    }, memoOptions);

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [ref, memoOptions, once]);

  return isVisible;
};

export default useInView;

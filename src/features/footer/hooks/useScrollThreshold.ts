'use client';

import { useEffect, useState } from 'react';

export function useScrollThreshold(threshold = 0) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setPassed(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return passed;
}

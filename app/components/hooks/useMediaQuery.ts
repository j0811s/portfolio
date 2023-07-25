'use client'
import { useState, useEffect } from 'react';

type UseMediaQuery = (mq: string) => boolean;

const useMediaQuery: UseMediaQuery = (mq) => {
  const getMatches = (mq: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(mq).matches;
    }
    return false;
  }

  const [matches, setMatches] = useState<boolean>(getMatches(mq));

  const handleChange = () => setMatches(getMatches(mq));

  useEffect(() => {
    const matchMedia = window.matchMedia(mq);

    handleChange()
    matchMedia.addEventListener('change', handleChange);

    return () => matchMedia.removeEventListener('change', handleChange);
  }, [mq]);

  return matches;
}

export default useMediaQuery;
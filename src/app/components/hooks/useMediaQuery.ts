'use client'
import { useState, useEffect } from 'react';

type UseMediaQuery = (mq?: string) => boolean;

const useMediaQuery: UseMediaQuery = (mq) => {
  const getMatches = (mq?: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(mq as string).matches;
    }
    return false;
  }

  const [matches, setMatches] = useState<boolean>(getMatches(mq));

  useEffect(() => {
    const matchMedia = window.matchMedia(mq as string);
    const handleChange = () => setMatches(getMatches(mq));

    handleChange()
    matchMedia.addEventListener('change', handleChange);

    return () => matchMedia.removeEventListener('change', handleChange);
  }, [mq]);


  if (!mq) return false;

  return matches;
}

export default useMediaQuery;
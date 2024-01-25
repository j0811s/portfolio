'use client'
import { useState, useEffect } from 'react';

type UseMediaQuery = (mq?: string) => boolean;

const useMediaQuery: UseMediaQuery = (mq) => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const getMatches = (mq?: string): boolean => window.matchMedia(mq as string).matches;
    const matchMedia = window.matchMedia(mq as string);
    const handleChange = () => setMatches(getMatches(mq));

    handleChange()
    matchMedia.addEventListener('change', handleChange);

    return () => matchMedia.removeEventListener('change', handleChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (!mq) return false;

  return matches;
}

export default useMediaQuery;
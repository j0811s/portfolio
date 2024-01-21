'use client'
import { useState, useEffect } from "react";

const useCursorPosition = () => {
  const [cursorPosition, setCursorPosition] = useState<{x: number, y:number}>({ x: 0, y: 0 });
  
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      // document.documentElement.style.setProperty('--x', String(e.clientX));
      // document.documentElement.style.setProperty('--y', String(e.clientY));
    }

    document.documentElement.addEventListener('pointermove', updatePosition);
    return () => {
      document.documentElement.removeEventListener('pointermove', updatePosition);
    }
  }, []);

  return cursorPosition;
}

export default useCursorPosition;
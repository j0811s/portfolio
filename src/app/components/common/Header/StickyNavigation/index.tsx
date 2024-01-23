'use client';

import { navigationWrapper } from "./index.css";
import { useEffect } from "react";
import useCursorPosition from "../../../hooks/useCursorPosition";

export const StickyNavigation = ({ children }: { children: React.ReactNode }) => {
  const cursorPosition = useCursorPosition();

  useEffect(() => {
    document.documentElement.style.setProperty('--x', String(cursorPosition.x));
    document.documentElement.style.setProperty('--y', String(cursorPosition.y));
  }, [cursorPosition])
  
  return (
    <div className={navigationWrapper}>
      { children }
    </div>
  )
}
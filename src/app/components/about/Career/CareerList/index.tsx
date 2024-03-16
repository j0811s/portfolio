'use client';

import { wrapper } from "./index.css";
import { useRef } from "react";
import useInView from "../../../hooks/useInView";

export const CareerList = ({ children }: { children: React.ReactNode }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(divRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  }, true);

  return <div className={wrapper} ref={divRef} data-in-view={isInView}>{children}</div>;
}
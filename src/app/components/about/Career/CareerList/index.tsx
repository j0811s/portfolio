'use client';

import { wrapper } from "./index.css";
import { useRef } from "react";
import useInView from "../../../hooks/useInView";

export const CareerList = ({ children }: { children: React.ReactNode }) => {
  const dlRef = useRef<HTMLDListElement>(null);
  const isInView = useInView(dlRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  }, true);

  return <dl className={wrapper} ref={dlRef} data-in-view={isInView}>{children}</dl>;
}
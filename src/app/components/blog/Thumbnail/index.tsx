'use client';

import { postListEyecatchContainer, postListEyecatch } from './index.css';
import Image from 'next/image';
import useInView from "@/src/app/components/hooks/useInView";
import { useRef } from "react";

export const Thumbnail = ({ isDummy, src, width, height }: { isDummy: boolean, src: string, width?: number, height?: number }) => {
  const thumbnailRef = useRef<HTMLElement>(null);
  const isInView = useInView(thumbnailRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  }, true);
  
  return (
    <figure className={postListEyecatchContainer} ref={thumbnailRef} data-in-view={isInView}>
      {
        isDummy
          ? <Image className={postListEyecatch} src="/images/blog/dummy.png" alt="" width="375" height="210" />
          : <Image className={postListEyecatch} src={src} alt="" width={width} height={height} />
      }
    </figure>
  )
}
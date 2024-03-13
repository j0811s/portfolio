'use client';

import { postListEyecatchContainer, postListEyecatch } from './index.css';
import Image from 'next/image';
import useInView from "@/src/app/components/hooks/useInView";
import { useRef } from "react";

interface Props extends React.ComponentPropsWithoutRef<'figure'> {
  isDummy: boolean,
  src: string,
  width?: number,
  height?: number
}

export const Thumbnail = ({ isDummy, src, width, height, className }: Props) => {
  const thumbnailRef = useRef<HTMLElement>(null);
  const isInView = useInView(thumbnailRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0
  }, true);

  const addImageLoadedClass: React.ReactEventHandler<HTMLImageElement> = e => {
    thumbnailRef.current?.classList.add('loaded');
  }
  
  return (
    <figure className={`${postListEyecatchContainer} ${className}`} ref={thumbnailRef} data-in-view={isInView}>
      {
        isDummy
          ? <Image className={postListEyecatch} src="/images/blog/dummy.png" alt="" width="375" height="210" onLoad={addImageLoadedClass} />
          : <Image className={postListEyecatch} src={src} alt="" width={width} height={height} onLoad={addImageLoadedClass} />
      }
    </figure>
  )
}
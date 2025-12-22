'use client'

import styles from '@/src/features/blog/styles/Eyecatch.module.css';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { SkeletonImage } from '@/src/features/skeleton';
import PlaceholderImage from '@/src/features/blog/components/PlaceholderImage';

interface Props extends React.ComponentPropsWithoutRef<'figure'> {
  src?: string,
  width?: number,
  height?: number
}

function Eyecatch({ src, width, height, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className={clsx(styles.postListEyecatchContainer, className)}>
      {!src && <PlaceholderImage />}

      {src && !loaded && <SkeletonImage />}

      {src && (
        <Image
          className={clsx(
            styles.postListEyecatch,
            loaded && styles.isLoaded
          )}
          src={src}
          alt=""
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
        />
      )}
    </figure>
  )
}

export default Eyecatch;

'use client'

import clsx from 'clsx';
import Image from 'next/image';
import styles from '@/src/features/blog/styles/Eyecatch.module.css';

interface Props extends React.ComponentPropsWithoutRef<'figure'> {
  isDummy: boolean,
  src: string,
  width?: number,
  height?: number
}

function Eyecatch({ isDummy, src, width, height, className }: Props) {
  return (
    <figure className={clsx(`${styles.postListEyecatchContainer} ${className}`)}>
      {
        isDummy
          ? <Image className={styles.postListEyecatch} src="/images/blog/dummy.png" alt="" width="375" height="210" onLoad={() => {}} />
          : <Image className={styles.postListEyecatch} src={src} alt="" width={width} height={height} onLoad={() => {}} />
      }
    </figure>
  )
}

export default Eyecatch;

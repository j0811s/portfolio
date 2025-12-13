import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/src/styles/button/CtaButton.module.css';
import Link from 'next/link';
import { faArrowLeftLong, faArrowRightLong, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { ButtonLinkProps } from '@/src/types/CtaButton.types';

export default function CtaLinkButton({
  prevIcon = false,
  nextIcon = false,
  crossIcon = false,
  children,
  ...linkProps
}: ButtonLinkProps) {

  const PrevIcon = () => (<FontAwesomeIcon icon={faArrowLeftLong} className={styles.icon} />);
  const NextIcon = () => (<FontAwesomeIcon icon={faArrowRightLong} className={styles.icon} />);
  const CrossIcon = () => (<FontAwesomeIcon icon={faXmark} className={styles.icon} />);

  return (
    <Link
      {...linkProps}
      className={clsx(styles.button, linkProps.className)}
    >
      {crossIcon && <CrossIcon />}
      {prevIcon && !nextIcon && <PrevIcon />}
      {children}
      {!prevIcon && nextIcon && <NextIcon />}
    </Link>
  )
}
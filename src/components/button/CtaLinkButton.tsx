import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/src/styles/components/button/CtaButton.module.css';
import Link from 'next/link';
import { faArrowLeftLong, faArrowRightLong, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { ButtonLinkProps } from '@/src/components/types/CtaButton.types';

const PrevIcon = () => (<FontAwesomeIcon icon={faArrowLeftLong} className={styles.icon} />);
const NextIcon = () => (<FontAwesomeIcon icon={faArrowRightLong} className={styles.icon} />);
const CrossIcon = () => (<FontAwesomeIcon icon={faXmark} className={styles.icon} />);

export default function CtaLinkButton({
  prevIcon = false,
  nextIcon = false,
  crossIcon = false,
  asLink = true,
  children,
  ...linkProps
}: ButtonLinkProps) {

  return (
    asLink ?
      <Link
        {...linkProps}
        className={clsx(styles.button, linkProps.className)}
      >
        {crossIcon && <CrossIcon />}
        {prevIcon && !nextIcon && <PrevIcon />}
        {children}
        {!prevIcon && nextIcon && <NextIcon />}
      </Link> :
      <div className={clsx(styles.button, linkProps.className)}>
        {crossIcon && <CrossIcon />}
        {prevIcon && !nextIcon && <PrevIcon />}
        {children}
        {!prevIcon && nextIcon && <NextIcon />}
      </div>
  )
}
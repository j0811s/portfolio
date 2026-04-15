import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '@/src/components/styles/ui/CtaButton.module.css';
import { faArrowLeftLong, faArrowRightLong, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { ButtonActionProps } from '@/src/components/types/CtaButton.types';

const PrevIcon = () => <FontAwesomeIcon icon={faArrowLeftLong} className={styles.icon} />;
const NextIcon = () => <FontAwesomeIcon icon={faArrowRightLong} className={styles.icon} />;
const CrossIcon = () => <FontAwesomeIcon icon={faXmark} className={styles.icon} />;

export default function CtaActionButton({
  prevIcon = false,
  nextIcon = false,
  crossIcon = false,
  children,
  ...buttonProps
}: ButtonActionProps) {
  return (
    <button {...buttonProps} className={clsx(styles.button, buttonProps.className)}>
      {crossIcon && <CrossIcon />}
      {prevIcon && !nextIcon && <PrevIcon />}
      {children}
      {!prevIcon && nextIcon && <NextIcon />}
    </button>
  );
}

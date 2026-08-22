import clsx from 'clsx';
import styles from '@/src/components/styles/ui/LoadingSpinner.module.css';

type Props = {
  fullscreen?: boolean;
};

export default function LoadingSpinner({ fullscreen = true }: Props) {
  return (
    <div
      className={clsx(styles.container, !fullscreen && styles.inline)}
      role="status"
      aria-label="読み込み中"
    >
      <div className={styles.disc}>
        <div className={styles.ring}></div>
      </div>
    </div>
  );
}

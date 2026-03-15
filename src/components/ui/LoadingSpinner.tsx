import styles from '@/src/components/styles/ui/LoadingSpinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={styles.container} role="status" aria-label="読み込み中">
      <div className={styles.spinner}>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
      </div>
    </div>
  )
}

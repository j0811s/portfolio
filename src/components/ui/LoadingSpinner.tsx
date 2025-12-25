import styles from '@/src/components/styles/ui/LoadingSpinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  )
}

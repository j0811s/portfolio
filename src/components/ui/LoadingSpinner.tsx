import styles from '@/src/styles/components/ui/LoadingSpinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  )
}

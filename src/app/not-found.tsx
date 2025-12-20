import styles from '@/src/styles/pages/not-found.module.css';

export default function NotFound() {
  return (
    <section className={styles.container}>
      <hgroup>
        <h1 className={styles.pageTitle}>404 | Page Not Found</h1>
        <p className={styles.pageSubTitle}>ご指定のページが見つかりませんでした。</p>
      </hgroup>
    </section>
  );
}
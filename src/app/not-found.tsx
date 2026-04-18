import styles from '@/src/styles/pages/not-found.module.css';
import { SectionTitle } from '@/src/components';
import { AuthProvider } from '@/src/components/provider/AuthProvider';
import { GlobalHeader } from '@/src/features/header';
import { GlobalFooter } from '@/src/features/footer';
import { NotFoundTerminal } from '@/src/features/not-found';

export default function NotFound() {
  return (
    <AuthProvider>
      <GlobalHeader />
      <main>
        <section className={styles.container}>
          <hgroup className={styles.titleWrapper}>
            <p className={styles.errorCode}>404</p>
            <SectionTitle title="ページが見つかりませんでした" level={1} />
          </hgroup>
          <div className={styles.terminalWrapper}>
            <NotFoundTerminal />
          </div>
        </section>
      </main>
      <GlobalFooter />
    </AuthProvider>
  );
}

import styles from '@/src/styles/pages/not-found.module.css';
import { CtaLinkButton, SectionTitle } from '@/src/components';
import { AuthProvider } from '@/src/components/provider/AuthProvider';
import { GlobalHeader } from '@/src/features/header';
import { GlobalFooter } from '@/src/features/footer';

export default function NotFound() {
  return (
    <AuthProvider>
      <GlobalHeader />
      <main>
        <section className={styles.container}>
          <p className={styles.errorCode}>404</p>
          <div className={styles.titleWrapper}>
            <SectionTitle title="Page Not Found" level={1} />
            <p className={styles.pageSubTitle}>ご指定のページが見つかりませんでした。</p>
            <div className={styles.divider} />
          </div>
          <div className={styles.btn}>
            <CtaLinkButton href={'/'} prevIcon={true}>
              トップページに戻る
            </CtaLinkButton>
            <CtaLinkButton href={'/blog/'} nextIcon={true}>
              投稿を見る
            </CtaLinkButton>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </AuthProvider>
  );
}

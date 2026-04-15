import styles from '@/src/styles/pages/not-found.module.css';
import { CtaLinkButton, SectionTitle } from '@/src/components';

export default function NotFound() {
  return (
    <section className={styles.container}>
      <SectionTitle title="404 | Page Not Found" level={1} />
      <p className={styles.pageSubTitle}>ご指定のページが見つかりませんでした。</p>
      <div className={styles.btn}>
        <CtaLinkButton href={'/'} prevIcon={true}>
          トップページに戻る
        </CtaLinkButton>
        <CtaLinkButton href={'/blog/'} nextIcon={true}>
          投稿へ進む
        </CtaLinkButton>
      </div>
    </section>
  );
}

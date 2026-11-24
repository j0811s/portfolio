'use client';

import styles from '@/src/styles/pages/error.module.css';
import { CtaActionButton, CtaLinkButton, SectionTitle } from '@/src/components';
import { SITE_META } from '@/src/constants/site';

type Props = {
  error: unknown;
  retry: () => void;
};

/**
 * (login) 配下のページで起きた予期しないエラーの画面。
 * microCMS の一時的な障害などで、キャッシュの無いページの生成に失敗したときに表示される。
 * ヘッダー・フッターは (login)/layout.tsx 側にあるため、この画面でも残る。
 */
export default function LoginError({ error, retry }: Props) {
  // 本番ではサーバーのエラーメッセージは伏せられるため、サーバーログと照合できる digest だけを出す
  const digest =
    error instanceof Error && 'digest' in error && typeof error.digest === 'string'
      ? error.digest
      : undefined;

  return (
    <section className={styles.container}>
      {/* Client Component のため metadata を export できず、React の <title> でタブ名を伝える */}
      <title>{`エラー | ${SITE_META.title}`}</title>
      <hgroup className={styles.titleWrapper}>
        <p className={styles.errorCode}>500</p>
        <SectionTitle title="ページを表示できませんでした" level={1} />
      </hgroup>
      <p className={styles.description}>
        一時的な問題が発生しています。時間をおいて再試行してください。
      </p>
      {digest && <p className={styles.digest}>エラー ID: {digest}</p>}
      <div className={styles.btn}>
        <CtaActionButton type="button" onClick={() => retry()}>
          再試行
        </CtaActionButton>
        <CtaLinkButton href="/" prevIcon={true}>
          トップページへ
        </CtaLinkButton>
      </div>
    </section>
  );
}

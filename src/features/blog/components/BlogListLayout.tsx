import styles from '@/src/styles/pages/blog/layout.module.css';
import type { ComponentProps } from 'react';
import { Breadcrumb, SectionTitle } from '@/src/components';
import ArticleCardList from '@/src/features/blog/components/ArticleCardList';
import AsideMenu from '@/src/features/blog/components/AsideMenu';
import Pagination from '@/src/features/blog/components/Pagination';

type Props = {
  breadcrumb: ComponentProps<typeof Breadcrumb>['data'];
  title: string;
  contents: ComponentProps<typeof ArticleCardList>['contents'];
  pager: ComponentProps<typeof Pagination>['pager'];
  type?: ComponentProps<typeof Pagination>['type'];
};

/** アーカイブ・カテゴリ・タグ別の記事一覧ページ（1ページ目・2ページ目以降）で共通のレイアウト */
export default function BlogListLayout({ breadcrumb, title, contents, pager, type }: Props) {
  return (
    <>
      <Breadcrumb data={breadcrumb} />
      <div className={styles.container}>
        <section>
          <SectionTitle title={title} />
          <ArticleCardList contents={contents} />
          <Pagination pager={pager} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  );
}

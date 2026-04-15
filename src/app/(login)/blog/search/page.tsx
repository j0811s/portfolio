import styles from '@/src/styles/pages/blog/layout.module.css';
import { SITE_URL } from '@/src/constants/site';
import { LIMIT } from '@/src/constants/blog';
import { Breadcrumb, SectionTitle } from '@/src/components';
import { fetchBlogList } from '@/src/libs/microcms/blog';
import { ArticleCardList, AsideMenu } from '@/src/features/blog';
import SearchForm from '@/src/features/blog/components/SearchForm';
import type { Metadata } from 'next';
import { metadata as rootMetadata } from '@/src/app/layout';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    ...rootMetadata,
    title: q ? `「${q}」の検索結果` : '検索',
    robots: { index: false },
  };
}

export default async function Page({ searchParams }: Props) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? '';

  const { contents, totalCount } = (await fetchBlogList('blog', {
    q: keyword || undefined,
    limit: LIMIT,
  })) ?? { contents: [], totalCount: 0 };

  return (
    <>
      <Breadcrumb
        data={[
          { name: 'トップページ', url: SITE_URL },
          { name: '投稿', url: '/blog/' },
          { name: '検索', url: '/blog/search' },
        ]}
      />
      <div className={styles.container}>
        <section>
          <SectionTitle title={keyword ? `「${keyword}」の検索結果：${totalCount}件` : '検索'} />
          <SearchForm defaultValue={keyword} />
          <ArticleCardList contents={contents} />
        </section>
        <AsideMenu />
      </div>
    </>
  );
}

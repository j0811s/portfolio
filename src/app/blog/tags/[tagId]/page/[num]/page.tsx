import styles from "@/src/styles/pages/blog/layout.module.css";
import { LIMIT } from '@/src/constants/blog';
import { SITE_URL } from '@/src/constants/site';
import { fetchBlogDetail, fetchBlogList } from '@/src/libs/microcms/blog';
import { Metadata } from 'next';
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";


type generateMetadataProps = {
  params: Promise<{
    tagId: string;
    num: string;
  }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { tagId, num } = params;
  const tag = await fetchBlogDetail('tags', tagId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${num}ページ目 | ${tag?.name} | タグ | 投稿 | J.Sato`,
    description: `「${tag?.name}」の${num}ページ目です。`,
    openGraph: {
      description: `「${tag?.name}」の${num}ページ目です。`
    }
  }
}

type Props = {
  params: Promise<{
    tagId: string;
    num: string;
  }>
}

export default async function Page({ params }: Props) {
  const { tagId, num } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `tag[contains]${tagId}`,
    offset: LIMIT * (Number(num) - 1)
  });
  
  const tagName = contents[0].tag.filter(tag => tag.id === tagId)[0].name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: 'タグ | 投稿', url: `${SITE_URL}/blog/` },
    { name: `${tagName} | ${num}ページ`, url: `${SITE_URL}/blog/tags/page/${num}/` }
  ];

  const type = {
    slug: 'tags',
    id: tagId,
    name: tagName
  }

  return (
    <>
      <Breadcrumb data={breadcrumb} />
      <div className={styles.container}>
        <section>
          <SectionTitle title={`${tagName} | ${num}ページ`} />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: Number(num) }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}

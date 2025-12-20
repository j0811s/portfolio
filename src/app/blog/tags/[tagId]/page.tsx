import styles from "@/src/styles/pages/blog/layout.module.css";
import { Metadata } from 'next';
import { SITE_URL } from "@/src/constants/site";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";
import { fetchBlogDetail, fetchBlogList } from "@/src/libs/microcms/blog";
import { LIMIT } from "@/src/constants/blog";


type generateMetadataProps = {
  params: Promise<{ tagId: string }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const tag = await fetchBlogDetail('tags', params.tagId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${tag?.name ?? ''} | タグ | 投稿 | J.Sato`,
    description: `「${tag?.name ?? 'タグ'}」の一覧ページです。`,
    openGraph: {
      description: `「${tag?.name ?? 'タグ'}」の一覧ページです。`
    }
  }
}

type Props = {
  params: Promise<{
    tagId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { tagId } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `tag[contains]${tagId}`
  });
  
  const tagName = contents[0].tag.filter(tag => tag.id === tagId)[0].name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: 'タグ | 投稿', url: `${SITE_URL}/blog/` },
    { name: tagName, url: `${SITE_URL}/blog/tags/page/${tagId}/` }
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
          <SectionTitle title={tagName} />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: 1 }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}

import { getList } from "../../../libs/microcms/blog";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";
import { ArticleListContents } from "@/src/app/components/blog/ArticleListContents";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: Promise<{ year: string }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const year = params.year;

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${year}年 | 年別アーカイブ | ブログ | J.Sato`,
    description: `「${year}年」の一覧ページです。`,
    openGraph: {
      description: `「${year}年」の一覧ページです。`
    }
  }
}

type Props = {
  params: Promise<{
    year: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { year } = params;
  const limit = 12;

  const { contents, totalCount } = await getList('blog', {
    filters: `publishedAt[contains]${year}`,
    limit
  });

  const type = {
    slug: 'archive',
    id: year,
    name: `${year}年`
  }

  return (
    <>
      <ArticleListContents contents={contents} type={type} totalCount={totalCount} limit={limit} />
    </>
  )
}
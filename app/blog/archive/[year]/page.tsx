import { getList } from "../../../libs/microcms";
import { Breadcrumb } from "@/app/components/common/Breadcrumb";
import { ArticleList } from "@/app/components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: { year: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const year = params.year;
  
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${year}年 | 年別アーカイブ | ブログ | J.Sato Portfolio`,
    description: `「${year}年」の一覧ページです。`,
    openGraph: {
      description:`「${year}年」の一覧ページです。`
    }
  }
}

type Props = {
  params: {
    year: string;
  };
};

export default async function Page({ params }: Props) {
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
      <Breadcrumb type={type} />
      <ArticleList contents={contents} type={type} totalCount={totalCount} limit={limit} />
    </>
  )
}
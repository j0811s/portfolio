import { getList, getDetail } from "../../../libs/microcms";
import { JsonLd } from "@/app/components/common/Breadcrumb/JsonLd";
import { Breadcrumb } from "@/app/components/common/Breadcrumb";
import { ArticleList } from "../../../components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: { tagId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const tag = await getDetail('tags', params.tagId);
  
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${tag?.name} | タグ | ブログ | J.Sato Portfolio`,
    description: `「${tag?.name}」の一覧ページです。`,
    openGraph: {
      description:`「${tag?.name}」の一覧ページです。`
    }
  }
}

type Props = {
  params: {
    tagId: string;
  };
}

export default async function Page({ params }: Props) {
  const { tagId } = params;
  const typeName = 'tags';
  const tag = await getDetail(typeName, tagId);
  const limit = 12;
  
  const { contents, totalCount } = await getList('blog', {
    filters: `tag[contains]${tag.id}`,
    limit
  });

  const type = {
    slug: typeName,
    id: tag.id,
    name: tag.name
  }

  return (
    <>
      <JsonLd type={type} />
      <Breadcrumb type={type} />
      <ArticleList contents={contents} type={type} totalCount={totalCount} limit={limit} />
    </>
  )
}
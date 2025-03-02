import { getList, getDetail } from "../../../libs/microcms/blog";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";
import { ArticleListContents } from "../../../components/blog/ArticleListContents";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: Promise<{ tagId: string }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const tag = await getDetail('tags', params.tagId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${tag?.name} | タグ | ブログ | J.Sato`,
    description: `「${tag?.name}」の一覧ページです。`,
    openGraph: {
      description: `「${tag?.name}」の一覧ページです。`
    }
  }
}

type Props = {
  params: Promise<{
    tagId: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
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
      <ArticleListContents contents={contents} type={type} totalCount={totalCount} limit={limit} />
    </>
  )
}
import { getList, getDetail } from "../../../libs/microcms";
import { ArticleList } from "../../../components/blog/ArticleList";

type Props = {
  params: {
    tagId: string;
  };
};

export default async function Page({ params }: Props) {
  const { tagId } = params;
  const tag = await getDetail('tag', tagId);
  
  const { contents } = await getList('blog', {
    filters: `tag[contains]${tag.id}`
  });

  return (<ArticleList contents={contents} type={tag.name} />)
}
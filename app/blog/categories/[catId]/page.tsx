import { getList, getDetail } from "../../../libs/microcms";
import { ArticleList } from "../../../components/blog/ArticleList";

type Props = {
  params: {
    catId: string;
  };
};

export default async function Page({ params }: Props) {
  const { catId } = params;
  const category = await getDetail('categories', catId);
  
  const { contents } = await getList('blog', {
    filters: `category[contains]${category.id}`
  });

  return (<ArticleList contents={contents} type={category.name} />)
}
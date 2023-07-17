import { getList, getDetail } from "../../../libs/microcms";
import { ArticleList } from "../../../components/blog/ArticleList";

type Props = {
  params: {
    year: string;
  };
};

export default async function Page({ params }: Props) {
  const { year } = params;
  
  const { contents } = await getList('blog', {
    filters: `publishedAt[contains]${year}`
  });

  return (<ArticleList contents={contents} type={`${year}年`} />)
}
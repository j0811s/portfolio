import { getList, type Blog } from "@/src/app/libs/microcms/blog";
import { ArticleList } from "../ArticleList";

export const PickupArticles = async ({ endpoint = 'blog', category = 'portfolio', limit = 6 }: { endpoint: string, category: string, limit?: number }) => {
  const { contents, totalCount } = await getList(endpoint, {
    limit,
    filters: `category[contains]${category}` 
  });

  return <ArticleList contents={contents} totalCount={totalCount} />
}
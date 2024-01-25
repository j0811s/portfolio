import { postListWrapper } from './index.css';
import { Blog } from '../../../libs/microcms/blog';
import { Pagenation } from '../Pagenation';
import { PageTitle } from "../../common/PageTitle";
import { ArticleList } from "../ArticleList";

type ArticleListParam = {
  contents: Blog[];
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  };
  totalCount: number;
  limit: number;
  currentPage?: number;
}

export const ArticleListContents = async ({ contents, type, totalCount, limit, currentPage }: ArticleListParam) => {
  const hasContents = totalCount > 0;
  
  return (
    <section className={postListWrapper}>
      <PageTitle pageTitle="ブログ" type={{ slug: 'blog', ...type }} currentPage={currentPage} />
      <ArticleList contents={contents} totalCount={totalCount} />
      <Pagenation pager={{ totalCount, limit, currentPage }} type={type} />
    </section>
  )
}
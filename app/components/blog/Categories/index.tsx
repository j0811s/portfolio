import { container, list, listItem, listIetmLink } from "./index.css";
import Link from "next/link";
import { getList } from "../../../libs/microcms";
import { GetTotalCount } from "../totalCount";

export const Categories = async () => {
  const { contents } = await getList('blog', {
    limit: 1000
  });
  
  if (contents.length === 0) return;

  const categoriesData = GetTotalCount(contents, 'category');
  const categories = Object.keys(categoriesData);

  return (
    <div className={container}>
      <h2>カテゴリー</h2>
      <ul className={list}>
        {
          categories.map(cat => <li className={listItem} key={cat}>{
            <Link className={listIetmLink} href={`/blog/categories/${cat}`}>{categoriesData[cat].name} ({ categoriesData[cat].count })</Link>
          }</li>)
        }
      </ul>
    </div>
  )
}
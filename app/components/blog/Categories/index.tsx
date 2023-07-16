import { container, list, listItem, listIetmLink } from "./index.css";
import Link from "next/link";
import { getList } from "../../../libs/microcms";

export const Categories = async () => {
  const { contents } = await getList('categories', { limit: 100 });

  if (contents.length === 0) return;

  return (
    <div className={container}>
      <h2>カテゴリー</h2>
      <ul className={list}>
        {
          contents.map(cat => <li className={listItem} key={cat.id}>{
            <Link className={listIetmLink} href={`/blog/categories/${cat.id}`}>{cat.name}</Link>
          }</li>)
        }
      </ul>
    </div>
  )
}
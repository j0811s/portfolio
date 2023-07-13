import Link from "next/link";
import { getList } from "../../../libs/microcms";

export const Categories = async () => {
  const { contents } = await getList('categories', { limit: 100 });

  if (contents.length === 0) return;

  return (
    <div className='categories'>
      <h2 className='categories_title'>カテゴリー</h2>
      <ul className='categories_list'>
        {
          contents.map(cat => <li className='categories_listItem' key={cat.id}>{
            <Link className='categories_link' href={`/blog/categories/${cat.id}`}>{cat.name}</Link>
          }</li>)
        }
      </ul>
    </div>
  )
}
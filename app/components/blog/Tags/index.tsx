import Link from "next/link";
import { getList } from "../../../libs/microcms";

export const Tags = async () => {
  const { contents } = await getList('tag', { limit: 100 });

  if (contents.length === 0) return;

  return (
    <div className='tags'>
      <h2 className='tags_title'>タグ</h2>
      <ul className='tags_list'>
        {
          contents.map(tag => <li className='tags_listItem' key={tag.id}>{
            <Link href={`/blog/tags/${tag.id}`}>{tag.name}</Link>
          }</li>)
        }
      </ul>
    </div>
  )
}
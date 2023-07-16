import { container, list, listIetm, listIetmLink } from "./index.css";
import Link from "next/link";
import { getList } from "../../../libs/microcms";

export const Tags = async () => {
  const { contents } = await getList('tag', { limit: 100 });

  if (contents.length === 0) return;

  return (
    <div className={container}>
      <h2>タグ</h2>
      <ul className={list}>
        {
          contents.map(tag => <li className={listIetm} key={tag.id}>{
            <Link className={listIetmLink} href={`/blog/tags/${tag.id}`}>{tag.name}</Link>
          }</li>)
        }
      </ul>
    </div>
  )
}
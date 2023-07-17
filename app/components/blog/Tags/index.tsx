import { container, list, listIetm, listIetmLink } from "./index.css";
import Link from "next/link";
import { getList } from "../../../libs/microcms";
import { GetTotalCount } from "../totalCount";

export const Tags = async () => {
  const { contents } = await getList('blog', {
    limit: 1000
  });
  
  if (contents.length === 0) return;

  const tagData = GetTotalCount(contents, 'tag');
  const tags = Object.keys(tagData);

  return (
    <div className={container}>
      <h2>タグ</h2>
      <ul className={list}>
        {
          tags.map(tag => (
            <li className={listIetm} key={tag}>
              <Link className={listIetmLink} href={`/blog/tags/${tag}`}>{tagData[tag].name} ({ tagData[tag].count })</Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
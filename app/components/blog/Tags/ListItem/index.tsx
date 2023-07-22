import { listIetm, listIetmLink } from "../index.css";
import Link from "next/link";

export const ListItem = ({ tags, tagData }: { tags: string[], [key: string]: any }) => {

  const li = tags.map(tag => {
    return (
      <li className={listIetm} key={tag}>
        <Link className={listIetmLink} href={`/blog/tags/${tag}`}>
          #{ tagData[tag].name } {tagData[tag].count ? `(${tagData[tag].count})` : ''}
        </Link>
      </li>
    )
  });

  return li;
}
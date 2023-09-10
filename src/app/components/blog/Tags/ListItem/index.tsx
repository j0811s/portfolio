import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { tagItem, tagLink, tagIcon, tagName } from "../TagsElement/index.css";
import Link from "next/link";

export const ListItem = ({ tags, tagData }: { tags: string[], [key: string]: any }) => {

  const li = tags.map(tag => {
    return (
      <li className={tagItem} key={tag}>
        <Link className={tagLink} href={`/blog/tags/${tag}`}>
          <FontAwesomeIcon className={tagIcon} icon={faTag} size="xs" />
          <span className={tagName}>{tagData[tag].name}</span> <span>{tagData[tag].count ? `(${tagData[tag].count})` : ''}</span>
        </Link>
      </li>
    )
  });

  return li;
}
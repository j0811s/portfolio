import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { Tag } from '../../../../libs/microcms/blog';
import { list } from '../../Tags/index.css'
import { tagItem, tagLink, tagIcon, tagName } from "./index.css";
import Link from 'next/link';

type Props = {
  tagData: Tag[];
  modClass?: {
    ul?: string;
    li?: string;
  };
}

const TagContainer = ({ children, modClass }: {
  children: JSX.Element,
  modClass?: { ul?: string }
}
) => {
  return <ul className={`${list} ${modClass?.ul}`}>{ children }</ul>;
}

const TagItems = ({ tagData, modClass }: Props) => {
  return (
    tagData.map(tag => (
      <li className={`${tagItem} ${modClass?.li}`} key={tag.id}>
        <Link className={`${tagLink} mod-borderColor`} href={`/blog/tags/${tag.id}`}>
          <FontAwesomeIcon className={tagIcon} icon={faTag} size="xs" /><span className={tagName}>{ tag.name }</span>
        </Link>
      </li>
    ))
  )
}

export const TagsElement = ({ tagData, modClass }: Props) => {
  return (
    <TagContainer modClass={modClass}>
      <TagItems tagData={tagData} modClass={modClass} />
    </TagContainer>
  )
}
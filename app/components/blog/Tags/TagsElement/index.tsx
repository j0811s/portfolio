import { Tag } from '../../../../libs/microcms';
import { list, listIetm, listIetmLink } from '../../Tags/index.css'
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
      <li className={`${listIetm} ${modClass?.li}`} key={tag.id}>
        <Link className={listIetmLink} href={`/blog/tags/${tag.id}`}>
          { tag.name }
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
import { listItem, listItemLink } from "../index.css";
import Link from "next/link";

export type BreadcrumbParam = {
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  }
}

export const ListItems = ({ type }: BreadcrumbParam) => {
  const { slug, id, name } = { ...type };

  switch (slug) {
    case 'about': {
      return (
        <>
          <li className={listItem}>
            <span className={`${listItemLink} mod-current`}>私について</span>
          </li>
        </>
      )
    }
    case 'blog': {
      return (
        <>
          <li className={listItem}>
            <span className={`${listItemLink} mod-current`}>ブログ</span>
          </li>
        </>
      )
    }
    case 'post': {
      return (
        <>
          <li className={listItem}>
            <Link className={listItemLink} href={'/blog/'}>ブログ</Link>
          </li>
          <li className={listItem}>
            <span className={`${listItemLink} mod-current`}>{name}</span>
          </li>
        </>
      )
    }
    case 'categories':
    case 'tags':
    case 'archive': {
      return (
        <>
          <li className={listItem}>
            <Link className={listItemLink} href={'/blog/'}>ブログ</Link>
          </li>
          <li className={listItem}>
            <span className={`${listItemLink} mod-current`}>{name}</span>
          </li>
        </>
      )
    }
    default: {
      return (
        <>
        </>
      )
    }
  }
}
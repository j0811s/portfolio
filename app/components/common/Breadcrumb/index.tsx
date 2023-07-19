import { list, listItem, listItemLink } from "./index.css"
import Link from "next/link"

type BreadcrumbParam = {
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  }
}

const SetListItem = ({ type }: BreadcrumbParam) => {
  const { slug, id, name } = { ...type };

  switch (slug) {
    case 'blog': {
      return (
        <>
          <li className={listItem}>
            <Link className={listItemLink} href={'/blog/'}>ブログ</Link>
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
            <Link className={listItemLink} href={`/blog/${id}`}>{name}</Link>
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
            <Link className={listItemLink} href={`/blog/${slug}/${id}`}>{name}</Link>
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

export const Breadcrumb = ({ type }: BreadcrumbParam) => {

  return (
    <ul className={list}>
      <li className={listItem}>
        <Link className={listItemLink} href={'/'}>トップページ</Link>
      </li>
      <SetListItem type={type} />
    </ul>
  )
}
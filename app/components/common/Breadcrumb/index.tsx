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
    case 'categories': {
      return (
        <li className={listItem}>
          <Link className={listItemLink} href={`/blog/${slug}/${id}`}>{name}</Link>
        </li>
      )
    }
    case 'tags': {
      return (
        <li className={listItem}>
          <Link className={listItemLink} href={`/blog/${slug}/${id}`}>{name}</Link>
        </li>
      )
    }
    case 'archive': {
      return (
        <li className={listItem}>
          <Link className={listItemLink} href={`/blog/${slug}/${id}`}>{name}</Link>
        </li>
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
      <li className={listItem}>
        <Link className={listItemLink} href={'/blog/'}>ブログ</Link>
      </li>
      <SetListItem type={type} />
    </ul>
  )
}
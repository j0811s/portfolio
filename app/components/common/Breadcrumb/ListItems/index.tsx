import { listItem, listItemLink } from "../index.css";
import { Blog } from "@/app/libs/microcms";
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
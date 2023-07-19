import { list, listItem, listItemLink } from "./index.css";
import { ListItems, BreadcrumbParam } from "./ListItems";
import Link from "next/link"

export const Breadcrumb = ({ type }: BreadcrumbParam) => {

  return (
    <ul className={list}>
      <li className={listItem}>
        <Link className={listItemLink} href={'/'}>トップページ</Link>
      </li>
      <ListItems type={type} />
    </ul>
  )
}
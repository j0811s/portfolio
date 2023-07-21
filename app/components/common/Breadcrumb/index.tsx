import { list, listItem, listItemLink } from "./index.css";
import { ListItems } from "./ListItems";
import { BreadcrumbJsonLd } from "@/app/components/common/Breadcrumb/BreadcrumbJsonLd";
import Link from "next/link"

type Props = {
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  },
  post?: {
    id?: string;
    title?: string;
  }
}

export const Breadcrumb = ({ type, post }: Props) => {

  return (
    <>
      <BreadcrumbJsonLd type={type} post={post} />
      <ul className={list}>
        <li className={listItem}>
          <Link className={listItemLink} href={'/'}>トップページ</Link>
        </li>
        <ListItems type={type} />
      </ul>
    </>
  )
}
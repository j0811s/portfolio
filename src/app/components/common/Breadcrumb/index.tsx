import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBreadSlice } from "@fortawesome/free-solid-svg-icons";
import { list, listItem, listItemLink, listItemName } from "./index.css";
import { ListItems } from "./ListItems";
import { BreadcrumbJsonLd } from "@/src/app/components/common/Breadcrumb/BreadcrumbJsonLd";
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
          <Link className={listItemLink} href={'/'}>
            <FontAwesomeIcon icon={faBreadSlice} />
            <span className={listItemName}>トップページ</span>
          </Link>
        </li>
        <ListItems type={type} />
      </ul>
    </>
  )
}
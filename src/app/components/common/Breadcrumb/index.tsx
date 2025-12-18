import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { list, listItem, listItemLink, listItemIcon, listItemName } from "./index.css";
import { ListItems } from "./ListItems";
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
    <ul className={list}>
      <li className={listItem}>
        <Link className={listItemLink} href={'/'}>
          <FontAwesomeIcon icon={faHouse} className={listItemIcon} />
          <span className={listItemName}>TOP</span>
        </Link>
      </li>
      <ListItems type={type} />
    </ul>
  )
}
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { listItem, listItemLink, listItemIcon, listItemName } from "../index.css";
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
            <span className={`${listItemLink} mod-current`}>
              <FontAwesomeIcon icon={faLocationDot} />
              <span className={listItemName}>ABOUT</span>
            </span>
          </li>
        </>
      )
    }
    case 'blog': {
      return (
        <>
          <li className={listItem}>
            <span className={`${listItemLink} mod-current`}>
              <FontAwesomeIcon icon={faLocationDot} />
              <span className={listItemName}>BLOG</span>
            </span>
          </li>
        </>
      )
    }
    case 'post': {
      return (
        <>
          <li className={listItem}>
            <Link className={listItemLink} href={'/blog/'}>
              <FontAwesomeIcon icon={faFileLines} />
              <span className={listItemName}>BLOG</span>
            </Link>
          </li>
          <li className={listItem}>
            <span className={`${listItemLink} mod-current`}>
              <FontAwesomeIcon icon={faLocationDot} />
              <span className={listItemName}>{name}</span>
            </span>
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
            <Link className={listItemLink} href={'/blog/'}>
              <FontAwesomeIcon icon={faFileLines} />
              <span className={listItemName}>BLOG</span>
            </Link>
          </li>
          <li className={listItem}>
            <span className={`${listItemLink} mod-current`}>
              <FontAwesomeIcon icon={faLocationDot} />
              <span className={listItemName}>{name}</span>
            </span>
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
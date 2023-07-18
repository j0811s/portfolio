import { container, list, listItem, pageLink, current, currentText } from "./index.css";
import Link from "next/link"

type PagenationParam = {
  pager: {
    totalCount: number;
    limit: number;
    currentPage?: number;
  }
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  }
}

export const Pagenation = ({ pager, type }: PagenationParam) => {
  const { totalCount, limit, currentPage = 1 } = pager;
  if (!totalCount) return

  const pageCount: number[] = [...Array(Math.ceil(totalCount / limit)).keys()];

  const urlPath = !type?.slug
    ? '/blog/page/'
    : `/blog/${type?.slug}/${type?.id}/page/`;
  
  const currentCheck = (page: number): boolean => currentPage === (page + 1)

  const pageNumbers = pageCount.map(page => (
    <li key={page} className={`${listItem} ${currentCheck(page) ? current : ''}`}>
      {
        currentCheck(page)
          ? <div className={`${currentText} ${pageLink}`}>{page + 1}</div>
          : <Link className={pageLink} href={`${urlPath}${page + 1}`}>{page + 1}</Link>
      }
    </li>
  ));
  
  return (
    <div className={container}>
      <ul className={list}>
        {pageNumbers}
      </ul>
    </div>
  )
}
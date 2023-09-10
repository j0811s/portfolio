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
  
  const currentPageCheck = (page: number): boolean => currentPage === (page + 1)

  const firstPageNumber = () => {
    if (3 >= currentPage) return <></>
    return (
      <>
        <li className={`${listItem}`}>
          <Link className={pageLink} href={`${urlPath}${1}`}>1</Link>
        </li>
        <li className={`${listItem}`} style={{ pointerEvents: "none"}}>
          <div className={`${pageLink}`}>...</div>
        </li>
      </>
    )
  }
  
  const rangePageNumbers = pageCount.map(page => {
    if (currentPage - 3 <= page && page <= currentPage + 1) {
      return (
        <li key={page} className={`${listItem} ${currentPageCheck(page) ? current : ''}`}>
          {
            currentPageCheck(page)
              ? <div className={`${currentText} ${pageLink}`}>{page + 1}</div>
              : <Link className={pageLink} href={`${urlPath}${page + 1}`}>{page + 1}</Link>
          }
        </li>
      )
    }
  });

  const lastPageNumber = () => {
    if (currentPage + 2 < pageCount.length) {
      return (
        <>
          <li className={`${listItem}`} style={{ pointerEvents: "none"}}>
            <div className={`${pageLink}`}>...</div>
          </li>
          <li className={`${listItem}`}>
            <Link className={pageLink} href={`${urlPath}${pageCount.length}`}>{pageCount.length}</Link>
          </li>
        </>
      )
    }
  }
  
  return (
    <div className={container}>
      <ul className={list}>
        {firstPageNumber()}
        {rangePageNumbers}
        {lastPageNumber()}
      </ul>
    </div>
  )
}
import styles from '@/src/features/blog/styles/Pagination.module.css';
import Link from 'next/link';

type PaginationParam = {
  pager: {
    totalCount: number;
    limit: number;
    currentPage?: number;
  };
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  };
  onPageChange?: (page: number) => void;
};

export default function Pagination({ pager, type, onPageChange }: PaginationParam) {
  const { totalCount, limit, currentPage = 1 } = pager;
  if (!totalCount) return;

  const pageCount: number[] = [...Array(Math.ceil(totalCount / limit)).keys()];

  const urlPath = !type?.slug ? '/blog/page/' : `/blog/${type?.slug}/${type?.id}/page/`;

  const currentPageCheck = (page: number): boolean => currentPage === page + 1;

  const renderPageLink = (page: number, label: number) => {
    if (onPageChange) {
      return (
        <button type="button" className={styles.pageLink} onClick={() => onPageChange(page)}>
          {label}
        </button>
      );
    }
    return (
      <Link className={styles.pageLink} href={`${urlPath}${page}`}>
        {label}
      </Link>
    );
  };

  const firstPageNumber = () => {
    if (3 >= currentPage) return null;
    return (
      <>
        <li className={`${styles.listItem}`}>{renderPageLink(1, 1)}</li>
        <li className={`${styles.listItem}`} style={{ pointerEvents: 'none' }}>
          <div className={`${styles.pageLink} ${styles.omit}`}>...</div>
        </li>
      </>
    );
  };

  const rangePageNumbers = pageCount.map((page) => {
    if (currentPage - 3 <= page && page <= currentPage + 1) {
      return (
        <li
          key={page}
          className={`${styles.listItem} ${currentPageCheck(page) ? currentPage : ''}`}
        >
          {currentPageCheck(page) ? (
            <div className={`${styles.currentText} ${styles.pageLink}`}>{page + 1}</div>
          ) : (
            renderPageLink(page + 1, page + 1)
          )}
        </li>
      );
    }
    return null;
  });

  const lastPageNumber = () => {
    if (currentPage + 2 < pageCount.length) {
      return (
        <>
          <li className={`${styles.listItem}`} style={{ pointerEvents: 'none' }}>
            <div className={`${styles.pageLink} ${styles.omit}`}>...</div>
          </li>
          <li className={`${styles.listItem}`}>
            {renderPageLink(pageCount.length, pageCount.length)}
          </li>
        </>
      );
    }
    return null;
  };

  return (
    <nav className={styles.container}>
      <ol className={styles.list}>
        {firstPageNumber()}
        {rangePageNumbers}
        {lastPageNumber()}
      </ol>
    </nav>
  );
}

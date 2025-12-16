import styles from "@/src/styles/components/ui/Breadcrumb.module.css";
import clsx from "clsx";
import Link from "next/link";

interface Props {
  currentPage: string;
}

function Breadcrumb({ currentPage }: Props) {
  return (
    <div className={clsx(styles.container)}>
      <ol className={clsx(styles.list)}>
        <li className={styles.listItem}>
          <Link className={styles.link} href={'/'}>トップページ</Link>
        </li>
        <li className={styles.listItem}>
          {/* 現状は投稿ページしかないので固定 */}
          <Link className={styles.link} href={'/blog/'}>投稿</Link>
        </li>
        <li className={clsx(styles.listItem, styles.currentPage, 'u-ellipsis u-ellipsis--short')}>
          {currentPage}
        </li>
      </ol>
    </div>
  )
}

export default Breadcrumb;

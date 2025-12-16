import styles from "@/src/features/blog/styles/Category.module.css";
import Link from "next/link";

function Category({ data, totalCount }: { data: Category, totalCount?: string | number }) {
  return (
    <Link className={styles.link} href={`/blog/categories/${data.id}`}>
      <span className={styles.name}>{data.name}</span> {totalCount ? <span className={styles.badge}>({totalCount})</span> : '' }
    </Link>
  )
}

export default Category;

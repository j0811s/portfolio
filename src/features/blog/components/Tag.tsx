import styles from "@/src/features/blog/styles/Tag.module.css";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import type { PostData } from "@/src/libs/blog/getTotalCount";

function Tag({ data, totalCount }: { data: PostData, totalCount?: string | number }) {
  return (
    <Link className={styles.link} href={`/blog/tags/${data.id}`}>
      {/* <FontAwesomeIcon className={styles.icon} icon={faTag} size="xs" /> */}
      <span className={styles.name}>{data.name}</span> {totalCount ? <span className={styles.badge}>({totalCount})</span> : '' }
    </Link>
  )
}

export default Tag;

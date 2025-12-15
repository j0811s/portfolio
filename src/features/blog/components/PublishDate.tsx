import styles from "@/src/features/blog/styles/PublishDate.module.css";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "@/src/features/blog";

function PublishDate({ publishedAt, updatedAt }: { publishedAt?: string; updatedAt?: string; }) {
  if (!publishedAt || !updatedAt) {
    return <></>
  }

  return (
    <div className={styles.postDateContainer}>
      {
        updatedAt ?
          <p className={styles.postDate}>
            <FontAwesomeIcon className={styles.postDateIcon} icon={faClock} aria-label="更新日" />
            <DateTime date={updatedAt} />
          </p> :
          <p className={styles.postDate}>
            <FontAwesomeIcon className={styles.postDateIcon} icon={faCalendarDay} aria-label="公開日" />
            <DateTime date={publishedAt} />
          </p>
      }
    </div>
  )
}

export default PublishDate;

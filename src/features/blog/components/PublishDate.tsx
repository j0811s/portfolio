import styles from "@/src/features/blog/styles/PublishDate.module.css";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateTime from "@/src/features/blog/components/DateTime";
import clsx from "clsx";
import dayjs from 'dayjs';

const Date = ({ publishedAt, updatedAt }: { publishedAt: string; updatedAt: string; }) => {
  const published = dayjs(publishedAt);
  const updated = dayjs(updatedAt);
  const isSameDate = published.isSame(updated, 'day'); 

  return (
    <div className={styles.postDate}>
      <>
        <FontAwesomeIcon className={styles.postDateIcon} icon={faCalendarDay} aria-label="公開日" />
        <DateTime date={publishedAt} />
      </>
      {
        !isSameDate &&
        <>
          <FontAwesomeIcon className={styles.postDateIcon} icon={faClock} aria-label="更新日" />
          <DateTime date={updatedAt} />
        </>
      }
    </div>
  )
}

function PublishDate({ publishedAt, updatedAt, className }: { publishedAt?: string; updatedAt?: string; className?: string; }) {
  if (!publishedAt || !updatedAt) {
    return <></>
  }

  return (
    <div className={clsx(styles.postDateContainer, className)}>
      <Date publishedAt={publishedAt} updatedAt={updatedAt} />
    </div>
  )
}

export default PublishDate;

import styles from '@/src/features/blog/styles/ArticleCard.module.css';
import clsx from 'clsx';
import Link from 'next/link';
import PublishDate from '@/src/features/blog/components/PublishDate';
import Eyecatch from '@/src/features/blog/components/Eyecatch';

interface Props extends BlogPost {
  className?: string;
}

export default function ArticleCard(props: Props) {
  return (
    <Link className={clsx(styles.link, props.className ?? '')} href={`/blog/${props.id}/`}>
      <article className={styles.post}>
        <Eyecatch
          className={styles.thmubnail}
          src={props.eyecatch?.url}
          width={props.eyecatch?.width}
          height={props.eyecatch?.height}
        />
        <div className={styles.postInner}>
          <h3 className={clsx(styles.title, 'u-ellipsis')}>{props.title}</h3>
          <PublishDate publishedAt={props.publishedAt} updatedAt={props.updatedAt} />
        </div>
      </article>
    </Link>
  );
}

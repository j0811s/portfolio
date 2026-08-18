import clsx from 'clsx';
import styles from '@/src/features/blog/styles/ArticleCardList.module.css';
import ArticleCard from '@/src/features/blog/components/ArticleCard';

interface Props {
  contents: BlogPost[];
  className?: string;
  emptyMessage?: string;
}

export default function ArticleCardList({ contents, className = '', emptyMessage }: Props) {
  if (contents.length < 1) {
    return emptyMessage ? <p className={styles.empty}>{emptyMessage}</p> : null;
  }

  return (
    <ul className={clsx(styles.list, className)}>
      {contents.map((content) => (
        <li className={styles.item} key={content.id}>
          <ArticleCard {...content} />
        </li>
      ))}
    </ul>
  );
}

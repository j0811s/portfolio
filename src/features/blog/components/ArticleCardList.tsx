import clsx from "clsx";
import styles from "@/src/features/blog/styles/ArticleCardList.module.css";
import { ArticleCard } from "@/src/features/blog/";

interface Props {
  contents: BlogPost[];
  className?: string;
}

export default function ArticleCardList({ contents, className = '' }: Props) {
  if (contents.length < 1) {
    return <></>
  }

  return (
    <ul className={clsx(styles.list, className)}>
      {
        contents.map((content) => (
          <li className={styles.item} key={content.id}>
            <ArticleCard {...content} />
          </li>
        ))
      }
    </ul>
  );
}
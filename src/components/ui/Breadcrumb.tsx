import styles from "@/src/styles/components/ui/Breadcrumb.module.css";
import clsx from "clsx";
import Link from "next/link";

interface DataProps {
  name: string;
  url: string;
}

function Breadcrumb({ data }: { data: DataProps[] }) {
  if (!Array.isArray(data)) {
    return <></>;
  }

  const dataCount = data.length;

  return (
    <nav className={clsx(styles.container)}>
      <ol className={clsx(styles.list)}>
        {
          data.map((item, i) => {
            return (
              dataCount === ++i ?
                <li className={clsx(styles.listItem, styles.currentPage, 'u-ellipsis u-ellipsis--short')} key={item.name}>
                  {item.name}
                </li> :
                <li className={styles.listItem} key={item.name}>
                  <Link className={styles.link} href={item.url}>{item.name}</Link>
                </li>
            )
          })
        }
      </ol>
    </nav>
  )
}

export default Breadcrumb;

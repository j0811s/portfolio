import styles from "@/src/features/header/styles/Logo.module.css";
import Link from "next/link";

type Props = {
  as?: 'h1' | 'div';
}

export default function Logo({ as = 'div' }: Props) {
  const Tag = as;

  return (
    <Tag className={styles.title}>
      <Link className={styles.link} href={`/`}>
        Portfolio Site
      </Link>
    </Tag>
  )
}
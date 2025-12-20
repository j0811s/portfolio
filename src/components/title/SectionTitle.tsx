import styles from "@/src/styles/components/title/SectionTitle.module.css";

type Props = {
  title: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export default function SectionTitle({ title, level = 1 }: Props) { 
  const TitleTag = `h${level}` as const;

  return <TitleTag className={styles.title}>{title}</TitleTag>
}
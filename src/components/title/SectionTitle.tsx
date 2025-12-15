import styles from "@/src/styles/components/title/SectionTitle.module.css";

type Props = {
  title: string;
}

export default function SectionTitle({ ...props }: Props) { 
  return (
    <h2 className={styles.title}>{props.title}</h2>
  )
}
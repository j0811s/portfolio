import styles from "@/src/features/header/styles/Logo.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Logo() {

  return (
    <h1>
      <Link className={styles.link} href={`/`}>
        <Image className={styles.img} src={`/logo.png`} width={30} height={30} alt="ポートフォリオサイト" priority />
      </Link>
    </h1>
  )
}
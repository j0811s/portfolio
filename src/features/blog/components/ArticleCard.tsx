import clsx from "clsx";
import styles from "@/src/features/blog/styles/ArticleCard.module.css";
import Link from "next/link";
import Image from "next/image";
// import { CtaLinkButton } from "@/src/components";

interface Props extends BlogPost {
  className?: string;
}

export default function ArticleCard(props: Props) {
  return (
    <Link className={clsx(styles.link, props.className ?? '')} href={`/blog/${props.id}/`}>
      <article className={styles.post}>
        {
          props.eyecatch?.url ?
            <figure className={styles.eyecatch}>
              <Image className={styles.thmubnail} src={props.eyecatch.url} width={props.eyecatch?.width} height={props.eyecatch?.height} alt="" />
            </figure>
            :
            <figure className={styles.eyecatch}>
              <Image className={styles.thmubnail} src="/images/blog/dummy.png" alt="" width="375" height="210" onLoad={() => {}} />
            </figure>
        }
        <div className={styles.postInner}>
          <h3 className={clsx(styles.title, 'u-ellipsis')}>{props.title}</h3>
          {/* <CtaLinkButton href={`/blog/${props.id}/`} asLink={false}></CtaLinkButton> */}
        </div>
      </article>
    </Link>
  )
}
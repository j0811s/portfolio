import styles from '@/src/features/hero/styles/Hero.module.css';
import { CtaLinkButton } from '@/src/components';
import { GITHUB_URL } from '@/src/constants/url';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

const shapeClasses = [styles.shape1, styles.shape2, styles.shape3, styles.shape4];

interface Props {
  skills: SkillInfo;
}

export default function Hero({ skills }: Props) {
  return (
    <section className={styles.hero}>
      {skills.map((skill, i) => (
        <span key={skill.name} className={shapeClasses[i]}>
          <Image
            className={styles.shapeIcon}
            src={skill.logo.url}
            alt=""
            width={skill.logo.width}
            height={skill.logo.height}
          />
        </span>
      ))}
      <div className={styles.inner}>
        <h1 className={styles.name}>j-sato</h1>
        <p className={styles.description}>ポートフォリオサイト</p>
        <div className={styles.actions}>
          <CtaLinkButton href="/blog/" nextIcon>
            投稿を見る
          </CtaLinkButton>
          <Link className={styles.githubLink} href={GITHUB_URL} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faGithub as IconProp} />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

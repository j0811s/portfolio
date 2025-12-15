import styles from "@/src/styles/pages/top.module.css";
import { fetchSkillAll } from "@/src/libs/microcms/skill";
import { fetchBlogList } from "@/src/libs/microcms/blog";
import { SkillSet } from "@/src/features/skills";
import { ArticleCardList } from "@/src/features/blog";
import { CtaLinkButton, SectionTitle } from "@/src/components/";

export default async function Top() {
  const skills = await fetchSkillAll();
  const { contents: portfolioArticles } = await fetchBlogList('blog', {
      limit: 8,
      // filters: 'category[contains]portfolio'
    }
  );

  return (
    <>
      <section className={styles.section}>
        <SectionTitle title="投稿" />
        <ArticleCardList contents={portfolioArticles} />
        <div className={styles.moreButtonContainer}>
          <CtaLinkButton href='/blog/'>投稿を見る</CtaLinkButton>
        </div>
      </section>
      <section className={styles.section}>
        <SectionTitle title="経験" />
        <SkillSet data={skills} />
      </section>
    </>
  )
}

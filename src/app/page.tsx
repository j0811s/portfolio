import styles from "@/src/styles/pages/top.module.css";
import { SITE_URL } from "@/src/constants/site";
import { fetchSkillAll } from "@/src/libs/microcms/skill";
import { fetchBlogList } from "@/src/libs/microcms/blog";
import { SkillSet } from "@/src/features/skills";
import { ArticleCardList } from "@/src/features/blog";
import { CtaLinkButton, SectionTitle } from "@/src/components/";
import { JsonLd } from '@/src/components';
import { createBreadcrumbJsonLd, createWebsiteJsonLd } from "@/src/libs/seo/jsonLd";

export default async function Top() {
  const skills = await fetchSkillAll();
  const { contents: portfolioArticles } = await fetchBlogList('blog', {
      limit: 8,
      filters: 'category[contains]portfolio'
    }
  );

  return (
    <>
      <JsonLd data={createWebsiteJsonLd()} />
      <JsonLd data={createBreadcrumbJsonLd([{ name: 'トップページ', url: SITE_URL }])} />
      <section className={styles.section}>
        <SectionTitle title="投稿" level={2} />
        <ArticleCardList contents={portfolioArticles} />
        <div className={styles.moreLinkWrapper}>
          <CtaLinkButton className={styles.moreLink} href='/blog/' nextIcon={true}>投稿を見る</CtaLinkButton>
        </div>
      </section>
      <section className={styles.section}>
        <SectionTitle title="経験" level={2} />
        <SkillSet data={skills} />
      </section>
    </>
  )
}

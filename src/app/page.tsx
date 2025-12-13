import { container, section, moreButtonContainer } from "./styles/top/index.css";

import { fetchSkillAll } from "@/src/libs/microcms/skill";
import { SkillSet } from "@/src/features/skills";
import { CtaLinkButton, SectionTitle } from "@/src/components/";
import { PickupArticles } from "./components/blog/PickupArticles";

export default async function Top() {
  const skills = await fetchSkillAll();

  return (
    <div className={container}>
      <section className={section}>
        <SectionTitle title="技能" />
        <SkillSet data={skills} />
      </section>
      <section className={section}>
        <SectionTitle title="制作物" />
        <PickupArticles endpoint='blog' category='portfolio' />
        <div className={moreButtonContainer}>
          <CtaLinkButton href='/blog/'>投稿を見る</CtaLinkButton>
        </div>
      </section>
    </div>
  )
}

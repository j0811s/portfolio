import { container, section, moreButtonContainer } from "./styles/top/index.css";
import { getHistoryAllContents, type SkillContent } from "@/src/app/libs/microcms/history"
import { SkillSet } from "./components/about/SkillSet";
import { PageTitle } from "./components/common/PageTitle";
import { CtaButton } from "./components/common/Button";
import { PickupArticles } from "./components/blog/PickupArticles";

export default async function Top() {
  const skillContents: SkillContent[] = await getHistoryAllContents('skill');

  return (
    <div className={container}>
      <section className={section}>
        <PageTitle pageTitle="経験スキル" isBreadcrumb={false} subHeadline={true} />
        <SkillSet contents={skillContents.filter((_, i) => i <= 3)} />
        <div className={moreButtonContainer}>
          <CtaButton href='/about/'>詳細を見る</CtaButton>
        </div>
      </section>
      <section className={section}>
        <PageTitle pageTitle="制作物" isBreadcrumb={false} subHeadline={true} />
        <PickupArticles endpoint='blog' category='portfolio' />
        <div className={moreButtonContainer}>
          <CtaButton href='/blog/'>投稿一覧を見る</CtaButton>
        </div>
      </section>
    </div>
  )
}

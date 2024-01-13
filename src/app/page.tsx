import Link from "next/link";

import { siteTitleContainer, siteTitle, section, moreButtonContainer, moreButton } from "./styles/top/index.css";
import { getHistoryAllContents, type SkillContent } from "@/src/app/libs/microcms/history"
import { SkillSet } from "./components/about/SkillSet";
import { PickupArticles } from "./components/common/PickupArticles";
import { PageTitle } from "./components/common/PageTitle";

export default async function Top() {
  const skillContents: SkillContent[] = await getHistoryAllContents('skill');

  return (
    <>
      <div className={siteTitleContainer}>
        <h1 className={siteTitle}>J.Sato - Portfolio Site</h1>
      </div>
      <section className={section}>
        <PageTitle pageTitle="経験スキル" isBreadcrumb={false} subHeadline={true} />
        <SkillSet contents={skillContents} />
        <div className={moreButtonContainer}>
          <Link className={moreButton} href={`/about/`}>Aboutページへ移動</Link>
        </div>
      </section>
      <section className={section}>
        <PageTitle pageTitle="制作物" isBreadcrumb={false} subHeadline={true} />
        <PickupArticles endpoint='blog' category='portfolio' />
        <div className={moreButtonContainer}>
          <Link className={moreButton} href={`/blog/categories/portfolio/`}>一覧ページへ移動</Link>
        </div>
      </section>
    </>
  )
}

import Link from "next/link";

import { container } from "./styles/top/index.css";
import { getHistoryAllContents, type SkillContent } from "@/src/app/libs/microcms/history"
import { SkillSet } from "./components/about/SkillSet";
import { PickupArticles } from "./components/common/PickupArticles";

export default async function Top() {
  const skillContents: SkillContent[] = await getHistoryAllContents('skill');

  return (
    <>
      <h1>J.Sato | Portfolio Site</h1>
      <section>
        <h2>経験スキル</h2>
        <SkillSet contents={skillContents} />
        <Link href={`/about/`}>もっと見る</Link>
      </section>
      <section>
        <h2>制作物</h2>
        <PickupArticles endpoint='blog' />
        <Link href={`/blog/categories/portfolio/`}>もっと見る</Link>
      </section>
    </>
  )
}

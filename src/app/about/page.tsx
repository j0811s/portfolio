import { container, pageTitleContainer, pageTitle, mainTitle } from "../styles/about/index.css";
import type { SkillContent, CareerContent } from '@/src/app/libs/microcms/history'
import { SkillSet } from "@/src/app/components/about/SkillSet";
import { Career } from "@/src/app/components/about/Career";

import { PageTitle } from "@/src/app/components/common/PageTitle";
import { Metadata, ResolvingMetadata } from 'next';
import { getHistoryAllContents } from '@/src/app/libs/microcms/history';

type generateMetadataProps = {
  params: { catId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `私について`,
    description: `自身の紹介ページです。`,
    openGraph: {
      description:`自身の紹介ページです。`
    }
  }
}

export default async function About() {
  const skillContents: SkillContent[] = await getHistoryAllContents('skill');
  const careerContents: CareerContent[] = await getHistoryAllContents('career');
  
  return (
    <>
      <PageTitle pageTitle="私について" type={{slug: 'about'}} />
      <section className={container}>
        <h2 className={mainTitle}>経歴</h2>
        <Career contents={careerContents} />
      </section>
      <section className={container}>
        <h2 className={mainTitle}>経験スキル</h2>
        <SkillSet contents={skillContents} />
      </section>
    </>
  )
}

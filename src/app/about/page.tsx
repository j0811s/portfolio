import { container, pageTitleContainer, pageTitle, mainTitle } from "../styles/about/index.css";
import { Carrer } from "@/src/app/components/about/Carrer";
import { SkillSet } from "@/src/app/components/about/SkillSet";
import type { SkillContent } from '@/src/app/libs/microcms/history'

import { PageTitle } from "@/src/app/components/common/PageTitle";
import { Metadata, ResolvingMetadata } from 'next';
import { getHistoryList, getHistoryDetail, getHistoryAllContents } from '@/src/app/libs/microcms/history';
import axios from "axios";

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

type SkillContentsParams = {
  skillContents: SkillContent[]
}

export default async function About() {
  const CAREER_API_URL = 'https://gist.githubusercontent.com/j0811s/a8975772efe762dd331a3da28634eeba/raw/843fa02b708cd141aaee6764dcd3431bcd6154af/history.json';
  const careerResponse = await axios.get(CAREER_API_URL);
  const careerData = await careerResponse.data;

  const skillContents: SkillContent[] = await getHistoryAllContents('skill');
  
  return (
    <>
      <PageTitle pageTitle="私について" type={{slug: 'about'}} />

      <section className={container}>
        <h2 className={mainTitle}>経験スキル</h2>
        <SkillSet contents={skillContents} />
      </section>

      <section className={container}>
        <h2 className={mainTitle}>経歴</h2>
        <Carrer histories={careerData} />
      </section>
    </>
  )
}

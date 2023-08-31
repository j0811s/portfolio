import { container, pageTitleContainer, pageTitle, mainTitle } from "../styles/about/index.css";
import { Carrer } from "@/app/components/about/Carrer";
import { SkillSet } from "@/app/components/about/SkillSet";
import { PageTitle } from "@/app/components/common/PageTitle";
import { Metadata, ResolvingMetadata } from 'next';
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

export default async function About() {
  const CAREER_API_URL = 'https://gist.githubusercontent.com/j0811s/a8975772efe762dd331a3da28634eeba/raw/843fa02b708cd141aaee6764dcd3431bcd6154af/history.json';
  const careerResponse = await axios.get(CAREER_API_URL);
  const careerData = await careerResponse.data;

  const SKILLS_API_URL = 'https://gist.githubusercontent.com/j0811s/84ae4708a1ffb819e05757e4f675a006/raw/e108d1f8e2b3fdf810503e5300b5dca8b3d13e39/skills.json';
  const skillsResponse = await axios.get(SKILLS_API_URL);
  const skillsData = await skillsResponse.data;
  
  return (
    <>
      <PageTitle pageTitle="私について" type={{slug: 'about'}} />

      <section className={container}>
        <h2 className={mainTitle}>経験スキル</h2>
        <SkillSet skill={skillsData.language} />
        <SkillSet skill={skillsData.libs} />
        <SkillSet skill={skillsData.templateEngine} />
        <SkillSet skill={skillsData.cms} />
        <SkillSet skill={skillsData.other} />
      </section>

      <section className={container}>
        <h2 className={mainTitle}>経歴</h2>
        <Carrer histories={careerData} />
      </section>
    </>
  )
}

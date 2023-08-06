import { container, pageTitle, mainTitle, contents } from "../styles/about/index.css";
import { Breadcrumb } from "@/app/components/common/Breadcrumb";
import { Carrer } from "@/app/components/about/Carrer";
import { SkillSet } from "@/app/components/about/SkillSet";
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

  const SKILLS_API_URL = 'https://gist.githubusercontent.com/j0811s/84ae4708a1ffb819e05757e4f675a006/raw/d094d0e6294b3c5c52290715835514118531571c/skills.json';
  const skillsResponse = await axios.get(SKILLS_API_URL);
  const skillsData = await skillsResponse.data;
  
  return (
    <>
      <Breadcrumb type={{ slug: 'about' }} />
      <h1 className={pageTitle}>私について</h1>

      <section className={container}>
        <h2 className={mainTitle}>経歴</h2>
        <Carrer histories={careerData} />
      </section>

      <section className={container}>
        <h2 className={mainTitle}>経験スキル</h2>
        <div className={contents}>
          <SkillSet skill={skillsData.language} />
          <SkillSet skill={skillsData.libs} />
          <SkillSet skill={skillsData.templateEngine} />
          <SkillSet skill={skillsData.cms} />
          <SkillSet skill={skillsData.other} />
        </div>
      </section>
    </>
  )
}

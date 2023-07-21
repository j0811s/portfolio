import { container } from "../styles/about/index.css";
import { Breadcrumb } from "@/app/components/common/Breadcrumb";
import { Metadata, ResolvingMetadata } from 'next';

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

export default function About() {
  return (
    <>
      <Breadcrumb type={{slug: 'about'}} />
      <section className={container}>
        <h2>スキルセット</h2>
        <dl>
          <dt>言語</dt>
          <dd>HTML</dd>
          <dd>CSS(SCSS)</dd>
          <dd>JavaScript(TypeScript)</dd>
          <dd>PHP</dd>
        </dl>
        <dl>
          <dt>ライブラリ・フレームワーク</dt>
          <dd>React(Next13)</dd>
          <dd>Vue3(Nuxt3)</dd>
          <dd>jQuery</dd>
        </dl>
        <dl>
          <dt>CMS</dt>
          <dd>WordPress</dd>
          <dd>MicroCMS</dd>
        </dl>
        <dl>
          <dt>その他</dt>
          <dd>Git</dd>
          <dd>GitHub</dd>
          <dd>Webpack</dd>
          <dd>Gulp</dd>
        </dl>
      </section>
    </>
  )
}

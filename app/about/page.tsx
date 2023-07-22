import { container, mainTitle, contents } from "../styles/about/index.css";
import { Breadcrumb } from "@/app/components/common/Breadcrumb";
import { SkillSet } from "@/app/components/about/SkillSet";
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

const language = {
  title: 'マークアップ・プログラム言語',
  items: [
    {
      logo: {
        path: '/logo/language/htmlls.svg',
      },
      name: 'HTML Living Standard'
    },
    {
      logo: {
        path: '/logo/language/css3.svg',
      },
      name: 'CSS3'
    },
    {
      logo: {
        path: '/logo/language/sass.png',
      },
      name: 'Sass'
    },
    {
      logo: {
        path: '/logo/language/js.png',
      },
      name: 'JavaScript'
    },
    {
      logo: {
        path: '/logo/language/ts.svg',
      },
      name: 'TypeScript'
    },
    {
      logo: {
        path: '/logo/language/php.svg',
      },
      name: 'PHP'
    }
  ]
}

const templateEngine  = {
  title: 'テンプレートエンジン',
  items: [
    {
      logo: {
        path: '/logo/templateengine/ejs.svg',
      },
      name: 'EJS'
    }
  ]
}

const lib = {
  title: 'ライブラリ・フレームワーク',
  items: [
    {
      logo: {
        path: '/logo/lib/jQuery.svg',
      },
      name: 'jQuery'
    },
    {
      logo: {
        path: '/logo/lib/react.svg',
      },
      name: 'React'
    },
    {
      logo: {
        path: '/logo/lib/vue.svg',
      },
      name: 'Vue3'
    },
    {
      logo: {
        path: '/logo/lib/next.svg',
      },
      name: 'Next.js'
    },
    {
      logo: {
        path: '/logo/lib/nuxt.svg',
      },
      name: 'Nuxt.js'
    }
  ]
}

const cms = {
  title: 'CMS',
  items: [
    {
      logo: {
        path: '/logo/cms/WordPress.png',
      },
      name: 'WordPress'
    },
    {
      logo: {
        path: '/logo/cms/microCMS.svg',
      },
      name: 'microCMS'
    }
  ]
}

const other = {
  title: 'その他',
  items: [
    {
      logo: {
        path: '/logo/other/Git.svg',
      },
      name: 'Git'
    },
    {
      logo: {
        path: '/logo/other/GitHub.svg',
      },
      name: 'GitHub'
    },
    {
      logo: {
        path: '/logo/other/webpack.svg',
      },
      name: 'webpack5'
    },
    {
      logo: {
        path: '/logo/other/gulp.svg',
      },
      name: 'Gulp4'
    },
    {
      logo: {
        path: '/logo/other/docker.jpg',
      },
      name: 'docker'
    }
  ]
}

export default function About() {
  
  return (
    <>
      <Breadcrumb type={{slug: 'about'}} />
      <section className={container}>
        <h2 className={mainTitle}>スキルセット</h2>
        <div className={contents}>
          <SkillSet skill={language} />
          <SkillSet skill={lib} />
          <SkillSet skill={templateEngine} />
          <SkillSet skill={cms} />
          <SkillSet skill={other} />
        </div>
      </section>
    </>
  )
}

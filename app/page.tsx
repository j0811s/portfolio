import { Breadcrumb } from "@/app/components/common/Breadcrumb"

export default function Top() {
  return (
    <>
      <Breadcrumb />
      <div>
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
      </div>
    </>
  )
}

import { skillContainer, skillTitle, skillItem, logoWrap, logo, logoName } from "./index.css"
import Image from "next/image"
import type { SkillContent, SkillInfo } from '@/src/app/libs/microcms/history'

export const SkillSet = ({ contents }: { contents: SkillContent[] }) => {

  const SkillDdTag = ({ skills }: { skills: SkillInfo }) => {
    return (
      skills.map(skill => (
        <dd className={skillItem} key={skill.name}>
          <figure className={logoWrap}>
            <Image className={logo} src={skill.logo.url} alt={ skill.name } fill />
            <figcaption className={logoName}>{ skill.name }</figcaption>
          </figure>
        </dd>
      ))
    )
  }

  return (
    contents.map(content => {
      return (
        <dl className={skillContainer} key={content.id}>
          <dt className={skillTitle}>{content.category}</dt>
          <SkillDdTag skills={content.skills}  />
        </dl>
      )
    })
  )
}
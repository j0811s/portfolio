import { skillContainer, skillTitle, skillItem, logoWrap, logo, logoName } from "./index.css"
import Image from "next/image"
import type { SkillContent, SkillInfo } from '@/src/app/libs/microcms/history'

type Contents = {
  contents: SkillContent[]
}

type Skills = {
  skills: SkillInfo[]
}

export const SkillSet = ({ contents }: Contents) => {
  const SkillDdTag = ({ skills }: Skills) => {
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
        <dl className={skillContainer}>
          <dt className={skillTitle}>{content.category}</dt>
          <SkillDdTag skills={content.skills}  />
        </dl>
      )
    })
  )
}
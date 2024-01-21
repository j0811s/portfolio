import { skillItem, logoWrap, logo, logoName } from "../index.css"
import type { SkillInfo } from '@/src/app/libs/microcms/history'
import Image from "next/image"
import { memo } from "react"

export const SkillDdTag = ({ skills }: { skills: SkillInfo }) => {
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
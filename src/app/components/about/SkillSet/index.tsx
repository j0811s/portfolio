'use client'
import { skillContainer, skillTitle } from "./index.css";
import type { SkillContent } from '@/src/app/libs/microcms/history';
import { SkillDdTag } from "./SkillDdTag";

export const SkillSet = ({ contents }: { contents: SkillContent[] }) => {
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
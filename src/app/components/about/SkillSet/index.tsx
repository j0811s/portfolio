'use client'
import { skillContainer, skillTitle } from "./index.css"
import type { SkillContent } from '@/src/app/libs/microcms/history'
import useCursorPosition from "../../hooks/useCursorPosition"
import { SkillDdTag } from "./SkillDdTag"
import { useEffect } from "react"

export const SkillSet = ({ contents }: { contents: SkillContent[] }) => {
  const cursorPosition = useCursorPosition();

  useEffect(() => {
    document.documentElement.style.setProperty('--x', String(cursorPosition.x));
    document.documentElement.style.setProperty('--y', String(cursorPosition.y));
  }, [cursorPosition])
  
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
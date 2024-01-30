import { skillItem } from "../index.css";
import type { SkillInfo } from '@/src/app/libs/microcms/history';
import { SkillLogo } from "../SkillLogo";

export const SkillDdTag = ({ skills }: { skills: SkillInfo }) => {
  return (
    skills.map(skill => (
      !skill.hidden &&
      <dd className={skillItem} key={skill.name}>
        <SkillLogo url={skill.logo.url} width={skill.logo.width} height={skill.logo.height} name={skill.name} />
      </dd>
    ))
  )
}
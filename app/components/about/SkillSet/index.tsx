import { skillContainer, skillTitle, skillItem, logoWrap, logo, logoName } from "./index.css"
import Image from "next/image"

type SkillItem = {
  logo: {
    path: string;
    width?: number;
    height?: number;
  };
  name: string
}

type Skill = {
  skill: {
    title: string;
    items: SkillItem[]
  }
}

export const SkillSet = ({ skill }: Skill) => {
  const { title, items } = skill;

  const DefinitionDescription = ({ items }: { items: SkillItem[] }) => {
    return (
      items.map(item => (
        <dd className={skillItem} key={item.name}>
          <figure className={logoWrap}>
            <Image className={logo} src={item.logo.path} alt={ item.name } width={64} height={64} />
            <figcaption className={logoName}>{ item.name }</figcaption>
          </figure>
        </dd>
      ))
    )
  }

  return (
    <dl className={skillContainer}>
      <dt className={skillTitle}>{title}</dt>
      <DefinitionDescription items={items} />
    </dl>
  )
}
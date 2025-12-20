import styles from "@/src/features/skills/styles/SkillSet.module.css";
import Image from "next/image"

export default function SkillSet({ data }: { data: SkillSet[] }) { 
  return (
    <dl className={styles.container}>
      {data.map((skillSet) => (
        <div className={styles.inner} key={skillSet.id}>
          <dt className={styles.name}>{skillSet.category}</dt>
          <dd className={styles.description}>
            <ul className={styles.list}>
              {skillSet.skills.map((skill, i) => (
                !skill.hidden && 
                <li className={`${styles.item} u-neumorphism`} key={`${skill.fieldId}-${i}`}>
                  <Image
                    className={styles.icon}
                    src={skill.logo.url} 
                    alt={skill.name} 
                    width={skill.logo.width} 
                    height={skill.logo.height}
                  />
                  <span className="u-ellipsis">{skill.name}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  )
}
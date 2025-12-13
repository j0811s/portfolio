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
                <li className={styles.item} key={`${skill.fieldId}-${i}`}>
                  <Image
                    className={styles.icon}
                    src={skill.logo.url} 
                    alt={skill.name} 
                    width={skill.logo.width} 
                    height={skill.logo.height}
                  />
                  {skill.name}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  )
}
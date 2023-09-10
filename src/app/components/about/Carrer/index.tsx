import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { container, warapper, data, iconContainer, icon, mainTitle, readText } from "./index.css";

type Histories = [
  {
    id: number,
    year: string,
    outline: string[]
  }
]

type Carrer = ({ histories }: { histories: Histories }) => JSX.Element;

export const Carrer: Carrer = ({ histories }) => {
  return (
    <div className={container}>
      <dl className={warapper}>
        {histories.map(history => (
        <div className={data} key={history.id}>
            <dt className={mainTitle}>
              <span className={iconContainer}>
                <FontAwesomeIcon className={icon} icon={faCalendarCheck} />
              </span>
              <span>{history.year}</span>
            </dt>
          {
            history.outline.map(outline => (
              <dd className={readText} key={outline}>・{outline}</dd>
            ))
          }
        </div>
        ))}
      </dl>
    </div>
  )
}
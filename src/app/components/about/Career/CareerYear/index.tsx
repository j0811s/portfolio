import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { mainTitle, iconContainer, icon } from "./index.css";

export const CareerYear = ({ period }: { period: string }) => {
  return (
    <h3 className={mainTitle}>
      <span className={iconContainer}>
        <FontAwesomeIcon className={icon} icon={faCalendarCheck} />
      </span>
      <span>{period}</span>
    </h3>
  )
}
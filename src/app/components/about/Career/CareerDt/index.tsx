import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { mainTitle, iconContainer, icon } from "./index.css";

export const CareerDt = ({ period }: { period: string }) => {
  return (
    <dt className={mainTitle}>
      <span className={iconContainer}>
        <FontAwesomeIcon className={icon} icon={faCalendarCheck} />
      </span>
      <span>{period}</span>
    </dt>
  )
}
import { button, buttonInner, buttonArrowIcon } from "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { ReactNode } from 'react';

type CtaButton = {
  href?: string,
  children: ReactNode
}

export const CtaButton = ({ href, children }: CtaButton) => {

  const buttonElement = () => {
    return (
      href
      ?
        <Link className={button} href={href}>
          <span className={buttonInner}>
            <span>{children}</span>
            <FontAwesomeIcon icon={faArrowRightLong} className={buttonArrowIcon} />
          </span>
        </Link>
      :
        <button className={button} type="button">
          <span className={buttonInner}>
            <span>{children}</span>
            <FontAwesomeIcon icon={faArrowRightLong} className={buttonArrowIcon} />
          </span>
        </button>
    )
  }

  return (
    buttonElement()
  )
} 
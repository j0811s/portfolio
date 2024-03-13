import { container, button, buttonInner, buttonArrowIcon } from "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface Props extends React.ComponentPropsWithoutRef<'button'> { 
  href?: string
  prev?: boolean
  children: React.ReactNode
}

export const CtaButton = ({ href, prev, children }: Props) => {

  const buttonElement = () => {
    return (
      href
      ?
        <Link className={`${button} ${prev ? 'mod-prev': ''}`} href={href}>
          <span className={buttonInner}>
            { prev && <FontAwesomeIcon icon={faArrowLeftLong} className={`${buttonArrowIcon} mod-prev`} /> }
            <span>{children}</span>
            { !prev && <FontAwesomeIcon icon={faArrowRightLong} className={buttonArrowIcon} /> }
          </span>
        </Link>
      :
        <button className={`${button} ${prev ? 'mod-prev': ''}`} type="button">
          <span className={buttonInner}>
            { prev && <FontAwesomeIcon icon={faArrowLeftLong} className={`${buttonArrowIcon} mod-prev`} /> }
            <span>{children}</span>
            { !prev && <FontAwesomeIcon icon={faArrowRightLong} className={buttonArrowIcon} /> }
          </span>
        </button>
    )
  }

  return (
    <div className={container}>
      {buttonElement()}
    </div>
  )
} 
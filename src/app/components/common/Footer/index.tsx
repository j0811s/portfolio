'use client'

import {
  container, pageTop, copyright
} from "./index.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

export const Footer = ({ modClassName }: { modClassName: string }) => {
  
  const scrollToPageTop = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer className={`${container} ${modClassName}`}>
      <a className={pageTop} href="#top" onClick={scrollToPageTop}>PAGETOP <FontAwesomeIcon icon={faChevronUp} /></a>
      <small className={copyright}>&copy; 2023 J.Sato</small>
    </footer>
  )
}
'use client'

import { PageTopButton } from "../PageTopButton"
import { container, copyright } from "./index.css"

export const Footer = ({ modClassName }: { modClassName: string }) => {
  return (
    <>
      <PageTopButton />
      <footer className={`${container} ${modClassName}`}>
        <small className={copyright}>&copy; 2023 J.Sato</small>
      </footer>
    </>
  )
}
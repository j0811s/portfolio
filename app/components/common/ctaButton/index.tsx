import { button, buttonIcon, buttonText } from "./index.css";
import Link from "next/link";
import type { ReactNode } from 'react';

type CtaButton = {
  modClass?: string,
  href: string,
  children: ReactNode
}

export const CtaButton = ({
  modClass = '',
  href = '/',
  children
}: CtaButton) => {
  return (
    <div className={modClass}>
      <Link className={button} href={href}>
        <span className={buttonText}>{children}</span>
        <span className={buttonIcon}></span>
      </Link>
    </div>
  )
} 
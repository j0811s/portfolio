import { type } from "os"
import {
  container, lines, line, textContainer, text
} from "./index.css"

type HumburgerButtonOption = {
  modClass?: string
}

export const HumburgerButton = ({modClass}: HumburgerButtonOption) => {

  return (
    <button className={`${container} ${modClass}`} type="button">
      <div className={lines}>
        <span className={line}></span>
        <span className={line}></span>
        <span className={line}></span>
      </div>
      <div className={textContainer}>
        <span className={text}>開く</span>
        <span className={text}>閉じる</span>
      </div>
    </button>
  )
}
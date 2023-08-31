
import { container, mainTitle, readText } from "./index.css";

type Histories = [
  {
    id: number,
    year: string,
    outline: string[]
  }
]

type Carrer = ({ histories }: { histories: Histories }) => JSX.Element[];

export const Carrer: Carrer = ({ histories }) => {
  return (
    histories.map(history => (
      <dl className={container} key={history.id}>
        <dt className={mainTitle}>{history.year}</dt>
        {
          history.outline.map(outline => (
            <dd className={readText} key={outline}>・{outline}</dd>
          ))
        }
      </dl>
    ))
  )
}
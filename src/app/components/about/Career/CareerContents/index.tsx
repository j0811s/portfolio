import type { CareerContent } from '@/src/app/libs/microcms/history';
import { CareerDd } from "../CareerDd";
import { CareerDt } from "../CareerDt";
import { data } from "./index.css";

export const CareerContents = ({ contents }: { contents: CareerContent[] }) => {
  return (
    contents.map(content => (
      <div className={data} key={content.id}>
        <CareerDt period={content.period} />
        {
          content.info.map(info => (
            <>
              <CareerDd body={info.project} headline={true} key={info.project} />
              <CareerDd body={info.details} headline={false} key={info.details} />
            </>
          ))
        }
      </div>
    ))
  )
}
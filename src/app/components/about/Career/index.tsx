import { container } from "./index.css";

import type { CareerContent } from '@/src/app/libs/microcms/history';
import { CareerList } from "./CareerList";
import { CareerContents } from "./CareerContents";

type Career = {
  contents: CareerContent[];
}

export const Career: React.FC<Career> = ({ contents }) => {
  return (
    <div className={container}>
      <CareerList>
        <CareerContents contents={contents} />
      </CareerList>
    </div>
  )
}
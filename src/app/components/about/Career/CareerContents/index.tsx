import React from "react";
import { data, section, inner } from "./index.css";
import type { CareerContent } from '@/src/app/libs/microcms/history';
import { CareerItem } from "../CareerItem";
import { CareerYear } from '../CareerYear';

export const CareerContents = ({ contents }: { contents: CareerContent[] }) => {
  return (
    <div className={data}>
      {
        contents.map((content, i) => (
          <section className={section} key={content.id}>
            <CareerYear period={content.period} />
            <dl>
              {
                content.info.map((info, i) => (
                  <div className={inner} key={`${content.id}-info-${i}`}>
                    <CareerItem body={info.project} headline={true} key={info.project} />
                    <CareerItem body={info.details} headline={false} key={info.details} />
                  </div>
                ))
              }
            </dl>
          </section>
        ))
      }
    </div>
  )
}
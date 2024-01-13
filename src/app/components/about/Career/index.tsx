import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { container, wrapper, data, iconContainer, icon, mainTitle, readText, textBold } from "./index.css";
import type { CareerContent, CareerInfo } from '@/src/app/libs/microcms/history'

const CareerDdTag = ({ body, headline }: { body: string, headline: boolean }) => {
  const text = body.split('\n').map((item, index) => {
    return (
      <React.Fragment key={index}>
        {item}
        <br />
      </React.Fragment>
    );
  });

  return <dd className={`${readText} ${headline ? textBold : ''}`}>{text}</dd>;
};

type Career = ({ contents }: { contents: CareerContent[] }) => JSX.Element;

export const Career: Career = ({ contents }) => {
  return (
    <div className={container}>
      <dl className={wrapper}>
        {contents.map(content => (
        <div className={data} key={content.id}>
          <dt className={mainTitle}>
            <span className={iconContainer}>
              <FontAwesomeIcon className={icon} icon={faCalendarCheck} />
            </span>
            <span>{content.period}</span>
          </dt>
          {
            content.info.map(info => (
              <>
                <CareerDdTag body={info.project} headline={true} key={info.project} />
                <CareerDdTag body={info.details} headline={false} key={info.details} />
              </>
            ))
          }
        </div>
        ))}
      </dl>
    </div>
  )
}
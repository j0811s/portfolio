import React from "react";
import { readText, textBold } from "./index.css";

export const CareerDd = ({ body, headline }: { body: string, headline: boolean }) => {
  const text = body.split('\n').map((item, index) => {
    return (
      <React.Fragment key={index}>
        {item}
        <br />
      </React.Fragment>
    );
  });

  return <dd className={`${readText} ${headline ? textBold : ''}`}>{text}</dd>;
}
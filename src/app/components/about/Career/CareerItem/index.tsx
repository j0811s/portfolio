import React from "react";
import { readText, textBold } from "./index.css";

import parse, { HTMLReactParserOptions, Element, Text, DOMNode } from "html-react-parser";

export const CareerItem = ({ body, headline }: { body: string, headline: boolean }) => {
  // const text = body.split('\n').map((item, index) => {
  //   return (
  //     <React.Fragment key={index}>
  //       {item}
  //     </React.Fragment>
  //   );
  // });

  return headline
    ? <dt className={`${readText} ${headline ? textBold : ''}`}>{body}</dt>
    : <dd className={`${readText} ${headline ? textBold : ''}`}>{body}</dd>;
}
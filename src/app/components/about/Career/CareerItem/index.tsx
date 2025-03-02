import React from "react";
import { readText, textBold } from "./index.css";

export const CareerItem = ({ body, headline }: { body: string, headline: boolean }) => {
  return headline
    ? <dt className={`${readText} ${headline ? textBold : ''}`}>{body}</dt>
    : <dd className={`${readText} ${headline ? textBold : ''}`}>{body}</dd>;
}
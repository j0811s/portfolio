import React from "react";
import { readText, headline, textUrl } from "./index.css";

export const CareerItem = ({ body, type }: { body: string, type: 'project' | 'details' | 'url', url?: boolean }) => {
  const item = () => {
    switch (type) {
      case 'project': {
        return <dt className={`${readText} ${headline}`}>{body}</dt>;
      }
      case 'details': {
        return <dd className={readText}>{body}</dd>;
      }
      case 'url': {
        return <dd className={readText}><a className={textUrl} href={body} target="_blank" rel="noreferrer">{body}</a></dd>;
      }
      default: {
        return <dd className={readText}>{body}</dd>;
      }
    }
  }

  return item();
}
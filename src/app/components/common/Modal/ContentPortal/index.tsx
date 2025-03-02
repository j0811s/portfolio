import { createPortal } from "react-dom";

import type { JSX } from "react";

type Props = {
  children: JSX.Element,
  insertElement?: HTMLElement
}

export const ContentPortal = ({ children, insertElement = document.body }: Props) => {
  return createPortal(children, insertElement);
}
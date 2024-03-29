import { createPortal } from "react-dom";

type Props = {
  children: JSX.Element,
  insertElement?: HTMLElement
}

export const ContentPortal = ({ children, insertElement = document.body }: Props) => {
  return createPortal(children, insertElement);
}
import { useState } from "react";

type Props = {
  initialValue?: boolean;
}

export default function useModalStatus({ initialValue = false }: Props) { 
  const [isOpen, setIsOpen] = useState(initialValue);

  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  const statusProps = {
    isOpen,
    modalOpen,
    modalClose
  }

  return statusProps;
}
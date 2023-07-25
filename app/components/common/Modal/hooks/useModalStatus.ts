import { useState } from "react";

type Props = {
  initialValue?: boolean;
}

export default function useModalStatus({ initialValue = false }: Props) { 
  const [isOpen, setIsOpen] = useState(initialValue);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const statusProps = {
    isOpen,
    openModal,
    closeModal
  }

  return statusProps;
}
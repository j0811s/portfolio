'use client';
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext<[boolean, () => void, () => void]>([
  false, () => {}, () => {}
]);

export const ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={[isOpen, modalOpen, modalClose]}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModalContext = (): [boolean, () => void, () => void] => {
  const context = useContext(ModalContext);
  
  return context;
}
'use client';

import styles from '@/src/features/header/styles/Drawer.module.css';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isDrawerOpenAtom } from '@/src/features/header/stores/atoms';
import { faHouse, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { GithubLink } from '@/src/features/header/components/GithubLink';

const waitModalAnimation = (
  modal: HTMLDialogElement
): Promise<PromiseSettledResult<Animation>[]> => {
  const animation = modal.getAnimations();
  if (animation.length === 0) {
    return Promise.resolve([]);
  }
  return Promise.allSettled([...animation].map((animation) => animation.finished));
};

const MenuList = ({
  children,
  dialogRef,
}: {
  children: React.ReactNode;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) =>
  createPortal(
    <dialog className={styles.drawer} ref={dialogRef}>
      <nav className={styles.nav} aria-label="サイトナビゲーションメニュー">
        <ul className={styles.navList}>
          <li>
            <Link href={`/`}>
              <FontAwesomeIcon icon={faHouse} />
              <span>トップページ</span>
            </Link>
          </li>
          <li>
            <Link href={`/blog/`}>
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>投稿</span>
            </Link>
          </li>
          <li>
            <GithubLink />
          </li>
        </ul>
        {children}
      </nav>
    </dialog>,
    document.body
  );

export default function Drawer({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const openDialog = () => {
      dialog.showModal();
      dialog.dataset.open = 'true';
      setIsDrawerOpen(true);
      document.body.style.overflow = 'hidden';
    };

    const closeDialog = async () => {
      dialog.dataset.open = '';
      await waitModalAnimation(dialog);
      dialog.close();
      setIsDrawerOpen(false);
      document.body.style.overflow = '';
    };

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        await closeDialog();
      }
    };

    if (isDrawerOpen && !dialog.open) {
      openDialog();
    }

    if (!isDrawerOpen && dialog.open) {
      closeDialog();
    }

    dialog.addEventListener('click', closeDialog);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('click', closeDialog);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

  return isDrawerOpen && <MenuList dialogRef={dialogRef}>{children}</MenuList>;
}

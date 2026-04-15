'use client';

import styles from '@/src/features/header/styles/Drawer.module.css';
import { useAtom } from 'jotai';
import { isDrawerOpenAtom } from '@/src/features/header/stores/atoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function DrawerOpenButton() {
  const [_isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);

  return (
    <button
      aria-label="メニューを開く"
      className={styles.openButton}
      onClick={() => setIsDrawerOpen(true)}
      type="button"
    >
      <FontAwesomeIcon icon={faBars} />
    </button>
  );
}

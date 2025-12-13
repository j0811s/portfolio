'use client';

import styles from "@/src/features/header/styles/Drawer.module.css";
import { CtaActionButton } from "@/src/components";

export default function DrawerCloseButton() {
  return (
    <div className={styles.buttonContainer}>
      <CtaActionButton
        className={styles.closeButton}
        type="button"
        crossIcon={true}
      >
        閉じる
      </CtaActionButton>
    </div>
  );
}
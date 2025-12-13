'use client';

import clsx from "clsx";
import styles from "@/src/features/footer/styles/PageTop.module.css";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useMounted } from "@/src/features/footer/hooks/useMounted";
import { useScrollThreshold } from "@/src/features/footer/hooks/useScrollThreshold";
import { usePageTop } from "@/src/features/footer/hooks/usePageTop";

export default function PageTop() {
  const mounted = useMounted();
  const thresholdPassed = useScrollThreshold(66);
  const { scrollToTop } = usePageTop();

  return mounted && createPortal(
    <button
      className={clsx(styles.container, thresholdPassed && styles['add-show'])}
      onClick={scrollToTop}
      type="button"
      aria-label="ページトップへ戻る"
    >
      <FontAwesomeIcon icon={faChevronUp} />
    </button>, document.body);
}
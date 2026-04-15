import styles from '@/src/features/skeleton/styles/SkeletonImage.module.css';

function SkeletonImage() {
  return (
    <div
      role="img"
      className={styles.skeletonImage}
      aria-busy="true"
      aria-label="画像を読み込み中"
    ></div>
  );
}

export default SkeletonImage;

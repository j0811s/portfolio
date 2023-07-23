export default function updateHeight(e: any) {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--update-page-height', `${vh}px`);
  if (e?.type === 'resize') window.requestAnimationFrame(updateHeight);
}
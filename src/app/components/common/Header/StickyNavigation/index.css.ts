import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const navigationWrapper = style({
  
});

globalStyle(`${navigationWrapper}:has([data-drawer-mode="true"])`, {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 1280,
  margin: '0 auto',
});

globalStyle(`${navigationWrapper}:has([data-drawer-mode="false"])`, {
  position: 'sticky',
  top: '2rem',
  left: 0,
  zIndex: 9998,
  margin: '2rem auto',
});
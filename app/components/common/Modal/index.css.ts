import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

globalStyle('body.add-disableScroll', {
  overflow: 'hidden'
});

const modalOpen = keyframes({
  '0%': {
    visibility: 'hidden',
    opacity: 0,
  },
  '100%': {
    visibility: 'visible',
    opacity: 1,
  }
});

const modalClose = keyframes({
  '0%': {
    visibility: 'visible',
    opacity: 1,
  },
  '100%': {
    visibility: 'hidden',
    opacity: 0,
  }
});

export const modalAnimation = style({
  visibility: 'hidden',
  opacity: 0,
  selectors: {
    "&.add-openAnimation": {
      animation: `${modalOpen} 0.6s forwards ease`,
    },
    "&.add-closeAnimation": {
      animation: `${modalClose} 0.6s forwards ease`,
    }
  }
});

export const modalOverlay = style({
  position: 'fixed',
  top: 60,
  left: 0,
  width: '100%',
  height: 'calc(100% - 60px)',
  zIndex: 9999,
  backgroundColor: 'rgb(238, 238, 238, .9)'
});

export const modalContainer = style({
  overflow: 'auto',
  position: 'fixed',
  top: 60,
  left: 0,
  width: '100%',
  height: 'calc(100% - 60px)',
  zIndex: 9999,
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  padding: '1em',
  backgroundColor: 'transparent',
});

export const modalWrapper = style({
  margin: 'auto',
  color: '#000',
  backgroundColor: 'transparent',
});

export const modalInner = style({
  
});

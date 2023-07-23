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
      animation: `${modalOpen} 1s forwards ease`,
    },
    "&.add-closeAnimation": {
      animation: `${modalClose} 1s forwards ease`,
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
  backgroundColor: 'rgb(238, 238, 238, .8)',
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
  padding: '1em'
});

export const modalWrapper = style({
  margin: 'auto',
  color: '#000',
  backgroundColor: '#fff',
  padding: '1em'
});

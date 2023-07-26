import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";


const openModal = keyframes({
  '0%': {
    visibility: 'hidden',
    opacity: 0,
  },
  '100%': {
    visibility: 'visible',
    opacity: 1,
  }
});

const closeModal = keyframes({
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
      animation: `${openModal} 0.6s forwards ease`,
    },
    "&.add-closeAnimation": {
      animation: `${closeModal} 0.6s forwards ease`,
    }
  }
});

export const modalRoot = style({
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

export const modalOverlay = style({
  position: 'fixed',
  top: 60,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: '-1',
  backgroundColor: 'rgb(238, 238, 238, .9)'
});

export const modalContainer = style({
  margin: 'auto',
  color: '#000',
});

export const modalWrapper = style({
});

import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

const openModal = keyframes({
  '0%': {
    visibility: 'hidden',
    opacity: 0,
    transform: 'translate3d(0, -100%, 0)',
  },
  '100%': {
    visibility: 'visible',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  }
});

const closeModal = keyframes({
  '0%': {
    visibility: 'visible',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  '100%': {
    visibility: 'hidden',
    opacity: 0,
    transform: 'translate3d(0, -100%, 0)',
  }
});

export const modalAnimation = style({
  visibility: 'hidden',
  opacity: 0,
  transform: 'translate3d(0, -100%, 0)',
  selectors: {
    "&.add-openAnimation": {
      visibility: 'hidden',
      opacity: 0,
      transform: 'translate3d(0, -100%, 0)',
      animation: `${openModal} 0.4s forwards ease`,
    },
    "&.add-closeAnimation": {
      visibility: 'visible',
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      animation: `${closeModal} 0.4s forwards ease`,
    }
  }
});

export const modalRoot = style({
  overflow: 'auto',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100vh',
  zIndex: 9998,
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  padding: '1em',
  backgroundColor: 'transparent',
});

export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: '-1',
  backdropFilter: 'blur(2px)',
  backgroundColor: `${vars.color.background.primary}`,
});

export const modalContainer = style({
  margin: 'auto',
  color: '#000',
});

export const modalWrapper = style({
});

import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const enabled = style({
  opacity: 1,
});

export const disabled = style({
  opacity: 0,
});

export const container = style({
  width: 'auto',
  margin: 'auto',
  color: `${vars.color.background.dark}`,
  backgroundColor: `${vars.color.background.dark}`,
  borderRadius: '9999px',
  transition: 'color .2s ease-in-out, background-color .2s ease-in-out',
});
globalStyle(`.${container}.${enabled}`, {
  color: `${vars.color.background.light}`,
  backgroundColor: `${vars.color.background.light}`,
});

export const button = style({
  position: 'relative',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5em',
  fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
  width: `calc( 56 / ${vars.font.size} * 1rem )`,
  margin: '0',
  padding: '0.5em',
  borderRadius: '9999px',
  '@media': {
    '(min-width: 960px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  },
  selectors: {
    '&::before': {
      content: '',
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      width: 'calc(50% - 0.25em)',
      margin: 'auto 0.25em',
      borderRadius: 9999,
      backgroundColor: `${vars.color.background.white}`,
      aspectRatio: '1',
      transform: 'translate3d(100%, 0, 0)',
      transition: 'transform .2s ease-in-out',
    }
  }
});
globalStyle(`.${button}.${enabled}::before`, {
  transform: 'translate3d(0, 0, 0)',
});

export const icon = style({
  boxSizing: 'border-box !important' as 'border-box',
  display: 'block !important' as 'block',
  width: '100%',
  margin: '0',
  padding: '0',
  aspectRatio: '1',
  zIndex: 1.
});

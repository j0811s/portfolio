import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const mainTitle = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: `calc( 20 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 24 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const iconContainer = style({
  position: 'relative',
  marginRight: `calc( 20 / ${vars.font.size} * 1rem )`,
  '@media': {
    'screen and (min-width: 600px)': {
      marginRight: `calc( 20 / ${vars.font.size} * 1rem )`,
    },
  },
  selectors: {
    '&::before': {
      content: '',
      display: 'block',
      width: 40,
      height: 40,
      border: `2px solid #fff`,
      borderRadius: 9999,
      backgroundColor: `${vars.color.accent.main}`,
      boxShadow: `0 0 2px ${vars.color.accent.sub}`,
    }
  }
});

export const icon = style({
  color: '#fff',
  fill: 'currentcolor',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  fontSize: '1.2rem',
});
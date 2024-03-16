import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

const progress = keyframes({
  '0%': {
    bottom: '100%',
  },
  '100%': {
    bottom: 0,
  },
});


export const wrapper = style({
  position: 'relative',
  display: 'block',
  margin: '40px auto 0',
  padding: '48px 0',
  borderRadius: 8,
  '@media': {
    'screen and (min-width: 960px)': {
      margin: '50px auto 0',
      padding: '50px 0',
    }
  },
  selectors: {
    '&::before, &::after': {
      content: '',
      position: 'absolute',
      top: 0,
      left: 23,
      display: 'block',
      width: 6,
      '@media': {
        'screen and (min-width: 960px)': {
          left: 23,
        }
      },
    },
    '&::before': {
      bottom: 0,
      zIndex: 0,
      backgroundColor: `${vars.color.tertiary}`,
    },
    '&::after': {
      bottom: '100%',
      zIndex: 1,
      backgroundColor: `${vars.color.accent.sub}`,
    },
    '&[data-in-view="true"]::after': {
      animation: `${progress} 0.8s forwards ease-in-out`,
    }
  }
});
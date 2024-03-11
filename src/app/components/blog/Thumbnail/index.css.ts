import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

const mask = keyframes({
  '0%': {
    transform: 'scaleX(1)',
  },
  '100%': {
    transform: 'scaleX(0)',
  },
});


export const postListEyecatchContainer = style({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: `${vars.color.secondary}`,
  borderRadius: 12,
  selectors: {
    '&[data-in-view]::after': {
      content: '',
      display: 'block',
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      backgroundColor: `${vars.color.accent.main}`,
      transform: 'scaleX(1)',
      transformOrigin: 'right',
      backfaceVisibility: 'hidden',
    },
    '&[data-in-view="true"]::after': {
      animation: `${mask} 0.3s forwards ease-in-out`,
    }
  }
});

export const postListEyecatch = style({
  display: 'block',
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  transform: 'scale(1.0)',
  transition: 'transform 0.2s ease-in-out'
});


globalStyle(`a:hover > ${postListEyecatchContainer} > ${postListEyecatch}`, {
  '@media': {
    'screen and (min-width: 960px)': {
      transform: 'scale(1.1)',
    }
  }
});
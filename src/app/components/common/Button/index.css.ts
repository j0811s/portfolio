import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const button = style({
  overflow: 'hidden',
  position: 'relative',
  display: 'inline-block',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  width: 'fit-content',
  margin: '0',
  padding: '1em 1.6em',
  textAlign: 'center',
  overflowWrap: 'break-word',
  color: `${vars.color.text.white}`,
  backgroundColor: `${vars.color.accent.dark}`,
  borderRadius: '8px',
  '@media': {
    '(min-width: 960px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
      transition: 'color 0.2s ease-in-out',
    }
  },
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 0,
      width: '100%',
      height: '100%',
      backgroundColor: `${vars.color.primary}`,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.2s ease-in-out'
    }, 
    '&.mod-prev::before': {
      left: 'auto',
      right: 0,
      transformOrigin: 'right',
    },
    '&:hover': {
      '@media': {
        '(min-width: 960px)': {
          color: '#fff',
        }
      }
    },
    '&:hover::before': {
      '@media': {
        '(min-width: 960px)': {
          transform: 'scaleX(1)',
        }
      }
    }
  }
});

export const buttonInner = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  zIndex: 1,
});

export const buttonArrowIcon = style({
  transform: 'translate3d(0, 0, 0)',
  transition: 'transform 0.2s ease-in-out'
});

globalStyle(`${button}:hover ${buttonArrowIcon}`, {
  '@media': {
    '(min-width: 960px)': {
      transform: 'translate3d(4px, 0, 0)',
    }
  }
});

globalStyle(`${button}:hover ${buttonArrowIcon}.mod-prev`, {
  '@media': {
    '(min-width: 960px)': {
      transform: 'translate3d(-4px, 0, 0)',
    }
  }
});
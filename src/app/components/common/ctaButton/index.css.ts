import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const button = style({
  display: 'inline-flex',
  gap: 10,
  fontSize: `calc( 10 / ${vars.font.size} * 1rem )`,
  alignItems: 'center',
  height: 26,
  margin: '0 auto',
  padding: '0.5em 1em',
  textAlign: 'center',
  overflowWrap: 'break-word',
  color: '#000',
  backgroundColor: '#fff',
  border: `1px solid #000`,
  borderRadius: 100,
  '@media': {
    '(min-width: 960px)': {
      height: 36,
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
      transition: 'background-color .4s ease, color .4s ease',
    }
  },
  selectors: {
    '&:hover': {
      '@media': {
        '(min-width: 960px)': {
          color: '#fff',
          backgroundColor: '#000',
        }
      }
    }
  }
});

export const buttonIcon = style({
  display: 'inline-block',
  width: '0.6em',
  height: '0.6em',
  borderTop: '1px solid #000',
  borderRight: '1px solid #000',
  transform: 'rotate(45deg)',
  transition: 'border-color .4s ease',
  '@media': {
    '(min-width: 960px)': {
      width: '0.8em',
      height: '0.8em',
    }
  }
});

export const buttonText = style({
  flexShrink: 1,
});

globalStyle(`${button}:hover ${buttonIcon}`, {
  '@media': {
    '(min-width: 960px)': {
      borderColor: '#fff'
    }
  }
});
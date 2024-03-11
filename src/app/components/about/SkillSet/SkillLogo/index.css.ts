import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

const fadeUp = keyframes({
  '0%': {
    visibility: 'hidden',
    opacity: 0,
    transform: 'translate3d(0, 33%, 0)',
  },
  '100%': {
    visibility: 'visible',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  }
});

export const logoWrap = style({
  visibility: 'hidden',
  opacity: 0,
  transform: 'translate3d(0, 33%, 0)',
  width: '100%',
  maxWidth: '160px',
  height: '100%',
  margin: 'auto',
  selectors: {
    "&[data-in-view=true]": {
      animation: `${fadeUp} 0.4s forwards ease-in-out`,
    }
  }
});

export const logo = style({
  position: 'relative !important' as 'relative',
  display: 'block',
  width: 'auto!important',
  maxWidth: '100%',
  height: `calc( 32 / ${vars.font.size} * 1rem )!important`,
  margin: '0 auto',
  objectFit: 'contain',
  '@media': {
    'screen and (min-width: 960px)': {
      height: `calc( 48 / ${vars.font.size} * 1rem )!important`,
    }
  },
});

export const logoName = style({
  color: `${vars.color.text.secondary}`,
  display: 'block',
  textAlign: 'center',
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  lineHeight: '1.2',
  marginTop: '0.75em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (min-width: 960px)': {
      marginTop: '1em',
    }
  },
});
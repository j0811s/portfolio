import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

const fadeUp = keyframes({
  '0%': {
    visibility: 'hidden',
    opacity: 0.0001,
    transform: 'translate3d(0, 33%, 0)',
  },
  '100%': {
    visibility: 'visible',
    opacity: 1,
    transform: 'translate3d(0, 0.0001%, 0)',
  }
});

export const srOnly = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
});

export const firstViewContainer = style({
  position: 'relative',
  backgroundColor: `${vars.color.primary}`,
  height: '40vh',
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      height: '60vh',
    },
    'screen and (min-width: 960px)': {
      height: '70vh',
    }
  }
});

export const siteTitle = style({
  display: 'grid',
  placeContent: 'center',
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  textAlign: 'center',
  color: `${vars.color.text.white}`,
  background: `linear-gradient(10deg, rgb(0, 0, 0) 5%, rgb(30, 38, 38, 0.3) 70%) no-repeat top`,
  backdropFilter: 'blur(2px)',
  fontSize: `calc( 40 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  lineHeight: 1.1,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 72 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 80 / ${vars.font.size} * 1rem )`,
      backdropFilter: 'blur(3px)',
    }
  }
});

export const siteTitleInner = style({
  display: 'block',
});

export const siteTitleParts = style({
  overflow: 'hidden'
});

export const siteTitlePartsText = style({
  visibility: 'hidden',
  opacity: 0.0001,
  transform: 'translate3d(0, 33%, 0)',
  selectors: {
    "body &": {
      animation: `${fadeUp} 0.5s 0.4s forwards ease-in-out`,
    },
    "&[data-index='1']": {
      animationDelay: '0.7s'
    }
  }
});

export const titleTag = style({
  color: `${vars.color.code.tag}`,
});

export const titleCode = style({
  color: `${vars.color.accent.dark}`,
  fontSize: '1.4em',
});
import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

const fade = keyframes({
  '0%': {
    opacity: 0.0001,
  },
  '100%': {
    opacity: 1,
  }
});

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

const slideInLeft = keyframes({
  '0%': {
    visibility: 'hidden',
    opacity: 0.0001,
    transform: 'translate3d(3%, 0, 0)',
  },
  '100%': {
    visibility: 'visible',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  backgroundColor: `${vars.color.primary}`,
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
  top: '50%',
  left: '10%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  color: `${vars.color.text.white}`,
  fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '0.08em',
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 56 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 64 / ${vars.font.size} * 1rem )`,
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
  fontSize: '0.6em',
});

export const titleCode = style({
  textTransform: 'uppercase',
  color: `${vars.color.accent.dark}`,
});

export const movie = style({
  opacity: 0.0001,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  aspectRatio: '16/9',
  '@media': {
    'screen and (min-width: 768px)': {
      visibility: 'hidden',
      transform: 'translate3d(3%, 0, 0)',
      width: '60%',
      maxHeight: '80%',
    }
  },
  selectors: {
    '&::after': {
      content: '',
      display: 'block',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background: `linear-gradient(10deg, rgb(0, 0, 0) 5%, rgb(30, 38, 38, 0.3) 70%) no-repeat top`,
      backdropFilter: 'blur(2px)',
    },
    "body &": {
      '@media': {
        'screen and (max-width: 767px)': {
          animation: `${fade} 0.4s 1.2s forwards ease`,
        },
        'screen and (min-width: 768px)': {
          animation: `${slideInLeft} 0.6s 1.2s forwards ease`,
        }
      },
    },
  }
});
import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

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
  height: '50vh',
});

export const siteTitle = style({
  display: 'grid',
  placeContent: 'center',
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  textAlign: 'center',
  color: `${vars.color.text.white}`,
  backdropFilter: 'blur(4px)',
  backgroundColor: 'rgb(30, 38, 38, 0.3)',
  fontSize: `calc( 22 / ${vars.font.size} * 1rem )`,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 600px) and (max-width: 959px)': {
      fontSize: `calc( 36 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 960px)': {
      fontSize: `calc( 56 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const siteTitleInner = style({
  display: 'flex',
  alignItems: 'center',
});

export const titleTag = style({
  color: `${vars.color.code.tag}`,
});

export const titleCode = style({
  color: `${vars.color.code.text}`,
});
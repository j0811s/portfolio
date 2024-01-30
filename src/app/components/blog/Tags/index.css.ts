import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  // backgroundColor: '#fff',
});

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5em',
  padding: '1em 1.5em',
  '@media': {
    'screen and (min-width: 960px)': {
      padding: '1em',
    }
  },
  selectors: {
    '&.mod-gapNoneX': {
      paddingLeft: 0,
      paddingRight: 0,
    }
  }
});

export const listIetmTitle= style({
  color: `${vars.color.text.white}`,
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  backgroundColor: `${vars.color.secondary}`,
  padding: '1em',
  borderRadius: '4px',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const listItemTitleIcon= style({
  color: `${vars.color.gray.taupe}`
});

export const listIetmTitleText= style({
  paddingLeft: '0.5em',
});
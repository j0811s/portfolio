import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  // backgroundColor: '#fff',
});

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5em',
  padding: '1em 0.5em 0.65em'
});

export const listIetmTitle= style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 500,
  backgroundColor: `${vars.color.gray.default}`,
  padding: '1em',
  borderRadius: '4px',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const listItemTitleIcon= style({
  color: `${vars.color.gray.dark}`
});

export const listIetmTitleText = style({
  paddingLeft: '0.5em',
});
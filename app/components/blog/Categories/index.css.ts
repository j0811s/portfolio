import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const container = style({
  overflow: 'hidden',
  backgroundColor: '#fff',
  borderRadius: '4px'
});

export const list = style({
  padding: '1em'
});

export const listItem = style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  selectors: {
    '&:not(:first-of-type)': {
      margin: '0.5em 0 0',
    }
  }
});

export const listIetmLink = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5em',
  borderRadius: '4px',
  backgroundColor: 'transparent',
  transition: 'background-color 0.2s linear',
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          backgroundColor: `${vars.color.gray.default}`
        }
      }
    }
  }
});

export const numberBadge = style({
  display: 'block',
  padding: '0.25em',
  borderRadius: '9999px',
  minWidth: 24,
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  fontWeight: 500,
  textAlign: 'center',
  color: '#fff',
  backgroundColor: `${vars.color.secondary}`,
});

export const listIetmTitle= style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 500,
  backgroundColor: `${vars.color.gray.default}`,
  padding: '1em',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const listItemTitleIcon= style({
  color: `${vars.color.gray.dark}`
});

export const listIetmTitleText= style({
  paddingLeft: '0.5em',
});
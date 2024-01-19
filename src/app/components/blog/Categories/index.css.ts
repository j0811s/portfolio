import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  overflow: 'hidden',
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

export const listIetmTitle= style({
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  fontWeight: 500,
  color: `${vars.color.text.white}`,
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

export const listIetmLink = style({
  color: `${vars.color.text.white}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5em',
  border: '1px solid transparent',
  borderRadius: '4px',
  backgroundColor: 'transparent',
  transition: 'border-color 0.2s linear',
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: `${vars.color.accent.light}`
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
  backgroundColor: `${vars.color.tertiary}`,
});
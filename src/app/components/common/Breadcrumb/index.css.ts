import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  // padding: '0.5em 0',
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  selectors: {
    '&:not(:last-of-type)::after': {
      content: '>',
      display: 'inline-block',
      padding: '0.25em 0 0.5em',
      margin: '0 0.5em',
    }
  }
});

export const listItemLink = style({
  display: 'flex',
  alignItems: 'stretch',
  gap: 6,
  padding: '0.25em 0',
  borderBottom: '1px solid transparent',
  transition: 'border-color .2s ease-in-out',
  selectors: {
    '&.mod-current': {
      color: `${vars.color.gray.taupe}`
    },
    '&:not(.mod-current):hover': {
      '@media': {
        '(min-width: 960px)': {
          borderColor: '#fff',
        }
      }
    }
  }
});

export const listItemIcon = style({
  color: `${vars.color.text.white}`
});

export const listItemName = style({
  display: 'inline-block',
});
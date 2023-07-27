import { style } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const list = style({
  display: 'flex',
  width: '100%',
  padding: '0.5em 0 ',
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
  display: 'block',
  padding: '0.25em 0',
  borderBottom: '1px solid transparent',
  transition: 'border-color .4s ease',
  selectors: {
    '&.mod-current': {
      color: `${vars.color.gray.dark}`
    },
    '&:not(.mod-current):hover': {
      '@media': {
        '(min-width: 960px)': {
          borderColor: '#000',
        }
      }
    }
  }
});

export const listItemName = style({
  display: 'inline-block',
  padding: '0 0 0 0.25em',
});
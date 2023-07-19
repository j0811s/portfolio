import { style } from "@vanilla-extract/css";

export const list = style({
  display: 'flex',
  width: '100%',
  padding: '0.5em 0 ',
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
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
    '&:hover': {
      '@media': {
        '(min-width: 960px)': {
          borderColor: '#000',
        }
      }
    }
  }
});
import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const tagItem = style({
  borderRadius: 1000,
  display: 'inline-block',
  margin: '0 0.25em 0.35em 0',
  '@media': {
    'screen and (max-width: 767px)': {
      fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
    },
    'screen and (min-width: 768px)': {
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const tagLink = style({
  display: 'block',
  padding: '0.1em 0.6em 0.2em',
  border: `1px solid transparent`,
  borderRadius: 12,
  color: '#000',
  backgroundColor: `${vars.color.gray.bg}`,
  transition: 'background-color 0.2s linear, color 0.2s linear',
  selectors: {
    '&.mod-borderColor': {
      // borderColor: `${vars.color.gray.dark}`,
    },
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          backgroundColor: `${vars.color.gray.hoverBg}`,
        }
      }
    }
  }
});

export const tagIcon = style({
  color: `${vars.color.gray.dark}`
});

export const tagName = style({
  display: 'inline-block',
  padding: '0 0.25em',
});

export const tagNumberBadge = style({
  display: 'inline-block',
  padding: '0.25em',
  borderRadius: '9999px',
  minWidth: 24,
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  fontWeight: 500,
  textAlign: 'center',
  color: '#fff',
  backgroundColor: `${vars.color.gray.dark}`,
});
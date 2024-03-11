import { style } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const tagItem = style({
  borderRadius: 1000,
  width: 'fit-content',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
});

export const tagLink = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '0.4em',
  padding: '0.4em 0.6em',
  border: `1px solid ${vars.color.tertiary}`,
  color: `${vars.color.text.secondary}`,
  backgroundColor: `${vars.color.primary}`,
  transition: 'border-color 0.2s ease-in-out, color 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: `${vars.color.accent.sub}`
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
});

export const tagNumberBadge = style({
  display: 'inline-block',
  padding: '0.25em',
  borderRadius: '9999px',
  minWidth: 24,
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  textAlign: 'center',
  color: '#fff',
  backgroundColor: `${vars.color.secondary}`,
});
import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  opacity: 0,
  visibility: 'hidden',
  position: 'fixed',
  right: '20px',
  bottom: '20px',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  border: `1px solid ${vars.color.tertiary}`,
  backgroundColor: `${vars.color.secondary}`,
  borderRadius: 9999,
  padding: '1em',
  transition: 'border-color 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
  '@media': {
    'screen and (min-width: 960px)': {
      right: '40px',
      bottom: '40px',
    }
  },
  selectors: {
    '&.add-processing': {
      pointerEvents: 'none',
    },
    '&.add-show': {
      opacity: 1,
      visibility: 'visible',
    },
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: `${vars.color.accent.light}`
        }
      }
    }
  }
});
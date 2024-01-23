import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const srOnly = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
});

export const movieContainer = style({
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
});

export const movie = style({
  display: 'block',
  width: '100vw',
  height: '100%',
  aspectRatio: '16/9',
  objectFit: 'cover',
  transform: 'rotate(-8deg) scale(1.5)',
});

export const controlButtons = style({
  position: 'absolute',
  bottom: 16,
  left: 16,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5em',
});

export const controlButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  border: `1px solid ${vars.color.tertiary}`,
  backgroundColor: `${vars.color.secondary}`,
  borderRadius: 9999,
  width: 50,
  height: 50,
  transition: 'border-color 0.2s ease-in-out',
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

export const controlButtonIcon = style({
  
});
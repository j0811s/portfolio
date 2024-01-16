import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

export const container = style({
  margin: '40px auto 0',
  paddingTop: 20,
  borderTop: `2px solid ${vars.color.secondary}`
});

export const list = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10
});

export const listItem = style({
  fontSize: `calc( 18 / ${vars.font.size} * 1rem )`,
  fontWeight: 400,
  textAlign: 'center',
});

export const current = style({
  
});

export const pageLink = style({
  display: 'grid',
  placeContent: 'center',
  width: 40,
  height: 40,
  color: `${vars.color.text.white}`,
  backgroundColor: `${vars.color.accent.dark}`,
  borderRadius: 4,
  transition: 'background-color 0.4s ease',
  selectors: {
    '&:hover': {
      backgroundColor: `${vars.color.secondary}`,
    }
  }
});

export const currentText = style({
  backgroundColor: `${vars.color.secondary}`,
});

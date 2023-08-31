import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const container = style({
  margin: '40px auto 0',
  paddingTop: 20,
  borderTop: `1px solid ${vars.color.tertiary}`
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
  backgroundColor: '#fff',
  borderRadius: 4,
  transition: 'background-color 0.4s ease',
  selectors: {
    '&:hover': {
      color: '#fff',
      backgroundColor: `${vars.color.secondary}`,
    }
  }
});

export const currentText = style({
  color: '#fff',
  backgroundColor: `${vars.color.secondary}`,
});

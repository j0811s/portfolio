import { style, globalStyle } from "@vanilla-extract/css";

export const container = style({
  margin: '40px auto 0',
  paddingTop: 20,
  borderTop: '1px solid #eee'
});

export const list = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10
});

export const listItem = style({
  fontSize: 18,
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
      backgroundColor: '#eee',
    }
  }
});

export const currentText = style({
  backgroundColor: '#eee',
});

import { style, globalStyle } from "@vanilla-extract/css";

export const container = style({
  display: 'block',
  padding: '15px',
  backgroundColor: '#fff',
  borderTop: '1px solid #eee',
  color: '#000',
  textAlign: 'center',
  '@media': {
    'screen and (max-width: 767px)': {
      
    },
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      
    }
  }
});

export const copyright = style({
  display: 'block',
  fontSize: 10,
  '@media': {
    'screen and (max-width: 767px)': {
      
    },
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      
    }
  }
});
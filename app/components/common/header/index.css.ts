import { style, globalStyle } from "@vanilla-extract/css";

export const container = style({
  display: 'block',
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 999,
  padding: '0 15px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #eee',
  color: '#000',
  '@media': {
    'screen and (max-width: 767px)': {
      height: 60
    },
    'screen and (min-width: 768px)': {
      height: 60,
    },
    'screen and (min-width: 960px)': {
      
    }
  }
});

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  '@media': {
    'screen and (max-width: 767px)': {
      
    },
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      
    }
  }
});

export const menuButton = style({
  marginLeft: 'auto',
  '@media': {
    'screen and (max-width: 767px)': {
      
    },
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      
    }
  }
});
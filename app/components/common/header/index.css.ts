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

export const navigation = style({
  fontSize: 14,
  '@media': {
    'screen and (max-width: 767px)': {
      position: 'fixed',
      top: 60,
      left: 0,
      width: '100%',
      height: 'calc(100% - 60px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      textAlign: 'center'
    },
    'screen and (min-width: 768px)': {
      display: 'block',
      marginLeft: 'auto',
      fontSize: 16,
    }
  },
  selectors: {
    ':not(.add-active) &': {
      '@media': {
        'screen and (max-width: 767px)': {
          display: 'none'
        }
      }
    },
    '.add-active &': {
      '@media': {
        'screen and (max-width: 767px)': {
          display: 'block'
        }
      }
    }
  }
});

export const navigationList = style({
  '@media': {
    'screen and (max-width: 767px)': {
      
    },
    'screen and (min-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
    }
  }
});

export const navigationListItem = style({
  display: 'block',
  selectors: {
    '&:not(:first-of-type)': {
      '@media': {
        'screen and (min-width: 768px)': {
          marginLeft: '1em'
        }
      }
    }
  }
});

export const navigationListItemLink = style({
  display: 'block',
  padding: '0.25em 0',
  borderBottom: '1px solid transparent',
  transition: 'border-bottom 0.2s linear',
  selectors: {
    '&:hover': {
      '@media': {
        'screen and (min-width: 960px)': {
          borderColor: '#000'
        }
      }
    }
  }
});
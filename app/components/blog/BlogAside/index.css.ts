import { style, globalStyle } from "@vanilla-extract/css";

export const asideContainer = style({
  display: 'block',
  '@media': {
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      width: 280
    }
  }
});

globalStyle(`${asideContainer} > div + div`, {
  margin: '15px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      
    }
  }
});

globalStyle(`${asideContainer} > div > h2`, {
  fontSize: 14,
  fontWeight: 700,
  backgroundColor: '#eee',
  padding: '0.5em',
  borderRadius: '4px',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 16,
    },
    'screen and (min-width: 960px)': {
      fontSize: 16,
    }
  }
});

globalStyle(`${asideContainer} > div > ul`, {
  margin: '6px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      
    }
  }
});

globalStyle(`${asideContainer} > div > ul > li`, {
  fontSize: 14,
  fontWeight: 400,
  margin: '6px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 16,
    },
    'screen and (min-width: 960px)': {
      fontSize: 16,
    }
  }
});

globalStyle(`${asideContainer} > div > ul > li > a`, {
  display: 'block',
  paddingLeft: '1em',
  borderRadius: '4px',
});

globalStyle(`${asideContainer} > div > ul > li > a:hover`, {
  '@media': {
    'screen and (min-width: 960px)': {
      backgroundColor: '#eee'
    }
  },
});
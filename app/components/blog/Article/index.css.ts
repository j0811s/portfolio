import { style, globalStyle } from "@vanilla-extract/css";

export const postContainer = style({
  margin: '0 auto',
  '@media': {
    'screen and (min-width: 768px)': {
      maxWidth: 1280,
      padding: '0 20px',
    },
    'screen and (min-width: 960px)': {
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between'
    }
  }
});

export const postWrapper = style({
  '@media': {
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      width: 'calc(100% - 300px)'
    }
  }
});

export const postHead = style({
  // position: 'relative'
});

export const postEyecatchContainer = style({
  overflow: 'hidden',
  backgroundColor: '#eee'
});

export const postEyecatch = style({
  '@media': {
    'screen and (min-width: 768px)': {
      maxHeight: 630,
      objectFit: 'contain'
    }
  }
});

export const postTextContainer = style({
  margin: '30px 0 0'
});

export const postTitle = style({
  fontSize: 30,
  lineHeight: 1.2,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      fontSize: 40,
    }
  }
});

export const postDateContainer = style({
  margin: '10px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    'screen and (min-width: 960px)': {
      
    }
  }
});

export const postDate = style({
  fontSize: 12,
  lineHeight: 1.4,
  fontWeight: 400,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 14,
    },
    'screen and (min-width: 960px)': {
      fontSize: 14,
    }
  },
  selectors: {
    '&:not(:first-of-type)': {
      '@media': {
        'screen and (min-width: 768px)': {
          margin: '0 0 0 1em',
        },
        'screen and (min-width: 960px)': {
          
        }
      },
    }
  }
});

export const postContent = style({
  margin: '15px 0 0',
  padding: '14px',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '16px',
    },
    'screen and (min-width: 960px)': {
      padding: '16px',
    }
  }
});

globalStyle(`${postContent} > * + *`, {
  margin: '10px 0 0'
});

globalStyle(`${postContent} > p`, {
  fontSize: 14,
  lineHeight: 1.4,
  fontWeight: 400,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 16,
    },
    'screen and (min-width: 960px)': {
      fontSize: 16,
    }
  }
});

globalStyle(`${postContent} strong`, {
  fontWeight: 700,
});

globalStyle(`${postContent} em`, {
  fontStyle: 'italic'
});
import { style, globalStyle } from "@vanilla-extract/css";

export const postContainer = style({
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 767px)': {
      padding: '14px',
    },
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
});

export const postEyecatchContainer = style({
  overflow: 'hidden',
  backgroundColor: '#F4F5F6',
  margin: '30px 0 0',
});

export const postEyecatch = style({
  aspectRatio: '16 / 9',
  objectFit: 'contain',
  '@media': {
    'screen and (min-width: 768px)': {
      maxHeight: 315,
    }
  }
});

export const postTextContainer = style({
  // margin: '30px 0 0'
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
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '32px',
    },
    'screen and (min-width: 960px)': {
      padding: '32px',
    }
  }
});

globalStyle(`${postContent} * + *:not(h1, h2, h3, h4, h5, h6)`, {
  margin: '30px 0 0'
});

globalStyle(`${postContent} * + h1, * + h2, * + h3, * + h4, * + h5, * + h6`, {
  margin: '90px 0 0'
});

globalStyle(`${postContent} h1, h2, h3, h4, h5, h6`, {
  fontSize: 26,
  lineHeight: 1.4,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 30,
    },
    'screen and (min-width: 960px)': {
      fontSize: 32,
    }
  }
});

globalStyle(`${postContent} p`, {
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

globalStyle(`${postContent} figure`, {
  boxShadow: '4px 4px 12px #eee'
});

globalStyle(`${postContent} blockquote`, {
  borderLeft: '0.25em solid #d0d7de',
  paddingLeft: '1em',
  color: '#656d76'
});

globalStyle(`${postContent} blockquote > blockquote`, {
  marginTop: '1em'
});

globalStyle(`${postContent} code:not(.hljs)`, {
  display: 'inline-block',
  backgroundColor: '#F4F5F6',
  color: '#3E4B5B',
  padding: '0.25em'
});
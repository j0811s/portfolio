import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

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
  overflow: 'hidden',
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

globalStyle(`${postContent} * + *`, {
  margin: '30px 0 0'
});

globalStyle(`${postContent} h1, ${postContent} h2, ${postContent} h3, ${postContent} h4, ${postContent} h5, ${postContent} h6`, {
  fontSize: 26,
  lineHeight: 1.4,
  fontWeight: 700,
  margin: '60px 0 0',
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

globalStyle(`${postContent} a`, {
  color: vars.color.link,
  textDecoration: 'none',
});

globalStyle(`${postContent} a:hover`, {
  textDecoration: 'underline',
});

globalStyle(`${postContent} hr`, {
  border: 'none',
  height: 1,
  backgroundColor: vars.color.gray.dark
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

globalStyle(`${postContent} ul`, {
  listStyleType: 'disc',
  paddingLeft: '1em'
});

globalStyle(`${postContent} ol`, {
  listStyleType: 'number',
  paddingLeft: '1em'
});

globalStyle(`${postContent} li`, {
  listStyleType: 'inherit',
  margin: '0.5em 0 0'
});

globalStyle(`${postContent} > ul > li:first-of-type, ${postContent} > ol > li:first-of-type`, {
  margin: '0'
});

globalStyle(`${postContent} li > ul, ${postContent} li > ol`, {
  margin: '0.5em 0 0'
});

globalStyle(`${postContent} table`, {
  display: 'table',
  whiteSpace: 'pre-wrap',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  width: '100%',
  overflow: 'hidden'
});

globalStyle(`${postContent} tbody`, {
  display: 'block',
  overflowX: 'auto'
});

globalStyle(`${postContent} tr`, {
  display: 'table-row'
});

globalStyle(`${postContent} th, ${postContent} td`, {
  display: 'table-cell',
  minWidth: 246,
  wordBreak: 'break-all',
  padding: '1em',
  backgroundColor: '#fff',
  border: '1px solid #ccccd9'
});

globalStyle(`${postContent} th`, {
  backgroundColor: '#f8f9fd',
});

globalStyle(`${postContent} th > p`, {
  fontWeight: 'bold'
});
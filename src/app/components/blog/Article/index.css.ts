import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/src/app/styles/common/variables.css";

const mask = keyframes({
  '0%': {
    transform: 'scaleX(1)',
  },
  '100%': {
    transform: 'scaleX(0)',
  },
});

export const postWrapper = style({
  overflow: 'hidden',
  '@media': {
    'screen and (min-width: 960px)': {
      width: 'calc(100% - 300px)'
    }
  }
});

export const postHead = style({
  padding: '32px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0 32px',
    }
  }
});

export const postEyecatchContainer = style({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: `${vars.color.secondary}`,
  border: `3px solid ${vars.color.accent.main}`,
  borderRadius: 0,
  width: '100%',
  margin: '30px auto 0',
  '@media': {
    'screen and (min-width: 768px)': {
      border: `6px solid ${vars.color.accent.main}`,
      borderRadius: 0,
    }
  },
  selectors: {
    '&::after': {
      content: '',
      display: 'block',
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      backgroundColor: `${vars.color.accent.main}`,
      transform: 'scaleX(1)',
      transformOrigin: 'right',
      backfaceVisibility: 'hidden',
    },
    '&.loaded::after': {
      animation: `${mask} 0.3s forwards ease-in-out`,
    }
  }
});

export const postTextContainer = style({
  marginTop: 16,
  '@media': {
    'screen and (min-width: 768px)': {
      marginTop: 24,
    }
  }
});

export const postTitle = style({
  color: `${vars.color.text.secondary}`,
  fontSize: `calc( 26 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.3,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 36 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const postDateContainer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  '@media': {
    'screen and (max-width: 599px)': {
      alignItems: 'flex-end',
      flexDirection: 'column',
      gap: '0.25em 0',
    },
    'screen and (min-width: 600px)': {
      gap: '1em',
      margin: '10px 0 0',
    }
  }
});

export const postDate = style({
  color: `${vars.color.gray.taupe}`,
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.4,
  fontWeight: 400,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const postDateIcon = style({
  color: `${vars.color.gray.taupe}`,
  paddingRight: '0.5em'
});

export const postContent = style({
  overflow: 'hidden',
  margin: '16px 0 0',
  padding: '32px 0',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '64px 32px',
    }
  }
});

globalStyle(`${postContent} > *`, {
  padding: '0 1rem'
});

globalStyle(`${postContent} > * + *`, {
  margin: '24px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      margin: '32px 0 0',
    }
  }
});

globalStyle(`${postContent} h1, ${postContent} h2`, {
  fontSize: `calc( 20 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.4,
  fontWeight: 700,
  position: 'relative',
  padding: '1rem',
  color: `${vars.color.text.secondary}`,
  backgroundColor: `${vars.color.secondary}`,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 26 / ${vars.font.size} * 1rem )`,
    }
  }
});

globalStyle(`${postContent} h3, ${postContent} h4, ${postContent} h5, ${postContent} h6`, {
  fontSize: `calc( 18 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.2,
  fontWeight: 700,
  color: `inherit`,
  padding: '0 1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 22 / ${vars.font.size} * 1rem )`,
    }
  }
});

globalStyle(`${postContent} * + h1, ${postContent} * + h2`, {
  margin: '60px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      margin: '80px 0 0',
    }
  }
});

globalStyle(`${postContent} * + h3, ${postContent} * + h4, ${postContent} * + h5, ${postContent} * + h6`, {
  margin: '30px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      margin: '40px 0 0',
    }
  }
});

globalStyle(`${postContent} p`, {
  color: 'inherit',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.6,
  fontWeight: 400,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});

globalStyle(`${postContent} a`, {
  color: vars.color.link,
  textDecoration: 'underline',
});

globalStyle(`${postContent} a:hover`, {
  textDecoration: 'none',
});

globalStyle(`${postContent} hr`, {
  border: 'none',
  height: 1,
  backgroundColor: vars.color.gray.dark
});

globalStyle(`${postContent} figure`, {
  boxShadow: `4px 4px 12px ${vars.color.gray.default}`,
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
  borderRadius: 4,
  backgroundColor: `${vars.color.code.back}`,
  color: `#81a2be`,
  padding: '0 0.25em',
  fontSize: '0.85em'
});

globalStyle(`${postContent} ul`, {
  listStyleType: 'disc',
  paddingLeft: '1.5em'
});

globalStyle(`${postContent} ol`, {
  listStyleType: 'number',
  paddingLeft: '1.5em'
});

globalStyle(`${postContent} li`, {
  listStyleType: 'inherit',
  color: 'inherit',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.6,
  fontWeight: 400,
  margin: '1em 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});

globalStyle(`${postContent} > ul > li:first-of-type, ${postContent} > ol > li:first-of-type`, {
  margin: '0'
});

globalStyle(`${postContent} li > ul, ${postContent} li > ol`, {
  margin: '0.5em 0 0'
});

globalStyle(`${postContent} table`, {
  display: 'block',
  whiteSpace: 'pre-wrap',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  width: '100%',
  overflow: 'hidden',
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
  minWidth: 120,
  wordBreak: 'break-all',
  padding: '0.5em',
  color: `${vars.color.text.secondary}`,
  backgroundColor: `${vars.color.secondary}`,
  border: `1px solid ${vars.color.gray.taupe}`,
  '@media': {
    'screen and (min-width: 960px)': {
      minWidth: 246,
    }
  }
});

globalStyle(`${postContent} th`, {
  backgroundColor: `${vars.color.tertiary}`,
});

globalStyle(`${postContent} th > p`, {
  fontWeight: 400
});

globalStyle(`${postContent} pre > code`, {
  whiteSpace: 'pre',
  fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
  lineHeight: '1.6',
  fontWeight: 400,
  border: `1px solid rgb(255, 255, 255, 0.1)`,
  borderRadius: 4,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 16 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const prevButton = style({
  display: 'grid',
  placeContent: 'center',
  textAlign: 'center',
  padding: '32px 16px',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '64px 32px',
    }
  }
});
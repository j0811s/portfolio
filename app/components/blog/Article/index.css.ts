import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/app/styles/common/variables.css";

export const postWrapper = style({
  marginTop: 30,
  '@media': {
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
  boxShadow: `0 0 4px ${vars.color.gray.hoverBg}`,
  '@media': {
    'screen and (max-width: 959px)': {
      margin: '30px calc(50% - 100vw / 2) 0',
    }
  }
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
  fontSize: `calc( 30 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.2,
  fontWeight: 700,
  '@media': {
    'screen and (min-width: 960px)': {
      fontSize: `calc( 40 / ${vars.font.size} * 1rem )`,
    }
  }
});

export const postDateContainer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  margin: '10px 0 0',
});

export const postDate = style({
  color: `${vars.color.gray.dark}`,
  fontSize: `calc( 12 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.4,
  fontWeight: 500,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 14 / ${vars.font.size} * 1rem )`,
    }
  },
  selectors: {
    '&:not(:first-of-type)': {
      margin: '0 0 0 1em',
    }
  }
});

export const postDateIcon = style({
  color: `${vars.color.gray.dark}`,
  paddingRight: '0.5em'
});

export const postContent = style({
  overflow: 'hidden',
  margin: '15px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '64px 32px',
    }
  }
});

globalStyle(`${postContent} * + *`, {
  margin: '30px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      margin: '40px 0 0',
    }
  }
});

globalStyle(`${postContent} h1, ${postContent} h2, ${postContent} h3, ${postContent} h4, ${postContent} h5, ${postContent} h6`, {
  fontSize: `calc( 22 / ${vars.font.size} * 1rem )`,
  lineHeight: 1.4,
  fontWeight: 700,
  position: 'relative',
  padding: '0.5em',
  color: `#000`,
  border: `2px solid #000`,
  backgroundColor: `${vars.color.gray.bg}`,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: `calc( 26 / ${vars.font.size} * 1rem )`,
    }
  }
});

globalStyle(`${postContent} * + h1, ${postContent} * + h2, ${postContent} * + h3, ${postContent} * + h4, ${postContent} * + h5, ${postContent} * + h6`, {
  margin: '60px 0 0',
  '@media': {
    'screen and (min-width: 768px)': {
      margin: '80px 0 0',
    }
  }
});

globalStyle(`${postContent} h1::before, ${postContent} h2::before, ${postContent} h3::before, ${postContent} h4::before, ${postContent} h5::before, ${postContent} h6::before`, {
  position: 'absolute',
  top: '100%',
  left: '0.5em',
  width: 0,
  height: 0,
  content: '',
  borderWidth: '14px 12px 0 12px',
  borderStyle: 'solid',
  borderColor: `#000 transparent transparent transparent`,
});

globalStyle(`${postContent} h1::after, ${postContent} h2::after, ${postContent} h3::after, ${postContent} h4::after, ${postContent} h5::after, ${postContent} h6::after`, {
  position: 'absolute',
  bottom: '-11px',
  left: '0.5em',
  width: 0,
  height: 0,
  content: '',
  borderWidth: '14px 12px 0 12px',
  borderStyle: 'solid',
  borderColor: `${vars.color.gray.bg} transparent transparent transparent`,
});

globalStyle(`${postContent} p`, {
  color: `${vars.color.gray.text}`,
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
  backgroundColor: `${vars.color.gray.hoverBg}`,
  color: '#3E4B5B',
  padding: '0.25em'
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
  minWidth: 120,
  wordBreak: 'break-all',
  padding: '0.5em',
  backgroundColor: '#fff',
  border: '1px solid #ccccd9',
  '@media': {
    'screen and (min-width: 960px)': {
      minWidth: 246,
    }
  }
});

globalStyle(`${postContent} th`, {
  backgroundColor: '#f8f9fd',
});

globalStyle(`${postContent} th > p`, {
  fontWeight: 500
});
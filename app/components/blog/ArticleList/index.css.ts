import { style, globalStyle } from "@vanilla-extract/css";


export const postListEyecatch = style({
  aspectRatio: '16 / 9',
  objectFit: 'contain'
});

export const postListTitle = style({
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

export const postList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 30,
  '@media': {
    'screen and (min-width: 768px)': {
      gap: 15
    }
  }
});

export const postListItem = style({
  transition: 'box-shadow 0.6s ease',
  '@media': {
    'screen and (max-width: 767px)': {
      width: 'calc(50% - 5px)',
      boxShadow: '1px 1px 4px #eee',
    },
    'screen and (min-width: 768px)': {
      width: 'calc(100% / 3 - 10px)',
      boxShadow: '4px 4px 10px #eee',
    }
  },
  selectors: {
    [`&:hover`]: {
      '@media': {
        'screen and (min-width: 960px)': {
          boxShadow: 'none'
        }
      }
    }
  }
});

export const postListItemLink = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

export const postListWrapper = style({
  '@media': {
    'screen and (min-width: 768px)': {
      
    },
    'screen and (min-width: 960px)': {
      width: 'calc(100% - 300px)'
    }
  }
});

export const postListEyecatchContainer = style({
  overflow: 'hidden',
  backgroundColor: '#F4F5F6'
});

export const postData = style({
  display: 'flex',
  padding: '0.5em',
  flexDirection: 'column',
  flex: '1'
});

export const postDataTitle = style({
  fontSize: '15px',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden'
});

export const postDataDesc = style({
  marginTop: 'auto',
  paddingTop: '1em'
});

export const postDateContainer = style({
});

export const postDate = style({
  fontSize: 12,
  lineHeight: 1.4,
  textAlign: 'right',
});
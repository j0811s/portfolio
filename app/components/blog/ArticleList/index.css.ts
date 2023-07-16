import { style, globalStyle } from "@vanilla-extract/css";

// export const postListContainer = style({
//   margin: '0 auto',
//   '@media': {
//     'screen and (max-width: 767px)': {
//       padding: '14px',
//     },
//     'screen and (min-width: 768px)': {
//       maxWidth: 1280,
//       padding: '0 20px',
//     },
//     'screen and (min-width: 960px)': {
//       display: 'flex',
//       flexDirection: 'row-reverse',
//       justifyContent: 'space-between'
//     }
//   }
// });

export const postListEyecatch = style({
  aspectRatio: '16 / 9',
  objectFit: 'contain',
  '@media': {
    'screen and (min-width: 768px)': {
      // maxHeight: 315,
    }
  }
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
  marginTop: 30,
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'flex',
      flexWrap: 'wrap',
    }
  }
});

export const postListItem = style({
  '@media': {
    'screen and (min-width: 768px)': {
      width: 'calc(100% / 3 - 10px)',
    }
  },
  selectors: {
    '&:not(:nth-of-type(3n + 1))': {
      '@media': {
        'screen and (min-width: 768px)': {
          marginLeft: 15
        }
      },
    },
    '&:nth-of-type(n + 4)': {
      '@media': {
        'screen and (min-width: 768px)': {
          marginTop: 30
        }
      },
    },
  }
});

export const postListItemLink = style({
  display: 'block'
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
  backgroundColor: '#F4F5F6',
  transition: 'opacity 0.6s ease',
  selectors: {
    [`${postListItemLink} &:hover`]: {
      '@media': {
        'screen and (min-width: 960px)': {
          opacity: 0.7
        }
      }
    }
  }
});

export const postData = style({
  display: 'block',
  padding: '10px 0'
});

export const postDataTitle = style({
  fontSize: '15px',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden'
});

export const postDataDesc = style({
  marginTop: 6
});

export const postDateContainer = style({
});

export const postDate = style({
  fontSize: 12,
  lineHeight: 1.4,
});
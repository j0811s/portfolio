import { createTheme, createGlobalTheme, createThemeContract, globalStyle } from '@vanilla-extract/css';

export const root = createGlobalTheme(':root', {
  font: {
    size: '16' // fontSize: `calc( 32 / ${vars.font.size} * 1rem )`,
  }
});

globalStyle('.sr-only', {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
});
globalStyle('.util-hidden', {
  display: 'none'
});
globalStyle('.util-sp', {
  '@media': {
    'screen and (min-width: 960px)': {
      display: 'none'
    }
  }
});
globalStyle('.util-pc', {
  '@media': {
    'screen and (max-width: 959px)': {
      display: 'none'
    }
  }
});
globalStyle('.util-svg', {
  display: 'block',
  overflow: 'visible',
  width: '100%',
  height: '100%',
});

const themeColor = createThemeContract({
  color: {
    primary: null,
    secondary: null,
    tertiary: null,
    background: {
      primary: null,
      secondary: null,
      white: null,
      black: null,
      light: null,
      dark: null,
    },
    accent: {
      main: null,
      sub: null,
    },
    text: {
      primary: null,
      secondary: null,
      tertiary: null,
      btn: null,
    },
    border: {
      accent: null,
      main: null,
      sub: null,
    },
    body: null,
    error: null,
    gray: {
      taupe: null,
      default: null,
      dark: null,
      bg: null,
      hoverBg: null,
      text: null,
      border: null,
    },
    link: null,
    code: {
      tag: null,
      text: null,
      back: null,
      front: null,
    },
    first_view: {
      main: null,
      sub: null,
    }
  }
});


export const lightTheme = createTheme(themeColor, {
  color: {
    primary: '#efefef',
    secondary: '#dcdcdc',
    tertiary: '#bdbdbd',
    background: {
      primary: 'rgb(255, 255, 255, 0.97)',
      secondary: 'rgb(30, 38, 38, 0.97)',
      white: '#fff',
      black: '#000',
      light: '#ff7e0f',
      dark: '#348369',
    },
    accent: {
      main: '#ff7e0f',
      sub: '#ffc270',
    },
    text: {
      primary: '#fff',
      secondary: '#000',
      tertiary: '#A9AAAA',
      btn: '#fff',
    },
    border: {
      accent: 'rgb(255, 126, 15, 1)',
      main: '#000',
      sub: '#fff',
    },
    body: '#FAFAFA',
    error: '#B3261E',
    gray: {
      taupe: '#85878F',
      default: '#EEEEEE',
      dark: '#78909C',
      bg: '#f0f2f5',
      hoverBg: '#d8dadd',
      text: '#495057',
      border: '#E0E0E0',
    },
    link: '#6997E4',
    code: {
      tag: '#ff7e0f',
      text: '#f0c674',
      back: 'rgb(175, 184, 193, .2)',
      front: '#c5c8c6',
    },
    first_view: {
      main: 'rgb(61, 61, 61, 1)',
      sub: 'rgb(124, 124, 124, 0.3)',
    }
  }
});

export const darkTheme = createTheme(themeColor, {
  color: {
    primary: '#1a1f1e',
    secondary: '#1e2626',
    tertiary: '#323A3A',
    background: {
      primary: 'rgb(30, 38, 38, 0.97)',
      secondary: 'rgb(255, 255, 255, 0.97)',
      white: '#fff',
      black: '#000',
      light: '#ff7e0f',
      dark: '#348369',
    },
    accent: {
      main: '#348369',
      sub: '#cddbb5',
    },
    text: {
      primary: '#000',
      secondary: '#fff',
      tertiary: '#A9AAAA',
      btn: '#fff',
    },
    border: {
      accent: 'rgb(205, 219, 181, 1)',
      main: '#fff',
      sub: '#000',
    },
    body: '#FAFAFA',
    error: '#B3261E',
    gray: {
      taupe: '#85878F',
      default: '#EEEEEE',
      dark: '#78909C',
      bg: '#f0f2f5',
      hoverBg: '#d8dadd',
      text: '#495057',
      border: '#E0E0E0',
    },
    link: '#6997E4',
    code: {
      tag: '#348369',
      text: '#f0c674',
      back: 'rgb(175, 184, 193, .2)',
      front: '#c5c8c6',
    },
    first_view: {
      main: 'rgb(0, 0, 0)',
      sub: 'rgb(30, 38, 38, 0.3)',
    }
  }
});

export const vars = { ...root, ...themeColor };
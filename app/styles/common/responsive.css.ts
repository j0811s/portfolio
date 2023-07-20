import { createThemeContract } from '@vanilla-extract/css';

export const mq = createThemeContract({
  range: {
    xs: 'screen and (max-width: 599px)',
    sm: 'screen and (min-width: 600px) and (max-width: 959px)',
    md: 'screen and (min-width: 960px) and (max-width: 1279px)',
    lg: 'screen and (min-width: 1280px) and (max-width: 1919px)',
    xl: 'screen and (min-width: 1920px) and (max-width: 2559px)',
    xxl: 'screen and (min-width: 2560px)',
    mobile: 'screen and (max-width: 959px)',
    desktop: 'screen and (min-width: 960px)',
  }
});
import {
    GUIDELINE_BASE_WIDTH,
    GUIDELINE_BASE_HEIGHT,
    BREAKPOINTS,
  } from '@/constants/responsive';
  
  export const horizontalScale = (
    size: number,
    screenWidth: number
  ) => {
    return (
      (screenWidth / GUIDELINE_BASE_WIDTH) * size
    );
  };
  
  export const verticalScale = (
    size: number,
    screenHeight: number
  ) => {
    return (
      (screenHeight / GUIDELINE_BASE_HEIGHT) * size
    );
  };
  
  export const moderateScale = (
    size: number,
    screenWidth: number,
    factor = 0.5
  ) => {
    return (
      size +
      (horizontalScale(size, screenWidth) - size) *
        factor
    );
  };
  
  export const wp = (
    percentage: number,
    screenWidth: number
  ) => {
    return (screenWidth * percentage) / 100;
  };
  
  export const hp = (
    percentage: number,
    screenHeight: number
  ) => {
    return (screenHeight * percentage) / 100;
  };
  
  export const getDeviceType = (width: number) => {
    if (width >= BREAKPOINTS.lg) {
      return 'desktop';
    }
  
    if (width >= BREAKPOINTS.md) {
      return 'tablet';
    }
  
    return 'mobile';
  };
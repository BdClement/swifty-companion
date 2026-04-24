import React, {
    createContext,
    ReactNode,
    useMemo,
  } from 'react';
  
  import { useWindowDimensions } from 'react-native';
  
  import { BREAKPOINTS } from '@/constants/responsive';
  
  import {
    horizontalScale,
    verticalScale,
    moderateScale,
    wp,
    hp,
    getDeviceType,
  } from '@/utils/responsive';
  
  type ResponsiveContextType = {
    width: number;
    height: number;
  
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  
    deviceType: string;
  
    hs: (size: number) => number;
    vs: (size: number) => number;
    ms: (
      size: number,
      factor?: number
    ) => number;
  
    wp: (percentage: number) => number;
    hp: (percentage: number) => number;
  };
  
  export const ResponsiveContext =
    createContext<ResponsiveContextType | null>(
      null
    );
  
  type Props = {
    children: ReactNode;
  };
  
  export const ResponsiveProvider = ({
    children,
  }: Props) => {
    const { width, height } =
      useWindowDimensions();
  
    const responsive = useMemo(() => {
      const deviceType = getDeviceType(width);
  
      return {
        width,
        height,
  
        deviceType,
  
        isMobile: width < BREAKPOINTS.md,
  
        isTablet:
          width >= BREAKPOINTS.md &&
          width < BREAKPOINTS.lg,
  
        isDesktop: width >= BREAKPOINTS.lg,
  
        hs: (size: number) =>
          horizontalScale(size, width),
  
        vs: (size: number) =>
          verticalScale(size, height),
  
        ms: (
          size: number,
          factor = 0.5
        ) =>
          moderateScale(
            size,
            width,
            factor
          ),
  
        wp: (percentage: number) =>
          wp(percentage, width),
  
        hp: (percentage: number) =>
          hp(percentage, height),
      };
    }, [width, height]);
  
    return (
      <ResponsiveContext.Provider value={responsive}>
        {children}
      </ResponsiveContext.Provider>
    );
  };
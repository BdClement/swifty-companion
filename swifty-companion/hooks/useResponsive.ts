import { useContext } from 'react';

import { ResponsiveContext } from '@/contexts/ResponsiveContext';

export const useResponsive = () => {
  const context =
    useContext(ResponsiveContext);

  if (!context) {
    throw new Error(
      'useResponsive must be used inside ResponsiveProvider'
    );
  }

  return context;
};
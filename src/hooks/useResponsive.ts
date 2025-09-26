import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

interface ScreenDimensions {
  width: number;
  height: number;
}

interface ResponsiveData {
  isTablet: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  columns: number;
}

export const useResponsive = (): ResponsiveData => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isLandscape = width > height;
  const isTablet = width >= 768; 
  
  
  let columns = 1;
  if (isTablet) {
    if (isLandscape) {
      columns = 3; 
    } else {
      columns = 2; 
    }
  }

  return {
    isTablet,
    isLandscape,
    screenWidth: width,
    screenHeight: height,
    columns,
  };
};

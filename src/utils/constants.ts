// Design constants for consistent UI patterns

export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  base: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const LAYOUT = {
  headerHeight: 56,
  tabBarHeight: 60,
  bottomNavHeight: 60,
  cardMinHeight: 120,
  avatarSize: {
    sm: 32,
    base: 40,
    lg: 64,
    xl: 80,
  },
  buttonHeight: {
    sm: 36,
    base: 44,
    lg: 52,
  },
} as const;

export const ANIMATIONS = {
  fast: 150,
  normal: 250,
  slow: 350,
  bounce: {
    tension: 100,
    friction: 8,
  },
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

// Common patterns
export const COMMON_STYLES = {
  shadow: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      elevation: 1,
    },
    base: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6,
    },
  },
  borderRadius: {
    sm: 4,
    base: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
} as const;

export const GRID = {
  columns: {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
  gap: {
    sm: 8,
    base: 12,
    lg: 16,
  },
} as const; 
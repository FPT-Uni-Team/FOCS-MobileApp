
import Colors from './Colors';
import { spacing, cardSpacing, screenPadding } from './spacing';
import { ICON_SIZES, LAYOUT, ANIMATIONS, Z_INDEX, COMMON_STYLES, GRID } from './constants';

export const typography = {
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const borders = {
  radius: {
    none: 0,
    sm: 4,
    base: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  width: {
    none: 0,
    thin: 1,
    thick: 2,
    bold: 4,
  },
};

export const shadows = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const opacity = {
  disabled: 0.4,
  muted: 0.6,
  subtle: 0.8,
  full: 1,
};


export const components = {
  header: {
    height: 56,
    paddingHorizontal: spacing.l,
  },
  card: {
    borderRadius: borders.radius.lg,
    padding: spacing.l,
    shadow: shadows.base,
  },
  button: {
    height: 44,
    paddingHorizontal: spacing.l,
    borderRadius: borders.radius.base,
  },
  input: {
    height: 48,
    paddingHorizontal: spacing.l,
    borderRadius: borders.radius.base,
  },
};


export const theme = {
  colors: Colors,
  spacing: { ...spacing, card: cardSpacing, screen: screenPadding },
  typography,
  borders,
  shadows,
  opacity,
  components,
  // New constants
  iconSizes: ICON_SIZES,
  layout: LAYOUT,
  animations: ANIMATIONS,
  zIndex: Z_INDEX,
  commonStyles: COMMON_STYLES,
  grid: GRID,
};

export type Theme = typeof theme;


export const getTextStyle = (size: keyof typeof typography.sizes, weight: keyof typeof typography.weights) => ({
  fontSize: typography.sizes[size],
  fontWeight: typography.weights[weight],
});

export const getShadowStyle = (level: keyof typeof shadows) => shadows[level];

export const getBorderStyle = (radius: keyof typeof borders.radius, width: keyof typeof borders.width = 'thin', color = Colors.borderLight) => ({
  borderRadius: borders.radius[radius],
  borderWidth: borders.width[width],
  borderColor: color,
});


export { Colors, spacing, cardSpacing, screenPadding, ICON_SIZES, LAYOUT, ANIMATIONS, Z_INDEX, COMMON_STYLES, GRID };

export default theme; 
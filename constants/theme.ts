import { Platform } from 'react-native';

export const Colors = {
  racingRed: '#FF1F29',
  raspberryPlum: '#BA459F',
  midnightViolet: '#361F27',
  pitchBlack: '#0D090A',
  white: '#FFFFFF',

  text: {
    primary: 'rgba(255,255,255,1)',
    secondary: 'rgba(255,255,255,0.75)',
    muted: 'rgba(255,255,255,0.55)',
    placeholder: 'rgba(255,255,255,0.45)',
  },

  border: {
    strong: 'rgba(255,255,255,0.12)',
    subtle: 'rgba(255,255,255,0.06)',
  },

  surface: {
    background: '#0D090A',
    elevated: 'rgba(255,255,255,0.04)',
  },

  priority: {
    critica: '#FF1F29',
    alta: '#BA459F',
    media: '#361F27',
    baixa: 'rgba(255,255,255,0.3)',
  },
};

export const Gradients = {
  ctaPrimary: ['#FF1F29', '#BA459F'] as const,
  heroProgress: ['#FF1F29', '#BA459F'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 8,
  lg: 14,
  xl: 20,
};

export const FontSize = {
  xs: 10,
  sm: 11,
  base: 13,
  md: 14,
  lg: 22,
  xl: 26,
  xxl: 44,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
};

export const LetterSpacing = {
  tight: -0.8,
  normal: 0,
  wide: 0.5,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
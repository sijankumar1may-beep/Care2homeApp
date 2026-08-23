export const colors = {
  headerBlue: '#1e40af',
  primaryBlue: '#2563eb',
  primaryBlueDark: '#1d4ed8',
  primaryBlueLight: '#3b82f6',
  ctaGreen: '#29a35c',
  ctaGreenDark: '#15803d',
  background: '#ffffff',
  foreground: '#171717',
  careBlueLight: '#eff6ff',
  careBlueHero: '#bedeff',
  trustBadge: '#e8f2fc',
  trustBadgeForeground: '#11539c',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray500: '#6b7280',
  gray700: '#374151',
  gray900: '#111827',
  footerDark: '#111827',
  danger: '#DC2626',
  white: '#ffffff',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.foreground },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.foreground },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.foreground },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.gray700 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const, color: colors.foreground },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.gray500 },
  label: { fontSize: 14, fontWeight: '500' as const, color: colors.gray700 },
};

export const WHATSAPP_NUMBER = '919910646415';
export const PHONE_NUMBER = '+919910646415';
export const WEB_BASE_URL = 'https://care2home.co';

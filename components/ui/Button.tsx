import { colors } from '@/lib/theme';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'green';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const variantStyle = styles[variant];
  const sizeStyle = styles[`size_${size}`];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        sizeStyle,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primaryBlue : colors.white} />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primaryBlue },
  secondary: { backgroundColor: colors.gray700 },
  green: { backgroundColor: colors.ctaGreen },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primaryBlue,
  },
  size_sm: { paddingVertical: 8, paddingHorizontal: 16 },
  size_md: { paddingVertical: 12, paddingHorizontal: 22 },
  size_lg: { paddingVertical: 14, paddingHorizontal: 28 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  text: { fontWeight: '600' },
  text_primary: { color: colors.white },
  text_secondary: { color: colors.white },
  text_green: { color: colors.white },
  text_outline: { color: colors.primaryBlue },
  textSize_sm: { fontSize: 14 },
  textSize_md: { fontSize: 15 },
  textSize_lg: { fontSize: 17 },
});

import { colors, borderRadius, spacing } from '@/lib/theme';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const OTP_LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (code: string) => void;
  label?: string;
}

export function OtpInput({ value, onChange, label = 'Verification code' }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const digits = value.padEnd(OTP_LENGTH, ' ').split('').slice(0, OTP_LENGTH);
  const activeIndex = Math.min(value.length, OTP_LENGTH - 1);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (cleaned.length > value.length) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(cleaned);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.boxRow} onPress={() => inputRef.current?.focus()}>
        {digits.map((digit, index) => {
          const isActive = focused && index === activeIndex;
          const isFilled = digit.trim().length > 0;

          return (
            <View
              key={index}
              style={[
                styles.box,
                isActive && styles.boxActive,
                isFilled && styles.boxFilled,
              ]}
            >
              <Text style={styles.digit}>{digit.trim()}</Text>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        autoFocus
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 48,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
    backgroundColor: colors.careBlueLight,
  },
  boxFilled: {
    borderColor: colors.primaryBlueLight,
  },
  digit: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});

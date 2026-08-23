import { colors, borderRadius, spacing } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  label?: string;
}

export function PhoneInput({
  value,
  onChangeText,
  disabled = false,
  label = 'Phone number',
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    onChangeText(digits);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.row,
          focused && styles.rowFocused,
          disabled && styles.rowDisabled,
        ]}
      >
        <View style={styles.prefix}>
          <Ionicons name="call-outline" size={16} color={colors.primaryBlue} />
          <Text style={styles.prefixText}>+91</Text>
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder="9876543210"
          placeholderTextColor={colors.gray500}
          keyboardType="phone-pad"
          maxLength={10}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  rowFocused: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
  },
  rowDisabled: {
    backgroundColor: colors.gray50,
    opacity: 0.8,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.careBlueLight,
    borderRightWidth: 1,
    borderRightColor: colors.gray200,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.headerBlue,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.foreground,
  },
});

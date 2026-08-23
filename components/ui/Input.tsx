import { colors, borderRadius } from '@/lib/theme';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.gray500}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

interface TextAreaProps extends InputProps {
  rows?: number;
}

export function TextArea({ label, error, rows = 4, style, ...props }: TextAreaProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          { minHeight: rows * 22 },
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={colors.gray500}
        multiline
        textAlignVertical="top"
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 12 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    fontSize: 15,
    color: colors.foreground,
    backgroundColor: colors.white,
  },
  textArea: { paddingTop: 12 },
  inputError: { borderColor: colors.danger },
  error: { marginTop: 4, fontSize: 13, color: colors.danger },
});

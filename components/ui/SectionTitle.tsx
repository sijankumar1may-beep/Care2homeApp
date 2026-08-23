import { colors } from '@/lib/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 4,
    lineHeight: 20,
  },
});

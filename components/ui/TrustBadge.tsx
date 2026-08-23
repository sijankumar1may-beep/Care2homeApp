import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TrustBadgeProps {
  text: string;
}

export function TrustBadge({ text }: TrustBadgeProps) {
  return (
    <View style={styles.badge}>
      <Ionicons name="checkmark-circle" size={20} color={colors.ctaGreen} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.trustBadge,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.trustBadgeForeground,
  },
});

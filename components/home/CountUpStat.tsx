import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';

type CountUpStatProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  display?: string;
  animateValue?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
};

function AnimatedStatValue({
  value,
  suffix,
  prefix,
  decimals,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const [text, setText] = useState('0');
  const animated = useSharedValue(0);

  useEffect(() => {
    animated.value = withTiming(value, { duration: 1200 });
  }, [animated, value]);

  useAnimatedReaction(
    () => animated.value,
    (v) => {
      const formatted = decimals !== undefined ? v.toFixed(decimals) : Math.round(v).toString();
      runOnJS(setText)(`${prefix ?? ''}${formatted}${suffix ?? ''}`);
    },
  );

  return <Text style={styles.statValue}>{text}</Text>;
}

export function CountUpStat({ label, icon, display, animateValue, suffix, prefix, decimals }: CountUpStatProps) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={18} color={colors.primaryBlue} />
      {animateValue !== undefined ? (
        <AnimatedStatValue
          value={animateValue}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
        />
      ) : (
        <Text style={styles.statValue}>{display}</Text>
      )}
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { fontSize: 14, fontWeight: '700', color: colors.gray900 },
  statLabel: { fontSize: 10, color: colors.gray500, textAlign: 'center' },
});

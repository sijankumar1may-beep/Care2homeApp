import { colors, spacing } from '@/lib/theme';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface StepIndicatorProps {
  currentStep: 1 | 2;
  steps?: [string, string];
}

export function StepIndicator({
  currentStep,
  steps = ['Phone', 'Verify'],
}: StepIndicatorProps) {
  const progress = useSharedValue(currentStep === 1 ? 0 : 1);

  useEffect(() => {
    progress.value = withTiming(currentStep === 1 ? 0 : 1, { duration: 300 });
  }, [currentStep, progress]);

  const lineStyle = useAnimatedStyle(() => ({
    width: `${50 + progress.value * 50}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {steps.map((label, index) => {
          const stepNum = (index + 1) as 1 | 2;
          const isActive = currentStep >= stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <View key={label} style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.circleActive,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                <Text style={[styles.circleText, isActive && styles.circleTextActive]}>
                  {stepNum}
                </Text>
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, lineStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  circleActive: {
    backgroundColor: colors.primaryBlue,
  },
  circleCurrent: {
    borderWidth: 2,
    borderColor: colors.primaryBlueLight,
  },
  circleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray500,
  },
  circleTextActive: {
    color: colors.white,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
  },
  labelActive: {
    color: colors.primaryBlue,
  },
  track: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primaryBlue,
    borderRadius: 2,
  },
});

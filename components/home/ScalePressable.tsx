import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HapticStyle = 'light' | 'medium' | 'none';

type ScalePressableProps = PressableProps & {
  haptic?: HapticStyle;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function ScalePressable({
  haptic = 'light',
  onPressIn,
  onPressOut,
  onPress,
  style,
  children,
  ...rest
}: ScalePressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const triggerHaptic = () => {
    if (haptic === 'none') return;
    void Haptics.impactAsync(
      haptic === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
    );
  };

  return (
    <AnimatedPressable
      {...rest}
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        triggerHaptic();
        onPress?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}

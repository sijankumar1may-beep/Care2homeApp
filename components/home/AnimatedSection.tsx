import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type AnimatedSectionProps = {
  index: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AnimatedSection({ index, children, style }: AnimatedSectionProps) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(500)} style={style}>
      {children}
    </Animated.View>
  );
}

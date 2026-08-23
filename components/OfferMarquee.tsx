import { offerMarqueeText } from '@/lib/data/home';
import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

const MARQUEE_SPEED = 50;

export function OfferMarquee() {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const onTextLayout = (e: LayoutChangeEvent) => {
    setTextWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (containerWidth === 0 || textWidth === 0) return;

    const gap = 48;
    const segmentWidth = textWidth + gap;
    const duration = (segmentWidth / MARQUEE_SPEED) * 1000;

    translateX.setValue(0);
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -segmentWidth,
        duration,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [containerWidth, textWidth, translateX]);

  const marqueeContent = (
    <View style={styles.marqueeRow}>
      <Text style={styles.marqueeText} onLayout={onTextLayout}>
        {offerMarqueeText}
      </Text>
      <Text style={[styles.marqueeText, styles.marqueeGap]}>{offerMarqueeText}</Text>
    </View>
  );

  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      <Ionicons name="sparkles" size={16} color={colors.white} style={styles.icon} />
      <View style={styles.marqueeClip}>
        <Animated.View style={[styles.marqueeTrack, { transform: [{ translateX }] }]}>
          {marqueeContent}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBlue,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  icon: { marginRight: 8 },
  marqueeClip: { flex: 1, overflow: 'hidden' },
  marqueeTrack: { flexDirection: 'row' },
  marqueeRow: { flexDirection: 'row' },
  marqueeText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  marqueeGap: { marginLeft: 48 },
});

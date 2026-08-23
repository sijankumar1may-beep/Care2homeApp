import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';

const ITEM_GAP = 12;

type AutoScrollCarouselProps = ScrollViewProps & {
  itemWidth: number;
  itemCount: number;
  intervalMs?: number;
  onIndexChange?: (index: number) => void;
  children: React.ReactNode;
};

export function AutoScrollCarousel({
  itemWidth,
  itemCount,
  intervalMs = 4000,
  onIndexChange,
  children,
  onScroll,
  ...scrollProps
}: AutoScrollCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const activeIndexRef = useRef(0);
  const [paused, setPaused] = useState(false);

  const snapInterval = itemWidth + ITEM_GAP;

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      scrollRef.current?.scrollTo({ x: index * snapInterval, animated });
      activeIndexRef.current = index;
      onIndexChange?.(index);
    },
    [onIndexChange, snapInterval],
  );

  useEffect(() => {
    if (paused || itemCount <= 1) return;

    const timer = setInterval(() => {
      const next = (activeIndexRef.current + 1) % itemCount;
      scrollToIndex(next);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [paused, itemCount, intervalMs, scrollToIndex]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / snapInterval);
    if (index >= 0 && index < itemCount && index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      onIndexChange?.(index);
    }
    onScroll?.(e);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScrollBeginDrag={() => setPaused(true)}
      onScrollEndDrag={() => setPaused(false)}
      onMomentumScrollEnd={() => setPaused(false)}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      decelerationRate="fast"
      snapToInterval={snapInterval}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  );
}

import { AnimatedSection } from '@/components/home/AnimatedSection';
import { AutoScrollCarousel } from '@/components/home/AutoScrollCarousel';
import { CountUpStat } from '@/components/home/CountUpStat';
import { ScalePressable } from '@/components/home/ScalePressable';
import { OfferMarquee } from '@/components/OfferMarquee';
import { CallButton, TrustBadge, WhatsAppButton } from '@/components/ui';
import { brandAssets } from '@/lib/assets';
import { featuredReviews, heroMessages, homeStats, quickActions } from '@/lib/data/home';
import { openWebPage } from '@/lib/navigation';
import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInLeft,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const REVIEW_CARD_WIDTH = SCREEN_WIDTH - 64;
const SERVICE_CARD_WIDTH = SCREEN_WIDTH * 0.72;

const serviceCards = [
  {
    title: 'Airport Pickup',
    subtitle: 'IGI & domestic terminals',
    image: require('@/assets/images/airtportservice.png'),
    path: '/igi-airport-delhi-parent-pickup',
  },
  {
    title: 'Station Pickup',
    subtitle: 'All major Delhi NCR stations',
    image: require('@/assets/images/railwaystationservice.png'),
    path: '/new-delhi-railway-station-parent-pickup',
  },
  {
    title: 'Interchange',
    subtitle: 'Train ↔ flight transfers',
    image: require('@/assets/images/interchangeservice.png'),
    path: '/interchange-service',
  },
  {
    title: 'Elder Tour',
    subtitle: 'Delhi sightseeing packages',
    image: require('@/assets/images/tourpackageservice.png'),
    path: '/delhi-elder-tour',
  },
];

const whyNotCab = [
  { icon: 'heart-outline', title: 'Human Responsibility', desc: 'Someone who cares, not just a driver.' },
  { icon: 'home-outline', title: 'Till Home, Not Till Gate', desc: 'We help with luggage and ensure they are safely inside.' },
  { icon: 'notifications-outline', title: 'You Stay Informed', desc: 'Live updates at every step of the journey.' },
  { icon: 'shield-checkmark-outline', title: 'Peace of Mind', desc: 'Focus on your work knowing your parent is cared for.' },
];

function ReviewDot({ active }: { active: boolean }) {
  const width = useSharedValue(active ? 18 : 6);

  useEffect(() => {
    width.value = withTiming(active ? 18 : 6, { duration: 300 });
  }, [active, width]);

  const dotStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: 6,
    borderRadius: 3,
  }));

  return (
    <Animated.View
      style={[dotStyle, { backgroundColor: active ? colors.primaryBlue : colors.gray300 }]}
    />
  );
}

function PulseBookButton({ onPress }: { onPress: () => void }) {
  const pulse = useSharedValue(1);
  const pressed = useSharedValue(false);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.03, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ scale: pressed.value ? 0.95 : pulse.value }],
  }));

  return (
    <Animated.View style={pulseStyle}>
      <ScalePressable
        haptic="medium"
        style={styles.primaryBtn}
        onPress={onPress}
        onPressIn={() => {
          pressed.value = true;
        }}
        onPressOut={() => {
          pressed.value = false;
        }}
      >
        <Text style={styles.primaryBtnText}>Book Online</Text>
      </ScalePressable>
    </Animated.View>
  );
}

function HowStep({
  number,
  title,
  text,
  stepIndex,
}: {
  number: string;
  title: string;
  text: string;
  stepIndex: number;
}) {
  return (
    <Animated.View entering={FadeInLeft.delay(stepIndex * 120).duration(400)} style={styles.howRow}>
      <View style={styles.howNumber}>
        <Text style={styles.howNumberText}>{number}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.howTitle}>{title}</Text>
        <Text style={styles.howText}>{text}</Text>
      </View>
    </Animated.View>
  );
}

export default function HomeHeroCard() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const heroIndexRef = useRef(0);

  const scrollY = useSharedValue(0);
  const heroOpacity = useSharedValue(1);
  const heroTranslateY = useSharedValue(0);
  const floatY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: scrollY.value * 0.15 },
      { scale: interpolate(scrollY.value, [0, 200], [1, 0.95], Extrapolation.CLAMP) },
    ],
  }));

  const heroTextStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const advanceHero = useCallback(() => {
    heroOpacity.value = withTiming(0, { duration: 250 });
    heroTranslateY.value = withTiming(-12, { duration: 250 }, (finished) => {
      if (!finished) return;
      heroIndexRef.current = (heroIndexRef.current + 1) % heroMessages.length;
      runOnJS(setHeroIndex)(heroIndexRef.current);
      heroTranslateY.value = 12;
      heroOpacity.value = withTiming(1, { duration: 350 });
      heroTranslateY.value = withTiming(0, { duration: 350 });
    });
  }, [heroOpacity, heroTranslateY]);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(withTiming(-4, { duration: 1500 }), withTiming(4, { duration: 1500 })),
      -1,
      true,
    );
  }, [floatY]);

  useEffect(() => {
    const timer = setInterval(advanceHero, 4000);
    return () => clearInterval(timer);
  }, [advanceHero]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    heroIndexRef.current = 0;
    setHeroIndex(0);
    setActiveReview(0);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleQuickAction = (action: (typeof quickActions)[number]) => {
    if ('webPath' in action && action.webPath) {
      openWebPage(action.webPath, action.label);
      return;
    }
    if ('route' in action && action.route) {
      router.navigate(`/(drawer)/(tabs)${action.route}` as any);
    }
  };

  let sectionIndex = 0;

  return (
    <Animated.ScrollView
      style={styles.scroll}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryBlue]} />}
    >
      <OfferMarquee />

      <Animated.View style={[styles.hero, heroParallaxStyle]}>
        <Animated.View style={[styles.heroIconBox, floatStyle]}>
          <Image source={brandAssets.favicon} style={styles.heroLogo} contentFit="contain" />
        </Animated.View>

        <Animated.Text style={[styles.heroTitle, heroTextStyle]}>
          {heroMessages[heroIndex]}
        </Animated.Text>

        <Text style={styles.heroSubtitle}>
          We personally receive your parents at the station or airport and drop them home safely.
        </Text>

        <View style={styles.statsRow}>
          {homeStats.map((stat) => (
            <CountUpStat
              key={stat.label}
              label={stat.label}
              icon={stat.icon}
              display={stat.display}
              animateValue={stat.animateValue}
              suffix={stat.suffix}
              prefix={stat.prefix}
              decimals={stat.decimals}
            />
          ))}
        </View>

        <View style={styles.heroButtons}>
          <PulseBookButton onPress={() => router.navigate('/(drawer)/(tabs)/bookservice')} />
          <WhatsAppButton />
        </View>

        <ScalePressable
          haptic="light"
          style={styles.pricingLink}
          onPress={() => router.navigate('/(drawer)/(tabs)/pricing')}
        >
          <Text style={styles.pricingLinkText}>Calculate Your Price</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primaryBlue} />
        </ScalePressable>
      </Animated.View>

      <AnimatedSection index={sectionIndex++} style={styles.quickActions}>
        {quickActions.map((action) => (
          <ScalePressable
            key={action.label}
            haptic="light"
            style={styles.quickActionBtn}
            onPress={() => handleQuickAction(action)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon} size={20} color={colors.white} />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </ScalePressable>
        ))}
      </AnimatedSection>

      <AnimatedSection index={sectionIndex++} style={styles.section}>
        <TrustBadge text="Background-verified companions" />
        <TrustBadge text="Doorstep responsibility" />
        <TrustBadge text="Live journey updates for family" />
      </AnimatedSection>

      <AnimatedSection index={sectionIndex++} style={styles.section}>
        <Text style={styles.sectionTitle}>How Care2Home Works</Text>
        <HowStep stepIndex={0} number="1" title="Book a Care Companion" text="Share travel details online or via WhatsApp." />
        <HowStep stepIndex={1} number="2" title="Companion meets your parent" text="Verified companion with name placard at station/airport." />
        <HowStep stepIndex={2} number="3" title="Safe travel home" text="Live updates until safe handover at home." />
      </AnimatedSection>

      <AnimatedSection index={sectionIndex++} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <ScalePressable haptic="none" onPress={() => router.navigate('/(drawer)/(tabs)/services')}>
            <Text style={styles.seeAll}>See all</Text>
          </ScalePressable>
        </View>
        <AutoScrollCarousel itemWidth={SERVICE_CARD_WIDTH} itemCount={serviceCards.length}>
          {serviceCards.map((card) => (
            <ScalePressable
              key={card.title}
              haptic="light"
              style={styles.serviceCarouselCard}
              onPress={() => openWebPage(card.path, card.title)}
            >
              <Image source={card.image} style={styles.serviceCarouselImage} contentFit="cover" />
              <View style={styles.serviceCarouselBody}>
                <Text style={styles.serviceTitle}>{card.title}</Text>
                <Text style={styles.serviceSubtitle}>{card.subtitle}</Text>
                <Text style={styles.serviceLink}>View Details →</Text>
              </View>
            </ScalePressable>
          ))}
        </AutoScrollCarousel>
      </AnimatedSection>

      <AnimatedSection index={sectionIndex++} style={styles.section}>
        <Text style={styles.sectionTitle}>Why not just book a cab?</Text>
        {whyNotCab.map((item) => (
          <View key={item.title} style={styles.whyRow}>
            <Ionicons name={item.icon as any} size={22} color={colors.primaryBlue} />
            <View style={styles.whyText}>
              <Text style={styles.whyTitle}>{item.title}</Text>
              <Text style={styles.whyDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </AnimatedSection>

      <AnimatedSection index={sectionIndex++} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What families say</Text>
          <ScalePressable haptic="none" onPress={() => openWebPage('/reviews', 'Reviews')}>
            <Text style={styles.seeAll}>All reviews</Text>
          </ScalePressable>
        </View>
        <AutoScrollCarousel
          itemWidth={REVIEW_CARD_WIDTH}
          itemCount={featuredReviews.length}
          onIndexChange={setActiveReview}
        >
          {featuredReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.starsRow}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color="#F59E0B" />
                ))}
              </View>
              <Text style={styles.reviewQuote}>&ldquo;{review.quote}&rdquo;</Text>
              <Text style={styles.reviewAuthor}>
                {review.author} · {review.location}
              </Text>
            </View>
          ))}
        </AutoScrollCarousel>
        <View style={styles.dotsRow}>
          {featuredReviews.map((_, i) => (
            <ReviewDot key={i} active={activeReview === i} />
          ))}
        </View>
      </AnimatedSection>

      <AnimatedSection index={sectionIndex++}>
        <ScalePressable
          haptic="light"
          style={styles.safetyTeaser}
          onPress={() => openWebPage('/safety', 'Safety & Trust')}
        >
          <Text style={styles.safetyTitle}>Safety & Trust</Text>
          <Text style={styles.safetyDesc}>
            Police verification, 24/7 emergency support, and live journey updates.
          </Text>
          <Text style={styles.learnMore}>Learn more →</Text>
        </ScalePressable>
      </AnimatedSection>

      <AnimatedSection index={sectionIndex++} style={[styles.ctaSection, { marginBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <Text style={styles.ctaTitle}>Ready to ensure safe travel for your parents?</Text>
        <View style={styles.ctaButtons}>
          <CallButton />
          <WhatsAppButton />
        </View>
      </AnimatedSection>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.gray50 },
  hero: {
    backgroundColor: colors.careBlueHero,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 56,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.gray700,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  heroIconBox: {
    marginBottom: 12,
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  heroLogo: { width: 56, height: 56 },
  statsRow: { flexDirection: 'row', gap: 8, width: '100%', marginBottom: 14 },
  heroButtons: { flexDirection: 'row', gap: 10, width: '100%' },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.ctaGreen,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  pricingLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  pricingLinkText: { color: colors.primaryBlue, fontWeight: '600', fontSize: 14 },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  quickActionBtn: { alignItems: 'center', width: '23%' },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionLabel: { fontSize: 11, fontWeight: '600', color: colors.gray700, textAlign: 'center' },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.gray900 },
  seeAll: { fontSize: 13, fontWeight: '600', color: colors.primaryBlue },
  howRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  howNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howNumberText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  howTitle: { fontSize: 15, fontWeight: '600', color: colors.gray900 },
  howText: { fontSize: 13, color: colors.gray500, marginTop: 2 },
  whyRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  whyText: { flex: 1 },
  whyTitle: { fontSize: 15, fontWeight: '600', color: colors.gray900 },
  whyDesc: { fontSize: 13, color: colors.gray500, marginTop: 2 },
  serviceCarouselCard: {
    width: SERVICE_CARD_WIDTH,
    marginRight: 12,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  serviceCarouselImage: { width: '100%', height: 120 },
  serviceCarouselBody: { padding: 12 },
  serviceTitle: { fontSize: 16, fontWeight: '700', color: colors.gray900 },
  serviceSubtitle: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  serviceLink: { fontSize: 13, color: colors.primaryBlue, marginTop: 6, fontWeight: '600' },
  reviewCard: {
    width: REVIEW_CARD_WIDTH,
    marginRight: 12,
    backgroundColor: colors.careBlueLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  reviewQuote: { fontSize: 14, color: colors.gray700, lineHeight: 20, fontStyle: 'italic' },
  reviewAuthor: { fontSize: 12, fontWeight: '600', color: colors.gray900, marginTop: 10 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  safetyTeaser: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.trustBadge,
    borderRadius: 16,
    padding: 16,
  },
  safetyTitle: { fontSize: 17, fontWeight: '700', color: colors.trustBadgeForeground },
  safetyDesc: { fontSize: 14, color: colors.gray700, marginTop: 6, lineHeight: 20 },
  learnMore: { fontSize: 14, fontWeight: '600', color: colors.primaryBlue, marginTop: 8 },
  ctaSection: {
    margin: 16,
    backgroundColor: colors.headerBlue,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButtons: { flexDirection: 'row', gap: 10, width: '100%' },
});

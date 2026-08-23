import { AnimatedSection } from '@/components/home/AnimatedSection';
import { Card } from '@/components/ui/Card';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { colors, spacing, typography } from '@/lib/theme';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AuthScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthScreenLayout({ title, subtitle, children, footer }: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const keyboardOpen = keyboardHeight > 0;
  const content = (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        keyboardOpen && styles.scrollContentCompact,
        {
          paddingTop: insets.top + (keyboardOpen ? spacing.md : spacing.lg),
          paddingBottom:
            insets.bottom +
            spacing.xl +
            (Platform.OS === 'android' ? keyboardHeight : 0),
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <AnimatedSection
        index={0}
        style={[styles.header, keyboardOpen && styles.headerCompact]}
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle && !keyboardOpen ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </AnimatedSection>

      <AnimatedSection index={1} style={styles.cardWrapper}>
        <Card style={styles.card}>{children}</Card>
      </AnimatedSection>

      {!keyboardOpen ? (
        <AnimatedSection index={2} style={styles.trustWrapper}>
          <TrustBadge text="Safe & trusted parent pickup service" />
        </AnimatedSection>
      ) : null}

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </ScrollView>
  );

  return (
    <View style={styles.root}>
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior="padding"
          keyboardVerticalOffset={insets.top}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.flex}>{content}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.careBlueLight,
  },
  flex: {
    flex: 1,
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: colors.careBlueHero,
    opacity: 0.55,
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: colors.white,
    opacity: 0.4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  scrollContentCompact: {
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  headerCompact: {
    marginBottom: spacing.md,
  },
  logo: {
    width: 120,
    height: 48,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    color: colors.headerBlue,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    padding: spacing.xl,
  },
  trustWrapper: {
    marginTop: spacing.xl,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
});

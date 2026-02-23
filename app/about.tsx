import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { JSX } from 'react';
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AboutScreen(): JSX.Element {
  return (
    <ScrollView style={styles.container}>
      {/* ---------- HERO ---------- */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Trusted care for your parents, till home
        </Text>

        <Text style={styles.heroDescription}>
          We understand the anxiety of having your parents travel alone.
          Care2Home provides trained, verified companions who ensure your loved
          ones reach home safely with live updates every step of the way.
        </Text>

        <View style={styles.heroActions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/bookservice')}
          >
            <Text style={styles.primaryButtonText}>
              Book Care Companion
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() =>
              Linking.openURL(
                'https://wa.me/919910646415?text=Hi%20I%20need%20parent%20pickup%20service.'
              )
            }
          >
            <Text style={styles.secondaryButtonText}>
              Talk on WhatsApp
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ---------- MISSION ---------- */}
      <Section title="Our Mission">
        <Text style={styles.paragraph}>
          At Care2Home, we believe that your parents deserve more than just a cab
          ride. They deserve someone who cares, someone who takes responsibility,
          and someone who ensures they are safely home before saying goodbye.
        </Text>

        <MissionCard
          icon="heart-outline"
          title="Human Connection"
          description="More than a service, we provide companionship. Our Care Companions treat your parents with the same respect and care they would their own family."
        />

        <MissionCard
          icon="shield-checkmark-outline"
          title="Complete Safety"
          description="Every companion is thoroughly background-verified. We take full responsibility from pickup to ensuring they are safely inside their home."
        />
      </Section>

      {/* ---------- STORY ---------- */}
      <Section title="Our Story" muted>
        <Text style={styles.paragraph}>
          Care2Home was born from a simple observation: thousands of families in
          India worry every time their elderly parents travel alone.
        </Text>

        <Text style={styles.paragraph}>
          Booking a cab wasn’t enough. Cab drivers drop passengers at the gate and
          leave — but who helps with luggage, stairs, or ensures they’re safely
          inside with their keys and medication?
        </Text>

        <Text style={styles.paragraph}>
          That’s when we decided to build something different — not just a
          transportation service, but a companion service. Someone who takes
          responsibility, someone who cares.
        </Text>

        <Text style={styles.highlightText}>
          Today, we’re proud to serve families across Delhi NCR, providing peace
          of mind one journey at a time.
        </Text>
      </Section>

      {/* ---------- DIFFERENTIATORS ---------- */}
      <Section title="What Sets Us Apart">
        <Feature
          icon="people-outline"
          title="Trained Companions"
          description="Specially trained in senior care, first aid, and emergency response."
        />

        <Feature
          icon="checkmark-circle-outline"
          title="Till Home Promise"
          description="We assist with luggage, stairs, and ensure your parent is safely inside before leaving."
        />

        <Feature
          icon="shield-outline"
          title="Complete Transparency"
          description="Live journey tracking, real-time updates, and 24/7 support."
        />
      </Section>
    </ScrollView>
  );
}

/* ---------- Reusable Components ---------- */

type SectionProps = {
  title: string;
  children: React.ReactNode;
  muted?: boolean;
};

function Section({
  title,
  children,
  muted = false,
}: SectionProps): JSX.Element {
  return (
    <View
      style={[
        styles.section,
        muted && { backgroundColor: '#F8FAFC' },
      ]}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

type MissionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function MissionCard({
  icon,
  title,
  description,
}: MissionCardProps): JSX.Element {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={26} color="#2563EB" />
      <View style={{ marginLeft: 14 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{description}</Text>
      </View>
    </View>
  );
}

type FeatureProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function Feature({
  icon,
  title,
  description,
}: FeatureProps): JSX.Element {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={28} color="#16A34A" />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{description}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  hero: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
    color: '#1E3A8A',
  },
  heroDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#475569',
    marginBottom: 24,
  },
  heroActions: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#2563EB',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },

  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E3A8A',
  },

  paragraph: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 14,
    lineHeight: 24,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    lineHeight: 24,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardText: {
    color: '#475569',
    lineHeight: 22,
  },

  feature: {
    alignItems: 'center',
    marginBottom: 28,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  featureText: {
    textAlign: 'center',
    color: '#475569',
    lineHeight: 22,
  },
});

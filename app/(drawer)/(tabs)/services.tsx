import { openWebPage } from '@/lib/navigation';
import { colors } from '@/lib/theme';
import { SERVICE_HUB_CATEGORIES } from '@/lib/webRoutes';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionTitle } from '@/components/ui';

export default function ServicesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle
        title="Our Services"
        subtitle="Explore Care2Home services across Delhi NCR and beyond"
      />

      {SERVICE_HUB_CATEGORIES.map((category) => (
        <Pressable
          key={category.path}
          style={styles.card}
          onPress={() => openWebPage(category.path, category.title)}
        >
          <Image source={category.image} style={styles.image} contentFit="cover" />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{category.title}</Text>
            <Text style={styles.cardDesc}>{category.description}</Text>
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primaryBlue} />
            </View>
          </View>
        </Pressable>
      ))}

      <View style={styles.stationsSection}>
        <Text style={styles.stationsTitle}>All Service Locations</Text>
        <Text style={styles.stationsDesc}>
          Browse station and airport pickup pages from the side menu under Serving Stations and
          Serving Airports.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    elevation: 2,
  },
  image: { width: '100%', height: 140 },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.gray900, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: colors.gray500, marginBottom: 10 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { fontSize: 14, fontWeight: '600', color: colors.primaryBlue },
  stationsSection: {
    backgroundColor: colors.careBlueLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  stationsTitle: { fontSize: 16, fontWeight: '700', color: colors.headerBlue, marginBottom: 6 },
  stationsDesc: { fontSize: 14, color: colors.gray700, lineHeight: 20 },
});

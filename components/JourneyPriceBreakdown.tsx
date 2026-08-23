import {
  CARE_COMPANION_INCLUDED_SERVICES,
  formatDistanceKm,
  formatIndianCurrencyRange,
  getVehicleLabel,
} from '@/lib/pricing/pricing';
import type { JourneyPricingResult } from '@/lib/types/pricing';
import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type JourneyPriceBreakdownProps = {
  pricing: JourneyPricingResult;
  showCta?: boolean;
  onBookPress?: () => void;
};

export function JourneyPriceBreakdown({ pricing, showCta, onBookPress }: JourneyPriceBreakdownProps) {
  const distanceLabel = formatDistanceKm(pricing.distanceKm);
  const vehicleLabel = getVehicleLabel(pricing.vehicleType);

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Ionicons name="sparkles" size={16} color={colors.white} />
        <Text style={styles.badgeText}>{pricing.discountPercent}% OFF — First-Time Users</Text>
      </View>

      <Text style={styles.title}>Your Journey Price</Text>
      <Text style={styles.subtitle}>{distanceLabel} km journey</Text>

      <Text style={styles.sectionLabel}>PRICE BREAKDOWN</Text>

      <View style={styles.breakdownCard}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Ionicons
              name={pricing.vehicleType === 'car' ? 'car' : 'bicycle'}
              size={20}
              color={colors.primaryBlue}
            />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{vehicleLabel}</Text>
            <Text style={styles.rowDesc}>{distanceLabel} km + applicable travel charges</Text>
          </View>
          <Text style={styles.rowPrice}>
            {formatIndianCurrencyRange(
              pricing.transportationFeeRange.min,
              pricing.transportationFeeRange.max,
            )}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.iconBox, styles.iconBoxGreen]}>
            <Ionicons name="person" size={20} color={colors.ctaGreen} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Care Companion</Text>
            <Text style={styles.rowDesc}>Dedicated assistance throughout the journey</Text>
          </View>
          <Text style={styles.rowPrice}>
            {formatIndianCurrencyRange(
              pricing.careCompanionFeeRange.min,
              pricing.careCompanionFeeRange.max,
            )}
          </Text>
        </View>
      </View>

      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.estimatedLabel}>Estimated Total</Text>
          <Text style={styles.strikethrough}>
            {formatIndianCurrencyRange(pricing.totalPriceRange.min, pricing.totalPriceRange.max)}
          </Text>
        </View>
        <View style={styles.discountRow}>
          <Ionicons name="pricetag" size={16} color={colors.ctaGreen} />
          <Text style={styles.discountText}>
            {pricing.discountPercent}% first-time user discount applied
          </Text>
        </View>
        <View style={styles.finalRow}>
          <Text style={styles.finalLabel}>Your Price</Text>
          <Text style={styles.finalPrice}>
            {formatIndianCurrencyRange(
              pricing.discountedTotalPriceRange.min,
              pricing.discountedTotalPriceRange.max,
            )}
          </Text>
        </View>
        <Text style={styles.finePrint}>
          * Valid for first-time users only. Final price confirmed at booking.
        </Text>
      </View>

      <View style={styles.includesCard}>
        <Text style={styles.includesTitle}>Care Companion includes:</Text>
        {CARE_COMPANION_INCLUDED_SERVICES.map((service) => (
          <View key={service} style={styles.includeRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.ctaGreen} />
            <Text style={styles.includeText}>{service}</Text>
          </View>
        ))}
      </View>

      {showCta && onBookPress ? (
        <Pressable style={styles.ctaBtn} onPress={onBookPress}>
          <Text style={styles.ctaText}>
            Book Now & Save —{' '}
            {formatIndianCurrencyRange(
              pricing.discountedTotalPriceRange.min,
              pricing.discountedTotalPriceRange.max,
            )}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
    padding: 16,
    marginTop: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: colors.gray900, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.ctaGreenDark, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: colors.gray500, marginBottom: 8 },
  breakdownCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.careBlueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxGreen: { backgroundColor: '#dcfce7' },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '600', color: colors.gray900 },
  rowDesc: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  rowPrice: { fontSize: 14, fontWeight: '600', color: colors.gray900 },
  totalCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 16,
    marginBottom: 12,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  estimatedLabel: { fontSize: 13, color: colors.gray500 },
  strikethrough: { fontSize: 14, color: colors.gray500, textDecorationLine: 'line-through' },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  discountText: { fontSize: 13, fontWeight: '600', color: colors.ctaGreenDark },
  finalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#dcfce7',
    paddingTop: 12,
  },
  finalLabel: { fontSize: 16, fontWeight: '700', color: colors.gray900 },
  finalPrice: { fontSize: 28, fontWeight: '700', color: colors.ctaGreenDark },
  finePrint: { fontSize: 11, color: colors.gray500, marginTop: 8 },
  includesCard: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  includesTitle: { fontSize: 13, fontWeight: '600', color: colors.gray900, marginBottom: 8 },
  includeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  includeText: { flex: 1, fontSize: 13, color: colors.gray700 },
  ctaBtn: {
    marginTop: 16,
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});

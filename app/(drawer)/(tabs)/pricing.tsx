import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { JourneyPriceBreakdown } from '@/components/JourneyPriceBreakdown';
import { Button, Card, SectionTitle } from '@/components/ui';
import { calculateJourneyPrice, reverseGeocodeNominatim } from '@/lib/api/care2home';
import { firstTimeUserDiscountPercent } from '@/lib/pricing/pricing-config';
import type { VehicleType } from '@/lib/pricing/pricing-config';
import type { JourneyPricingResult } from '@/lib/types/pricing';
import { colors } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const features = [
  'Verified Care Companion',
  'Live Journey Tracking',
  'Help with Luggage & Stairs',
  'Till Home Safety Promise',
  'Real-time Updates to Family',
  '24/7 Emergency Support',
];

const vehicleOptions: { type: VehicleType; label: string; description: string }[] = [
  { type: 'car', label: 'Car', description: 'Comfortable car for longer journeys' },
  { type: 'auto', label: 'Auto', description: 'Auto-rickshaw for shorter city trips' },
];

export default function PricingScreen() {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [originPlaceTypes, setOriginPlaceTypes] = useState<string[]>([]);
  const [destinationPlaceTypes, setDestinationPlaceTypes] = useState<string[]>([]);
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [pricing, setPricing] = useState<JourneyPricingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [error, setError] = useState('');

  const getCurrentAddress = async () => {
    setIsLoadingOrigin(true);
    setError('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location access denied. Please enable location permissions.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const address = await reverseGeocodeNominatim(
        position.coords.latitude,
        position.coords.longitude,
      );
      setOriginAddress(address);
      setOriginPlaceTypes([]);
    } catch (err: any) {
      setError(err.message || 'Failed to get current address.');
    } finally {
      setIsLoadingOrigin(false);
    }
  };

  const calculatePrice = async () => {
    setError('');
    setPricing(null);

    if (!originAddress.trim()) {
      setError('Please enter a pickup address');
      return;
    }
    if (!destinationAddress.trim()) {
      setError('Please enter a destination address');
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateJourneyPrice({
        originAddress: originAddress.trim(),
        destinationAddress: destinationAddress.trim(),
        vehicleType,
        originPlaceTypes,
        destinationPlaceTypes,
      });
      setPricing(result);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate price. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const bookNow = () => {
    router.push({
      pathname: '/(drawer)/(tabs)/bookservice',
      params: {
        source: 'pricing',
        origin: originAddress,
        destination: destinationAddress,
        vehicleType,
        pricingJson: pricing ? JSON.stringify(pricing) : '',
      },
    } as any);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.discountBanner}>
        <Ionicons name="sparkles" size={18} color={colors.white} />
        <Text style={styles.discountText}>
          {firstTimeUserDiscountPercent}% OFF — First Booking
        </Text>
      </View>

      <SectionTitle
        title="Calculate Your Journey Price"
        subtitle="Distance-based pricing with no hidden charges"
      />

      <Card>
        <AddressAutocomplete
          label="Pickup Address (Origin)"
          value={originAddress}
          onChangeText={setOriginAddress}
          onSelect={(s) => {
            setOriginPlaceTypes(s.placeTypes ?? []);
          }}
          placeholder="Enter pickup location"
          headerAction={
            <Pressable onPress={getCurrentAddress} style={styles.locationBtn}>
              {isLoadingOrigin ? (
                <ActivityIndicator size="small" color={colors.primaryBlue} />
              ) : (
                <>
                  <Ionicons name="navigate" size={14} color={colors.primaryBlue} />
                  <Text style={styles.locationBtnText}>Use Current Location</Text>
                </>
              )}
            </Pressable>
          }
        />

        <AddressAutocomplete
          label="Destination Address (Home)"
          value={destinationAddress}
          onChangeText={setDestinationAddress}
          onSelect={(s) => {
            setDestinationPlaceTypes(s.placeTypes ?? []);
          }}
          placeholder="Enter destination"
        />

        <Text style={styles.vehicleLabel}>Vehicle Type</Text>
        <View style={styles.vehicleRow}>
          {vehicleOptions.map((option) => (
            <Pressable
              key={option.type}
              style={[
                styles.vehicleCard,
                vehicleType === option.type && styles.vehicleCardActive,
              ]}
              onPress={() => setVehicleType(option.type)}
            >
              <Ionicons
                name={option.type === 'car' ? 'car' : 'bicycle'}
                size={24}
                color={vehicleType === option.type ? colors.primaryBlue : colors.gray500}
              />
              <Text
                style={[
                  styles.vehicleTitle,
                  vehicleType === option.type && styles.vehicleTitleActive,
                ]}
              >
                {option.label}
              </Text>
              <Text style={styles.vehicleDesc}>{option.description}</Text>
            </Pressable>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button onPress={calculatePrice} loading={isCalculating} style={{ marginTop: 8 }}>
          Calculate Price
        </Button>

        {pricing ? (
          <JourneyPriceBreakdown pricing={pricing} showCta onBookPress={bookNow} />
        ) : null}
      </Card>

      <Card style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>What&apos;s Included in Every Journey</Text>
        {features.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.ctaGreen} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.careBlueLight },
  content: { padding: 16, paddingBottom: 32 },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryBlue,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  discountText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  locationBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationBtnText: { fontSize: 12, color: colors.primaryBlue, fontWeight: '600' },
  vehicleLabel: { fontSize: 14, fontWeight: '500', color: colors.gray700, marginBottom: 8, marginTop: 4 },
  vehicleRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  vehicleCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  vehicleCardActive: { borderColor: colors.primaryBlue, backgroundColor: colors.careBlueLight },
  vehicleTitle: { fontSize: 15, fontWeight: '600', color: colors.gray700, marginTop: 6 },
  vehicleTitleActive: { color: colors.primaryBlue },
  vehicleDesc: { fontSize: 11, color: colors.gray500, textAlign: 'center', marginTop: 4 },
  error: { color: colors.danger, fontSize: 14, marginBottom: 8 },
  featuresCard: { marginTop: 16 },
  featuresTitle: { fontSize: 16, fontWeight: '700', color: colors.gray900, marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  featureText: { fontSize: 14, color: colors.gray700, flex: 1 },
});

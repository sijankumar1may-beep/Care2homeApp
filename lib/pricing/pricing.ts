import type { PriceRange, JourneyPricingResult, LocationCategory } from '@/lib/types/pricing';
import {
  firstTimeUserDiscountPercent,
  pricingConfig,
  pricingRangeConfig,
  type PricingConfig,
  type VehicleType,
} from './pricing-config';
import { detectLocationCategory, shouldApplyAirportSurcharge } from './location-types';

export const CARE_COMPANION_INCLUDED_SERVICES = [
  'Luggage assistance',
  'Journey guidance',
  'Platform assistance',
  'Coach/seat assistance',
  'Assistance until your parent is comfortably settled',
  'Journey coordination/status updates',
] as const;

export function formatIndianCurrency(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatIndianCurrencyRange(min: number, max: number): string {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return '₹0';
  const roundedMin = Math.round(min);
  const roundedMax = Math.round(max);
  if (roundedMin === roundedMax) return formatIndianCurrency(roundedMin);
  return `${formatIndianCurrency(roundedMin)} – ${formatIndianCurrency(roundedMax)}`;
}

export function applyFirstTimeDiscount(amount: number): number {
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return sanitizeAmount(amount * (1 - firstTimeUserDiscountPercent / 100));
}

export function applyFirstTimeDiscountToRange(range: PriceRange): PriceRange {
  return { min: applyFirstTimeDiscount(range.min), max: applyFirstTimeDiscount(range.max) };
}

export function formatDistanceKm(distanceKm: number): string {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return '0';
  const rounded = Math.round(distanceKm * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function sanitizeAmount(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value);
}

type CalculateJourneyPricingInput = {
  distanceKm: number;
  vehicleType: VehicleType;
  originAddress: string;
  destinationAddress: string;
  originPlaceTypes?: string[];
  destinationPlaceTypes?: string[];
  originLocationType?: LocationCategory;
  destinationLocationType?: LocationCategory;
};

function calculatePricingWithConfig(input: CalculateJourneyPricingInput, config: PricingConfig) {
  const { distanceKm, vehicleType } = input;
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return null;

  const vehicleConfig = config[vehicleType];
  if (!vehicleConfig) return null;

  const originLocationType =
    input.originLocationType ?? detectLocationCategory(input.originAddress, input.originPlaceTypes ?? []);
  const destinationLocationType =
    input.destinationLocationType ??
    detectLocationCategory(input.destinationAddress, input.destinationPlaceTypes ?? []);

  const distanceCharge = distanceKm * vehicleConfig.perKmRate;
  const airportSurcharge = shouldApplyAirportSurcharge(
    originLocationType,
    destinationLocationType,
    config.airportSurchargeRules,
  )
    ? config.airportSurcharge
    : 0;

  const rawTransportationTotal = vehicleConfig.baseFare + distanceCharge + airportSurcharge;
  const transportationTotal =
    vehicleConfig.minimumFare > 0
      ? Math.max(sanitizeAmount(rawTransportationTotal), vehicleConfig.minimumFare)
      : sanitizeAmount(rawTransportationTotal);

  const careCompanionFee = sanitizeAmount(config.careCompanionFee);
  const totalPrice = transportationTotal + careCompanionFee;

  return {
    distanceKm,
    vehicleType,
    originLocationType,
    destinationLocationType,
    transportation: {
      vehicleType,
      baseFare: vehicleConfig.baseFare,
      distanceRate: vehicleConfig.perKmRate,
      distanceCharge,
      airportSurcharge,
      total: transportationTotal,
    },
    careCompanion: { fee: careCompanionFee },
    transportationFee: transportationTotal,
    careCompanionFee,
    totalPrice,
  };
}

export function calculateJourneyPricing(
  input: CalculateJourneyPricingInput,
  config: PricingConfig = pricingConfig,
  rangeConfig: PricingConfig = pricingRangeConfig,
): JourneyPricingResult | null {
  const basePricing = calculatePricingWithConfig(input, config);
  const maxPricing = calculatePricingWithConfig(input, rangeConfig);
  if (!basePricing || !maxPricing) return null;

  return {
    ...basePricing,
    transportationFeeRange: { min: basePricing.transportationFee, max: maxPricing.transportationFee },
    careCompanionFeeRange: { min: basePricing.careCompanionFee, max: maxPricing.careCompanionFee },
    totalPriceRange: { min: basePricing.totalPrice, max: maxPricing.totalPrice },
    discountPercent: firstTimeUserDiscountPercent,
    discountedTotalPriceRange: applyFirstTimeDiscountToRange({
      min: basePricing.totalPrice,
      max: maxPricing.totalPrice,
    }),
  };
}

export function getVehicleLabel(vehicleType: VehicleType): string {
  return pricingConfig[vehicleType]?.label ?? 'Transportation';
}

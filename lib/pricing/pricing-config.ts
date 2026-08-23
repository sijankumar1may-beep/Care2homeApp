export type VehicleType = 'car' | 'auto';

export type VehiclePricingConfig = {
  baseFare: number;
  perKmRate: number;
  minimumFare: number;
  label: string;
};

export type AirportSurchargeRules = {
  applyWhenOriginIsAirport: boolean;
  applyWhenDestinationIsAirport: boolean;
};

export type PricingConfig = {
  car: VehiclePricingConfig;
  auto: VehiclePricingConfig;
  careCompanionFee: number;
  airportSurcharge: number;
  airportSurchargeRules: AirportSurchargeRules;
};

export const firstTimeUserDiscountPercent = 10;

export const pricingConfig: PricingConfig = {
  car: {
    baseFare: 260,
    perKmRate: 15,
    minimumFare: 0,
    label: 'Car Service',
  },
  auto: {
    baseFare: 130,
    perKmRate: 12,
    minimumFare: 0,
    label: 'Auto Service',
  },
  careCompanionFee: 310,
  airportSurcharge: 160,
  airportSurchargeRules: {
    applyWhenOriginIsAirport: true,
    applyWhenDestinationIsAirport: true,
  },
};

export const pricingRangeConfig: PricingConfig = {
  car: {
    baseFare: 320,
    perKmRate: 19,
    minimumFare: 0,
    label: 'Car Service',
  },
  auto: {
    baseFare: 170,
    perKmRate: 17,
    minimumFare: 0,
    label: 'Auto Service',
  },
  careCompanionFee: 380,
  airportSurcharge: 210,
  airportSurchargeRules: {
    applyWhenOriginIsAirport: true,
    applyWhenDestinationIsAirport: true,
  },
};

import type { LocationCategory } from '@/lib/types/pricing';

const AIRPORT_PLACE_TYPES = new Set(['airport', 'international_airport']);
const RAILWAY_PLACE_TYPES = new Set([
  'train_station',
  'transit_station',
  'subway_station',
  'light_rail_station',
]);

const AIRPORT_KEYWORDS = ['airport', 'aerodrome', 'airstrip', 'igi', 'indira gandhi international'];
const RAILWAY_KEYWORDS = ['railway', 'railway station', 'train station', 'metro station', 'junction'];

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => normalized.includes(keyword));
}

export function detectLocationCategory(address: string, placeTypes: string[] = []): LocationCategory {
  const normalizedTypes = placeTypes.map((type) => normalizeText(type));

  if (normalizedTypes.some((type) => AIRPORT_PLACE_TYPES.has(type))) return 'airport';
  if (normalizedTypes.some((type) => RAILWAY_PLACE_TYPES.has(type))) return 'railway';
  if (matchesKeywords(address, AIRPORT_KEYWORDS)) return 'airport';
  if (matchesKeywords(address, RAILWAY_KEYWORDS)) return 'railway';
  return 'other';
}

export function shouldApplyAirportSurcharge(
  originType: LocationCategory,
  destinationType: LocationCategory,
  rules: { applyWhenOriginIsAirport: boolean; applyWhenDestinationIsAirport: boolean },
): boolean {
  if (originType === 'airport' && rules.applyWhenOriginIsAirport) return true;
  if (destinationType === 'airport' && rules.applyWhenDestinationIsAirport) return true;
  return false;
}

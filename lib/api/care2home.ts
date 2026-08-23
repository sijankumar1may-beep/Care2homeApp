import type { AddressSuggestion } from '@/lib/types/address';
import type { JourneyPricingResult } from '@/lib/types/pricing';
import type { VehicleType } from '@/lib/pricing/pricing-config';
import { WEB_BASE_URL } from '@/lib/theme';

const API_BASE = `${WEB_BASE_URL}/api`;

export async function calculateJourneyPrice(body: {
  originAddress: string;
  destinationAddress: string;
  vehicleType: VehicleType;
  originPlaceTypes?: string[];
  destinationPlaceTypes?: string[];
}): Promise<JourneyPricingResult> {
  const response = await fetch(`${API_BASE}/calculate-journey-price`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to calculate price');
  }
  return data as JourneyPricingResult;
}

export async function placeAutocomplete(input: string): Promise<AddressSuggestion[]> {
  const response = await fetch(`${API_BASE}/place-autocomplete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });

  const data = await response.json();
  if (!response.ok) return [];
  return (data.suggestions ?? []) as AddressSuggestion[];
}

export async function reverseGeocodeNominatim(latitude: number, longitude: number): Promise<string> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
    { headers: { 'User-Agent': 'Care2Home/1.0' } },
  );

  if (!response.ok) throw new Error('Failed to fetch address');

  const data = await response.json();
  const address =
    data.display_name ||
    `${data.address?.road || ''} ${data.address?.house_number || ''}, ${data.address?.suburb || data.address?.neighbourhood || ''}, ${data.address?.city || data.address?.town || ''}, ${data.address?.state || ''} ${data.address?.postcode || ''}`.trim();

  if (!address) throw new Error('Could not determine address from location');
  return address;
}

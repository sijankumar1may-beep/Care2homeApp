import {
  formatDistanceKm,
  formatIndianCurrencyRange,
  getVehicleLabel,
} from '@/lib/pricing/pricing';
import type { JourneyPricingResult } from '@/lib/types/pricing';
import { WHATSAPP_NUMBER } from '@/lib/theme';

type BookingWhatsAppParams = {
  phone: string;
  email?: string;
  address: string;
  imageUrl?: string | null;
  pricing?: JourneyPricingResult | null;
  origin?: string;
  destination?: string;
};

export function buildBookingWhatsAppMessage({
  phone,
  email,
  address,
  imageUrl,
  pricing,
  origin,
  destination,
}: BookingWhatsAppParams): string {
  const pricingSection = pricing
    ? `
💰 *Journey Price:* ${formatIndianCurrencyRange(pricing.discountedTotalPriceRange.min, pricing.discountedTotalPriceRange.max)} (${pricing.discountPercent}% first-time discount applied)
   Estimated before discount: ${formatIndianCurrencyRange(pricing.totalPriceRange.min, pricing.totalPriceRange.max)}
   ${getVehicleLabel(pricing.vehicleType)}: ${formatIndianCurrencyRange(pricing.transportationFeeRange.min, pricing.transportationFeeRange.max)}
   Care Companion: ${formatIndianCurrencyRange(pricing.careCompanionFeeRange.min, pricing.careCompanionFeeRange.max)}
📏 *Distance:* ${formatDistanceKm(pricing.distanceKm)} km
🚗 *Vehicle:* ${pricing.vehicleType === 'car' ? 'Car' : 'Auto'}`
    : '';

  const routeSection =
    origin || destination
      ? `
📍 *Origin:* ${origin || 'Not provided'}
🏠 *Destination:* ${destination || 'Not provided'}`
      : '';

  return `
🟢 *New Care2Home Booking Request*

📋 *Booking Details:*${pricingSection}${routeSection}

📸 *Ticket Image:* ${imageUrl || 'Not provided'}

📍 *Pickup/Drop Address:*
${address}

📞 *Phone Number:* ${phone}

📧 *Email:* ${email || 'Not provided'}

---
*Thank you for choosing Care2Home!*
  `.trim();
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

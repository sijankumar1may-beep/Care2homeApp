import { colors } from '@/lib/theme';

export const offerMarqueeText = '₹100 OFF your first booking — limited time';

export const heroMessages = [
  'Parents arriving today or tomorrow?',
  'Safe pickup from airport & railway stations',
  'Live updates for your peace of mind',
  'Verified companions till home — not till gate',
];

export type HomeStat = {
  label: string;
  display: string;
  icon: 'time-outline' | 'star-outline' | 'location-outline';
  animateValue?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
};

export const homeStats: HomeStat[] = [
  {
    label: 'Avg response',
    display: '< 5 min',
    icon: 'time-outline' as const,
  },
  {
    label: 'Family rating',
    display: '4.8 ★',
    animateValue: 4.8,
    decimals: 1,
    suffix: ' ★',
    icon: 'star-outline' as const,
  },
  {
    label: 'Coverage',
    display: '100+ cities',
    animateValue: 100,
    suffix: '+ cities',
    icon: 'location-outline' as const,
  },
];

export const featuredReviews = [
  {
    id: '1',
    quote:
      'The Care Companion met my mother at IGI with a placard and stayed until she was safely home. WhatsApp updates throughout.',
    author: 'Priya S.',
    location: 'Noida',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'Care2Home is our default for New Delhi Railway Station pickups. The companion knows the station exits perfectly.',
    author: 'Amit K.',
    location: 'Delhi',
    rating: 5,
  },
  {
    id: '3',
    quote:
      'We live in the US and could not be at the airport. Live WhatsApp updates were a huge relief.',
    author: 'Neha & Raj',
    location: 'Gurgaon',
    rating: 5,
  },
];

export const quickActions = [
  { label: 'Book Now', icon: 'calendar-outline' as const, route: '/bookservice', color: colors.ctaGreen },
  { label: 'Pricing', icon: 'pricetag-outline' as const, route: '/pricing', color: colors.primaryBlue },
  { label: 'Services', icon: 'grid-outline' as const, route: '/services', color: colors.headerBlue },
  {
    label: 'Safety',
    icon: 'shield-checkmark-outline' as const,
    webPath: '/safety',
    color: colors.trustBadgeForeground,
  },
];

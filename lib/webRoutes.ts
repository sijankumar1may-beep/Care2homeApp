export type WebRoute = {
  label: string;
  path: string;
  icon?: string;
};

export type WebRouteSection = {
  title: string;
  routes: WebRoute[];
};

export const WEB_ROUTE_SECTIONS: WebRouteSection[] = [
  {
    title: 'Account',
    routes: [
      { label: 'My Bookings', path: '/mybookings', icon: 'clipboard-outline' },
      { label: 'Profile', path: '/profile', icon: 'person-outline' },
    ],
  },
  {
    title: 'Serving Stations',
    routes: [
      { label: 'New Delhi Railway Station', path: '/new-delhi-railway-station-parent-pickup' },
      { label: 'Old Delhi Railway Station', path: '/old-delhi-railway-station-parent-pickup' },
      { label: 'Delhi Cantt Railway Station', path: '/delhi-cantt-railway-station-parent-pickup' },
      { label: 'Hazrat Nizamuddin Station', path: '/hazrat-nizamuddin-railway-station-parent-pickup' },
      { label: 'Anand Vihar Station', path: '/anand-vihar-railway-station-parent-pickup' },
      { label: 'Ghaziabad Station', path: '/ghaziabad-railway-station-parent-pickup' },
      { label: 'Delhi Sarai Rohilla Station', path: '/delhi-sarai-rohilla-railway-station-parent-pickup' },
      { label: 'Jaipur Railway Station', path: '/jaipur-railway-station-parent-pickup' },
    ],
  },
  {
    title: 'Serving Airports',
    routes: [
      { label: 'IGI Airport Delhi', path: '/igi-airport-delhi-parent-pickup' },
      { label: 'T3 IGI Airport', path: '/t3-igi-airport-parent-pickup' },
    ],
  },
  {
    title: 'Services',
    routes: [
      { label: 'Stations Interchange', path: '/interchange-service' },
      { label: 'Delhi Elder Tour', path: '/delhi-elder-tour' },
    ],
  },
  {
    title: 'Information',
    routes: [
      { label: 'FAQ', path: '/faq', icon: 'help-circle-outline' },
      { label: 'Safety & Trust', path: '/safety', icon: 'shield-checkmark-outline' },
      { label: 'Reviews', path: '/reviews', icon: 'star-outline' },
      { label: 'Blog', path: '/blog', icon: 'newspaper-outline' },
      { label: 'About Us', path: '/about-us', icon: 'information-circle-outline' },
      { label: 'Vision & Mission', path: '/vision-mission', icon: 'eye-outline' },
      { label: 'Contact Us', path: '/contact-us', icon: 'call-outline' },
      { label: 'Terms of Service', path: '/terms', icon: 'document-text-outline' },
      { label: 'Privacy Policy', path: '/privacy-policy', icon: 'lock-closed-outline' },
    ],
  },
];

export const SERVICE_HUB_CATEGORIES = [
  {
    title: 'Airport Pickup & Drop',
    description: 'Safe airport assistance for your parents',
    image: require('@/assets/images/airtportservice.png'),
    path: '/igi-airport-delhi-parent-pickup',
  },
  {
    title: 'Station Pickup & Drop',
    description: 'Railway station companion service',
    image: require('@/assets/images/railwaystationservice.png'),
    path: '/new-delhi-railway-station-parent-pickup',
  },
  {
    title: 'Interchange Service',
    description: 'Train to flight transfers',
    image: require('@/assets/images/interchangeservice.png'),
    path: '/interchange-service',
  },
  {
    title: 'Tour Packages',
    description: 'Delhi elder tour packages',
    image: require('@/assets/images/tourpackageservice.png'),
    path: '/delhi-elder-tour',
  },
];

export function getWebUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `https://care2home.co${normalized}?embed=app`;
}

export function isNativeRoute(path: string): boolean {
  return path === '/mybookings' || path === '/profile' || path === '/editprofile';
}

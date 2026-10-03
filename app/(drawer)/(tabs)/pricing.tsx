import EmbeddedWebView from '@/components/EmbeddedWebView';
import { getWebUrl } from '@/lib/webRoutes';
import React from 'react';

export default function PricingScreen() {
  return <EmbeddedWebView url={getWebUrl('/pricing')} enableGeolocation />;
}

import EmbeddedWebView from '@/components/EmbeddedWebView';
import { getWebUrl } from '@/lib/webRoutes';
import React from 'react';

export default function BookServiceScreen() {
  return <EmbeddedWebView url={getWebUrl('/book-service')} enableGeolocation />;
}

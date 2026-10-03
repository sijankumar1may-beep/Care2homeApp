import { colors } from '@/lib/theme';
import {
  isExternalAppUrl,
  openExternalUrl,
  WEBVIEW_EMBED_STYLE_SCRIPT,
  WEBVIEW_LINK_INTERCEPT_SCRIPT,
} from '@/lib/webviewLinks';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

const WEBVIEW_INJECTED_SCRIPT = `${WEBVIEW_EMBED_STYLE_SCRIPT}\n${WEBVIEW_LINK_INTERCEPT_SCRIPT}`;

type BackHandlerFn = () => boolean;

let activeBackHandler: BackHandlerFn | null = null;

export function consumeEmbeddedWebViewBack(): boolean {
  return activeBackHandler?.() ?? false;
}

type EmbeddedWebViewProps = {
  url: string;
  enableGeolocation?: boolean;
};

export default function EmbeddedWebView({ url, enableGeolocation = false }: EmbeddedWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const canGoBackRef = useRef(false);
  const hasFinishedDocumentLoad = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    hasFinishedDocumentLoad.current = false;
    setError(false);
    setLoading(true);
  }, [url]);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 12000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!enableGeolocation) return;
    Location.requestForegroundPermissionsAsync().catch(() => {});
  }, [enableGeolocation]);

  useFocusEffect(
    useCallback(() => {
      const handler = () => {
        if (!canGoBackRef.current || !webViewRef.current) return false;
        webViewRef.current.goBack();
        return true;
      };
      activeBackHandler = handler;
      return () => {
        if (activeBackHandler === handler) activeBackHandler = null;
      };
    }, []),
  );

  const handleExternalLink = useCallback(async (requestUrl: string) => {
    if (!isExternalAppUrl(requestUrl)) return false;
    await openExternalUrl(requestUrl);
    return true;
  }, []);

  const handleShouldStartLoad = useCallback(
    (request: { url: string }) => {
      if (request.url === 'about:blank') return true;
      if (isExternalAppUrl(request.url)) {
        void handleExternalLink(request.url);
        setLoading(false);
        return false;
      }
      return true;
    },
    [handleExternalLink],
  );

  const handleNavigationChange = useCallback(
    (navState: WebViewNavigation) => {
      canGoBackRef.current = navState.canGoBack;
      if (!navState.loading) {
        hasFinishedDocumentLoad.current = true;
        setLoading(false);
      }
      if (isExternalAppUrl(navState.url)) {
        void handleExternalLink(navState.url);
        webViewRef.current?.stopLoading();
        setLoading(false);
      }
    },
    [handleExternalLink],
  );

  const handleWebViewMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as { type?: string; url?: string };
        if (data.type === 'external' && data.url) {
          void handleExternalLink(data.url);
        }
      } catch {
        if (isExternalAppUrl(event.nativeEvent.data)) {
          void handleExternalLink(event.nativeEvent.data);
        }
      }
    },
    [handleExternalLink],
  );

  const retry = () => {
    canGoBackRef.current = false;
    hasFinishedDocumentLoad.current = false;
    setError(false);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Failed to load page</Text>
          <Pressable style={styles.retryBtn} onPress={retry}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          key={reloadKey}
          ref={webViewRef}
          source={{ uri: url }}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          geolocationEnabled={enableGeolocation}
          allowFileAccess
          setSupportMultipleWindows={false}
          injectedJavaScript={WEBVIEW_INJECTED_SCRIPT}
          injectedJavaScriptBeforeContentLoaded={WEBVIEW_EMBED_STYLE_SCRIPT}
          onMessage={handleWebViewMessage}
          onLoadStart={() => {
            if (!hasFinishedDocumentLoad.current) setLoading(true);
          }}
          onLoadEnd={() => {
            hasFinishedDocumentLoad.current = true;
            setLoading(false);
          }}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress >= 1) setLoading(false);
          }}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState
          style={styles.webview}
          {...(Platform.OS === 'android' ? { nestedScrollEnabled: true } : {})}
        />
      )}
      {loading && !error ? (
        <View style={styles.loader} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  webview: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { fontSize: 16, color: colors.gray700, marginBottom: 16 },
  retryBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: colors.white, fontWeight: '600' },
});

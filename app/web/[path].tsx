import { colors } from '@/lib/theme';
import {
  openExternalUrl,
  WEBVIEW_EMBED_STYLE_SCRIPT,
  WEBVIEW_LINK_INTERCEPT_SCRIPT,
  isExternalAppUrl,
} from '@/lib/webviewLinks';
import { getWebUrl } from '@/lib/webRoutes';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';

const WEBVIEW_INJECTED_SCRIPT = `${WEBVIEW_EMBED_STYLE_SCRIPT}\n${WEBVIEW_LINK_INTERCEPT_SCRIPT}`;

export default function WebViewScreen() {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const params = useLocalSearchParams<{ path?: string; title?: string }>();
  const path = params.path ?? '/';
  const title = params.title ?? 'Care2Home';
  const url = getWebUrl(path);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        return false;
      }
      return true;
    },
    [handleExternalLink],
  );

  const handleNavigationChange = useCallback(
    (navState: WebViewNavigation) => {
      if (isExternalAppUrl(navState.url)) {
        void handleExternalLink(navState.url);
        webViewRef.current?.stopLoading();
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

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title,
          headerStyle: { backgroundColor: colors.headerBlue },
          headerTintColor: colors.white,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Failed to load page</Text>
            <Pressable style={styles.retryBtn} onPress={() => setError(false)}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            setSupportMultipleWindows={false}
            injectedJavaScript={WEBVIEW_INJECTED_SCRIPT}
            injectedJavaScriptBeforeContentLoaded={WEBVIEW_EMBED_STYLE_SCRIPT}
            onMessage={handleWebViewMessage}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
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
      </SafeAreaView>
    </>
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
  backBtn: { marginLeft: 8, padding: 4 },
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

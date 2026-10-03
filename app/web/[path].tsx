import EmbeddedWebView from '@/components/EmbeddedWebView';
import { colors } from '@/lib/theme';
import { getWebUrl } from '@/lib/webRoutes';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WebViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ path?: string; title?: string }>();
  const path = params.path ?? '/';
  const title = params.title ?? 'Care2Home';
  const url = getWebUrl(path);

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
        <EmbeddedWebView url={url} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  backBtn: { marginLeft: 8, padding: 4 },
});

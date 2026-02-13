import { AuthContext } from "@/auth/AuthContext";
import { Redirect, Stack, useSegments } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AuthGate() {
  const auth = useContext(AuthContext);
  const segments = useSegments();

  // Check for null context to avoid accessing properties on null
  const loading = auth?.loading ?? true;
  const user = auth?.user ?? null;

  // 1️⃣ Wait for Firebase
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2️⃣ Not logged in → go to login (only redirect if not already on auth route)
  if (!user) {
    // Check if we're already on an auth route to prevent redirect loops
    if (segments[0] !== '(auth)') {
      return <Redirect href="/(auth)/login" />;
    }
  }

  // 3️⃣ Logged in but on auth route → redirect to home
  if (user && segments[0] === '(auth)') {
    return <Redirect href="/(drawer)/(tabs)" />;
  }

  // 4️⃣ Render the main app stack (includes both auth and drawer routes)
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#364153"
        },
        headerTintColor: "white",
        animation: 'simple_push',
        headerBackVisible: true,
      }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="+not-found" options={{ headerTitle: "Not found", headerTintColor: "green" }} /> */}
      {/* <Stack.Screen name="profile" options={{ headerTitle: "Profile", animation: 'slide_from_left', headerBackButtonMenuEnabled: false }} /> */}
    </Stack>
  );
}

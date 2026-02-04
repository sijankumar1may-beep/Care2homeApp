import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return <>
    <StatusBar
        style="light"
        translucent={false}
        backgroundColor="#000" // IMPORTANT
      />
    <Stack 
    screenOptions={
      {
        headerStyle: {
          backgroundColor: "#364153"
        },
        headerTintColor: "white",
        animation: 'simple_push',
        headerBackVisible:true,

       
      }
    }>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerTitle: "Not found", headerTintColor: "green" }} />
      <Stack.Screen name="profile" options={{ headerTitle: "Profile", animation:'slide_from_left', headerBackButtonMenuEnabled:false }} />
    </Stack>
    
  </>;
}

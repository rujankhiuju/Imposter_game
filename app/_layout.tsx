import React from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/useTheme';
import { preloadSounds } from '../hooks/useSound';

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { mode } = useTheme();

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ presentation: 'card' }} />
        <Stack.Screen name="setup/player-names" options={{ presentation: 'card' }} />
        <Stack.Screen name="setup/settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="setup/categories" options={{ presentation: 'card' }} />
        <Stack.Screen name="reveal/card" options={{ presentation: 'card' }} />
        <Stack.Screen name="reveal/handoff" options={{ presentation: 'card' }} />
        <Stack.Screen name="discussion/timer" options={{ presentation: 'card' }} />
        <Stack.Screen name="voting/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="results/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="manage/categories" options={{ presentation: 'card' }} />
        <Stack.Screen name="manage/words" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    ArchivoBlack_400Regular,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      preloadSounds();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootStack />
    </GestureHandlerRootView>
  );
}

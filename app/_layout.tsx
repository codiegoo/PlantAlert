// app/_layout.tsx
import { ColorSchemeProvider, useAppColorScheme } from '@/context/ColorSchemeContext';
import { initNotifications } from '@/lib/notifications';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

function InnerRootLayout() {
  const { scheme } = useAppColorScheme();
  const navTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    initNotifications();
  }, []);

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="plant/[id]" />
        <Stack.Screen name="plant/new" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ColorSchemeProvider>
      <InnerRootLayout />
    </ColorSchemeProvider>
  );
}

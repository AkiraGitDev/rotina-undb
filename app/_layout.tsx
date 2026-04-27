import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useStoresHydrated } from '@/lib/store/hydration';

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.pitchBlack,
    card: Colors.pitchBlack,
    text: Colors.text.primary,
    border: Colors.border.subtle,
    primary: Colors.racingRed,
  },
};

export default function RootLayout() {
  const hydrated = useStoresHydrated();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={AppTheme}>
        {hydrated ? (
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.pitchBlack } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(colaborador)" />
          </Stack>
        ) : (
          <View style={{ flex: 1, backgroundColor: Colors.pitchBlack, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={Colors.racingRed} />
          </View>
        )}
        <StatusBar style="light" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { RoutineProvider } from './context/RoutineContext';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';

function ThemedApp() {
  const { isHydrated, mode, paperTheme, navigationTheme } = useAppTheme();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <RoutineProvider>
          <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
          <RootNavigator />
        </RoutineProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

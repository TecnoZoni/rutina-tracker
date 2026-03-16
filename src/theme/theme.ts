import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export type AppColorMode = 'light' | 'dark';

export function buildPaperTheme(mode: AppColorMode): MD3Theme {
  const base = mode === 'dark' ? MD3DarkTheme : MD3LightTheme;

  if (mode === 'dark') {
    return {
      ...base,
      roundness: 8,
      colors: {
        ...base.colors,
        primary: '#93C5FD',
        onPrimary: '#0B1220',
        primaryContainer: '#1E3A8A',
        onPrimaryContainer: '#DBEAFE',
        secondary: '#67E8F9',
        onSecondary: '#042F2E',
        secondaryContainer: '#155E75',
        onSecondaryContainer: '#ECFEFF',
        background: '#0B1220',
        surface: '#0F172A',
        surfaceVariant: '#1E293B',
        onSurface: '#E2E8F0',
        onSurfaceVariant: '#CBD5E1',
        outline: '#334155',
        outlineVariant: '#1E293B',
      },
    };
  }

  return {
    ...base,
    roundness: 8,
    colors: {
      ...base.colors,
      primary: '#2563EB',
      onPrimary: '#FFFFFF',
      primaryContainer: '#DBEAFE',
      onPrimaryContainer: '#1E3A8A',
      secondary: '#0891B2',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#CFFAFE',
      onSecondaryContainer: '#164E63',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceVariant: '#E2E8F0',
      onSurface: '#0F172A',
      onSurfaceVariant: '#334155',
      outline: '#CBD5E1',
      outlineVariant: '#E2E8F0',
    },
  };
}

export function buildNavigationTheme(mode: AppColorMode, paperTheme: MD3Theme) {
  const base = mode === 'dark' ? NavDarkTheme : NavDefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outline,
      notification: paperTheme.colors.error,
    },
  };
}

import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { Platform } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export type AppColorMode = 'light' | 'dark';

const serifFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) ?? 'serif';
const sansFont = Platform.select({ ios: 'Avenir Next', android: 'sans-serif', default: 'sans-serif' }) ?? 'sans-serif';

const withFontFamily = (font: MD3Theme['fonts'][keyof MD3Theme['fonts']], fontFamily: string) => ({
  ...font,
  fontFamily,
});

function buildFonts(baseFonts: MD3Theme['fonts']): MD3Theme['fonts'] {
  return {
    ...baseFonts,
    displayLarge: withFontFamily(baseFonts.displayLarge, serifFont),
    displayMedium: withFontFamily(baseFonts.displayMedium, serifFont),
    displaySmall: withFontFamily(baseFonts.displaySmall, serifFont),
    headlineLarge: withFontFamily(baseFonts.headlineLarge, serifFont),
    headlineMedium: withFontFamily(baseFonts.headlineMedium, serifFont),
    headlineSmall: withFontFamily(baseFonts.headlineSmall, serifFont),
    titleLarge: withFontFamily(baseFonts.titleLarge, serifFont),
    titleMedium: withFontFamily(baseFonts.titleMedium, serifFont),
    titleSmall: withFontFamily(baseFonts.titleSmall, serifFont),
    bodyLarge: withFontFamily(baseFonts.bodyLarge, sansFont),
    bodyMedium: withFontFamily(baseFonts.bodyMedium, sansFont),
    bodySmall: withFontFamily(baseFonts.bodySmall, sansFont),
    labelLarge: withFontFamily(baseFonts.labelLarge, sansFont),
    labelMedium: withFontFamily(baseFonts.labelMedium, sansFont),
    labelSmall: withFontFamily(baseFonts.labelSmall, sansFont),
  };
}

export function buildPaperTheme(mode: AppColorMode): MD3Theme {
  const base = mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const fonts = buildFonts(base.fonts);

  if (mode === 'dark') {
    return {
      ...base,
      roundness: 14,
      fonts,
      colors: {
        ...base.colors,
        primary: '#8FB2E3',
        onPrimary: '#0B1220',
        primaryContainer: '#24406A',
        onPrimaryContainer: '#DCE6F5',
        secondary: '#7CC7B5',
        onSecondary: '#08261F',
        secondaryContainer: '#1F4D43',
        onSecondaryContainer: '#D6EEE7',
        tertiary: '#E2A36D',
        onTertiary: '#2A1606',
        tertiaryContainer: '#5B3A1E',
        onTertiaryContainer: '#F5E2D3',
        background: '#0F1412',
        surface: '#151B17',
        surfaceVariant: '#222A24',
        onSurface: '#E4E8E2',
        onSurfaceVariant: '#BFC6BE',
        outline: '#354038',
        outlineVariant: '#1F2722',
      },
    };
  }

  return {
    ...base,
    roundness: 14,
    fonts,
    colors: {
      ...base.colors,
      primary: '#1F4B8F',
      onPrimary: '#FFFFFF',
      primaryContainer: '#DCE6F5',
      onPrimaryContainer: '#122A52',
      secondary: '#2F6F61',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#D6EEE7',
      onSecondaryContainer: '#113F36',
      tertiary: '#B86A2B',
      onTertiary: '#FFFFFF',
      tertiaryContainer: '#F5E2D3',
      onTertiaryContainer: '#5B3214',
      background: '#F2EDE3',
      surface: '#F9F5EE',
      surfaceVariant: '#E9E0D2',
      onSurface: '#2A241B',
      onSurfaceVariant: '#5A5144',
      outline: '#D8CFC1',
      outlineVariant: '#E3D8C7',
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

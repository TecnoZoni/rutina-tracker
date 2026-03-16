import * as React from 'react';
import { useColorScheme } from 'react-native';
import { loadJson, saveJson } from '../storage/storage';
import { buildNavigationTheme, buildPaperTheme, type AppColorMode } from '../theme/theme';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  isHydrated: boolean;
  preference: ThemePreference;
  mode: AppColorMode;
  setPreference: (pref: ThemePreference) => void;
  paperTheme: ReturnType<typeof buildPaperTheme>;
  navigationTheme: ReturnType<typeof buildNavigationTheme>;
};

const THEME_KEY = 'rutina_theme_pref_v1';

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = React.useState<ThemePreference>('system');
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    void (async () => {
      const stored = await loadJson<unknown>(THEME_KEY, 'system');
      if (!isMounted) return;
      setPreferenceState(isThemePreference(stored) ? stored : 'system');
      setIsHydrated(true);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = React.useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    void saveJson(THEME_KEY, pref);
  }, []);

  const mode: AppColorMode =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const paperTheme = React.useMemo(() => buildPaperTheme(mode), [mode]);
  const navigationTheme = React.useMemo(
    () => buildNavigationTheme(mode, paperTheme),
    [mode, paperTheme],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ isHydrated, preference, mode, setPreference, paperTheme, navigationTheme }),
    [isHydrated, preference, mode, setPreference, paperTheme, navigationTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = React.useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme must be used within ThemeProvider');
  return value;
}

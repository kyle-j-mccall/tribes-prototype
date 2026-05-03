import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { tokens, type Theme } from './tokens';

export type ThemeMode = 'dark' | 'light';

type ThemeContextValue = Theme & { mode: 'dark' };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Light mode is deferred for V1 — the prop is wired but always resolves to dark.
   */
  mode?: ThemeMode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => ({ ...tokens, mode: 'dark' }), []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return value;
}

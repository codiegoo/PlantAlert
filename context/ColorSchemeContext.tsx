// context/ColorSchemeContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

export type ColorScheme = 'light' | 'dark';

type Ctx = {
  scheme: ColorScheme;
  toggleScheme: () => void;
};

const ColorSchemeContext = createContext<Ctx>({
  scheme: 'dark',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleScheme: () => {},
});

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const system = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  const [scheme, setScheme] = useState<ColorScheme>(system);

  const value = useMemo(
    () => ({
      scheme,
      toggleScheme: () => setScheme(prev => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [scheme]
  );

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useAppColorScheme() {
  return useContext(ColorSchemeContext);
}

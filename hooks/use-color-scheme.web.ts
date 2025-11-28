// hooks/use-color-scheme.web.ts
import { useAppColorScheme } from '@/context/ColorSchemeContext';

export function useColorScheme() {
  const { scheme } = useAppColorScheme();
  return scheme;
}

// hooks/use-theme-color.ts
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeProps = { light?: string; dark?: string };

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps && colorFromProps.startsWith('#')) {
    return colorFromProps;
  }

  // En cualquier otro caso, usa el color del theme
  return Colors[theme][colorName];
}

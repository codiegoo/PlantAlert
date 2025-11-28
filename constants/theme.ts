// constants/theme.ts
import { Platform } from 'react-native';

// Verde principal (acciones, progreso, etc.)
const primaryGreen = '#22C55E';   // tailwind green-500

export const Colors = {
  light: {
    // Fondo general
    background: '#efefefff',   // gray-100

    // Tarjetas / cards / inputs
    card: '#FFFFFF',

    // Texto
    text: '#020617',         // slate-950
    subtleText: '#6B7280',   // gray-500

    // Iconos y elementos activos
    tint: primaryGreen,      // para elementos activos / pestaña activa
    icon: '#0F172A',         // slate-900

    // Barras de progreso
    progressBg: '#E5E7EB',   // gray-200
    progressFill: primaryGreen,

    // Bottom navigation bar (flotante)
    bottomBar: '#0F172A',    // navy oscuro para contrastar con fondo claro

    // Botones principales
    primary: primaryGreen,
    onPrimary: '#FFFFFF',

    // Acentos secundarios (links, botón "Google", etc.)
    accent: '#38BDF8',       // sky-400
    accentText: '#0F172A',

    // Estados de error / eliminar
    danger: '#F97373',       // rojo suave
  },

  dark: {
    // Fondo general
    background: '#020617',   // slate-950 (muy oscuro, casi negro pero con tinte azul)

    // Tarjetas claramente diferenciadas
    card: '#0F172A',         // slate-900 (#020617) se nota sobre el fondo

    // Texto
    text: '#E5E7EB',         // gray-200
    subtleText: '#9CA3AF',   // gray-400

    // Iconos y elementos activos
    tint: primaryGreen,
    icon: '#E5E7EB',

    // Barras de progreso
    progressBg: '#1F2937',   // gray-800
    progressFill: primaryGreen,

    // Bottom navigation bar algo más clara que el fondo
    bottomBar: '#020617',    // slate-900

    // Botones principales
    primary: primaryGreen,
    onPrimary: '#0B1120',    // azul muy oscuro: hace contraste pero no quema

    // Acentos secundarios
    accent: '#38BDF8',       // sky-400
    accentText: '#E5E7EB',

    // Error / eliminar
    danger: '#FB7185',       // rose-400
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

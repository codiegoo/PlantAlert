// components/BottomNavBar.tsx
import { useAppColorScheme } from '@/context/ColorSchemeContext';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { scheme, toggleScheme } = useAppColorScheme();

  // 🎨 Colores manuales según modo (lo que tú pediste)
  const isDark = scheme === 'dark';

  const backgroundColor = isDark ? '#0e172cff' : '#ffffff'; // dark→blanca, light→oscura
  const mainIconColor = isDark ? '#22C55E' : '#FFFFFF';       // dark→verde, light→blanco
  const inactiveIconColor = isDark ? '#22C55E' : '#0e172cff'; // para textos inactivos
  const addButtonBg = '#22C55E';
  const addButtonIcon = '#FFFFFF';

  // Pantalla activa
  const isPlants = pathname === '/(tabs)' || pathname === '/';

  return (
    <View style={[styles.container, { backgroundColor }]}>

      {/* Mis plantas */}
      <Pressable style={styles.item} onPress={() => router.push('/(tabs)')}>
        <View style={[styles.bubble, { backgroundColor: addButtonBg }]}>
          <Ionicons
            name="leaf-outline"
            size={22}
            color={addButtonIcon} // icono blanco dentro de rueda verde
          />
        </View>
      </Pressable>

      {/* Botón verde de agregar */}
      <Pressable
        style={[styles.addWrapper, { backgroundColor: addButtonBg }]}
        onPress={() => router.push('/plant/new')}
      >
        <Ionicons name="add" size={24} color={addButtonIcon} />
      </Pressable>

      {/* Toggle modo */}
      <Pressable style={styles.item} onPress={toggleScheme}>
        <View style={[styles.bubble, { backgroundColor: addButtonBg }]}>
          <Ionicons
            name={scheme === 'dark' ? 'moon' : 'sunny'}
            size={22}
            color={addButtonIcon}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 60,
    right: 60,
    bottom: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 👉 centra el del medio y manda los otros a las orillas

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
  // rueda redonda para Mis plantas y Oscuro/Claro
  bubble: {
    width: 36,
    height: 36,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // botón central (ya lo tenías)
  addWrapper: {
    width: 36,
    height: 36,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

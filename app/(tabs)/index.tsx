// app/(tabs)/index.tsx
import { BottomNavBar } from '@/components/BottomNavBar';
import { PlantCard } from '@/components/PlantCard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { initDb } from '@/lib/db';
import { getAllPlants, Plant } from '@/lib/plantRepository';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlantListScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const bgColor = useThemeColor({ light: 'background', dark: 'background' }, 'background');
  const textColor = useThemeColor({ light: 'text', dark: 'text' }, 'text');
  const subtleTextColor = useThemeColor({ light: 'subtleText', dark: 'subtleText' }, 'subtleText');
  const cardColor = useThemeColor({ light: 'card', dark: 'card' }, 'card');
  const iconColor = useThemeColor({ light: 'icon', dark: 'icon' }, 'icon');
  async function loadPlants() {
    const data = await getAllPlants();
    setPlants(data);
  }

  useEffect(() => {
    (async () => {
      await initDb();
      await loadPlants();
    })();
  }, []);

  // Recargar cada vez que vuelves a esta pantalla
  useFocusEffect(
    useCallback(() => {
      loadPlants();
    }, [])
  );

  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: bgColor }]}
    >
      <View style={styles.container}>
        <View className="headerRow" style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: textColor }]}>
              Mis plantas
            </Text>
            <Text style={[styles.subtitle, { color: subtleTextColor }]}>
              Revisa tus riegos y próximas tareas
            </Text>
          </View>

          <View
            style={[
              styles.iconCircle,
              { backgroundColor: cardColor },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={iconColor}
            />
          </View>

          <View
            style={[
              styles.iconCircle,
              { backgroundColor: '#22c55e' }, // tu acento verde
            ]}
          >
            <Ionicons
              name="add"
              size={22}
              color="#FFFFFF"
              onPress={() => router.push('/plant/new')}
            />
          </View>
        </View>

        {/* Búsqueda */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: cardColor },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={subtleTextColor}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Buscar planta..."
            placeholderTextColor={subtleTextColor}
            style={[styles.searchInput, { color: textColor }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Lista */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              onPress={() => router.push(`/plant/${item.id}`)}
            />
          )}
        />
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
});

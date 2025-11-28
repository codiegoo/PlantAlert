// app/plant/[id].tsx
import { BottomNavBar } from '@/components/BottomNavBar';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getWaterProgress } from '@/lib/dateUtils';
import { scheduleWaterNotification } from '@/lib/notifications';
import {
  deletePlant,
  getPlantById,
  markWateredNow,
  Plant,
} from '@/lib/plantRepository';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const router = useRouter();

  // 🎨 Colores desde el hook
  const bgColor = useThemeColor(
    { light: 'background', dark: 'background' },
    'background'
  );
  const textColor = useThemeColor(
    { light: 'text', dark: 'text' },
    'text'
  );
  const subtleTextColor = useThemeColor(
    { light: 'subtleText', dark: 'subtleText' },
    'subtleText'
  );

  const progressBgColor = useThemeColor(
    { light: 'progressBg', dark: 'progressBg' },
    'progressBg'
  );
  const progressFillColor = useThemeColor(
    { light: 'progressFill', dark: 'progressFill' },
    'progressFill'
  );

  const primaryButtonBg = useThemeColor(
    { light: 'primary', dark: 'primary' },
    'primary'
  );
  const primaryButtonTextColor = useThemeColor(
    { light: 'onPrimary', dark: 'onPrimary' },
    'onPrimary'
  );

  const secondaryBorderColor = useThemeColor(
    { light: 'accent', dark: 'accent' },
    'accent'
  );
  const secondaryTextColor = useThemeColor(
    { light: 'accentText', dark: 'accentText' },
    'accentText'
  );

  const deleteTextColor = useThemeColor(
    { light: 'danger', dark: 'danger' },
    'danger'
  );

  async function load() {
    if (!id) return;
    const p = await getPlantById(Number(id));
    setPlant(p);
  }

  useEffect(() => {
    load();
  }, [id]);

  if (!plant) return null;

  const progress = getWaterProgress(
    plant.lastWateredAt,
    plant.waterEveryDays
  );
  const percent = Math.round(progress * 100);

  const handleWater = async () => {
    if (!plant) return;

    const nowIso = new Date().toISOString();

    await markWateredNow(plant.id);

    await scheduleWaterNotification({
      name: plant.name,
      waterEveryDays: plant.waterEveryDays,
      lastWateredAt: nowIso,
    });

    await load();
  };

  const handleDelete = async () => {
    await deletePlant(plant.id);
    router.back();
  };

  const openGoogle = () => {
    const query = encodeURIComponent(
      `${plant.name} cuidados y recomendaciones`
    );
    Linking.openURL(`https://www.google.com/search?q=${query}`);
  };

  const handleEdit = () => {
    router.push({
      pathname: '/plant/new',
      params: { id: plant.id.toString() },
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {plant.photoUri && (
            <Image source={{ uri: plant.photoUri }} style={styles.photo} />
          )}

          {/* Nombre + botón editar */}
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: textColor }]}>
              {plant.name}
            </Text>
            <Pressable style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="pencil" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={[styles.subtitle, { color: subtleTextColor }]}>
            Riego cada {plant.waterEveryDays} días
          </Text>

          <View
            style={[
              styles.progressBg,
              { backgroundColor: progressBgColor },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${percent}%`,
                  backgroundColor: progressFillColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.percent, { color: subtleTextColor }]}>
            {percent}% del ciclo de riego
          </Text>

          <Pressable
            style={[styles.primaryButton, { backgroundColor: primaryButtonBg }]}
            onPress={handleWater}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { color: primaryButtonTextColor },
              ]}
            >
              Marcar como regada
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.secondaryButton,
              { borderColor: secondaryBorderColor },
            ]}
            onPress={openGoogle}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: secondaryTextColor },
              ]}
            >
              Ver cuidados y recomendaciones en Google
            </Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text
              style={[styles.deleteButtonText, { color: deleteTextColor }]}
            >
              Eliminar planta
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120, // deja espacio para el BottomNavBar
  },
  container: {
    flexGrow: 1,
  },
  photo: {
    width: '100%',
    height: 230,
    borderRadius: 26,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    flex: 1,
  },
  editButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  progressBg: {
    height: 8,
    borderRadius: 999,
    marginTop: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  percent: {
    fontSize: 12,
    marginBottom: 18,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  deleteButton: {
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
  },
});

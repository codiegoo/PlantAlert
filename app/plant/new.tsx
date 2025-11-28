// app/plant/new.tsx
import { BottomNavBar } from '@/components/BottomNavBar';
import { Colors } from '@/constants/theme';
import { useAppColorScheme } from '@/context/ColorSchemeContext';
import { scheduleWaterNotification } from '@/lib/notifications';
import {
  createPlant,
  getPlantById,
  updatePlant,
} from '@/lib/plantRepository';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewPlantScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [days, setDays] = useState('3');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const router = useRouter();
  const { scheme } = useAppColorScheme();
  const theme = Colors[scheme];

  // Cargar planta existente si es edición
  useEffect(() => {
    async function loadPlant() {
      if (!id) return;
      const p = await getPlantById(Number(id));
      if (p) {
        setName(p.name);
        setDays(p.waterEveryDays.toString());
        setPhotoUri(p.photoUri); // conserva la foto existente
      }
    }
    loadPlant();
  }, [id]);

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Activa el acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      // Solo cambia si toma una nueva foto
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const every = Number(days) || 3;

    if (!name.trim()) {
      Alert.alert('Nombre requerido', 'Escribe un nombre para la planta');
      return;
    }

    const trimmedName = name.trim();
    const lastWateredAt = new Date().toISOString();

    if (isEditing) {
      // Actualizar planta existente
      await updatePlant({
        id: Number(id),
        name: trimmedName,
        photoUri,
        waterEveryDays: every,
        lastWateredAt,
        notes: null,
      });
    } else {
      // Crear nueva planta
      await createPlant({
        name: trimmedName,
        photoUri,
        waterEveryDays: every,
        lastWateredAt,
        notes: null,
      });
    }

    // En ambos casos (crear o editar) programamos la notificación
    await scheduleWaterNotification({
      name: trimmedName,
      lastWateredAt,
      waterEveryDays: every,
    });

    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>
          {isEditing ? 'Editar planta' : 'Nueva planta'}
        </Text>

        <Pressable
          style={[styles.photoBox, { borderColor: theme.progressBg }]}
          onPress={pickImageFromCamera}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <Text
              style={[
                styles.photoPlaceholder,
                { color: theme.subtleText },
              ]}
            >
              Toca para tomar foto
            </Text>
          )}
        </Pressable>

        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.progressBg,
              backgroundColor: theme.card,
              color: theme.text,
            },
          ]}
          placeholder="Nombre de la planta"
          placeholderTextColor={theme.subtleText}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.progressBg,
              backgroundColor: theme.card,
              color: theme.text,
            },
          ]}
          placeholder="Días entre riegos (ej. 3)"
          placeholderTextColor={theme.subtleText}
          keyboardType="numeric"
          value={days}
          onChangeText={setDays}
        />

        <Pressable style={styles.buttonPrimary} onPress={handleSave}>
          <Text style={styles.buttonPrimaryText}>
            {isEditing ? 'Guardar cambios' : 'Guardar'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.buttonSecondary}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.buttonSecondaryText,
              { color: theme.subtleText },
            ]}
          >
            Cancelar
          </Text>
        </Pressable>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  photoBox: {
    height: 210,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { fontSize: 14 },
  input: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  buttonPrimary: {
    backgroundColor: '#22C55E',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonSecondary: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  buttonSecondaryText: {
    fontWeight: '500',
    fontSize: 14,
  },
});

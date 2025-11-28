// components/PlantCard.tsx
import { useThemeColor } from '@/hooks/use-theme-color';
import { getWaterProgress } from '@/lib/dateUtils';
import { Plant } from '@/lib/plantRepository';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  plant: Plant;
  onPress: () => void;
};

export function PlantCard({ plant, onPress }: Props) {
  const cardBg = useThemeColor({ light: 'card', dark: 'card' }, 'card');
  const textColor = useThemeColor({ light: 'text', dark: 'text' }, 'text');
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

  const progress = getWaterProgress(plant.lastWateredAt, plant.waterEveryDays);
  const percent = Math.round(progress * 100);

  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        {plant.photoUri && (
          <Image source={{ uri: plant.photoUri }} style={styles.photo} />
        )}

        <View style={styles.info}>
          <Text style={[styles.name, { color: textColor }]}>{plant.name}</Text>
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
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  card: {
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 68,
    height: 68,
    borderRadius: 20,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  progressBg: {
    height: 6,
    borderRadius: 999,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  percent: {
    marginTop: 4,
    fontSize: 11,
  },
});

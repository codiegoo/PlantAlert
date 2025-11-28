// lib/notifications.ts
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type PlantForNotification = {
  name: string;
  lastWateredAt: string;
  waterEveryDays: number;
};

// Handler para cómo se muestran las notificaciones en foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ------------------ INIT (llamar una sola vez al arrancar la app) ------------------

async function ensurePermissions() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.log('[notifications] Permisos NO otorgados');
    }
  }
}

async function configureAndroidChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('watering-reminders', {
    name: 'Recordatorios de riego',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function initNotifications() {
  await ensurePermissions();
  await configureAndroidChannel();
}

// ------------------ PROGRAMAR NOTIFICACIÓN 100% DEL CICLO ------------------
export async function scheduleWaterNotification(
  plant: PlantForNotification
) {
  const nextWaterDate = dayjs(plant.lastWateredAt)
    .add(plant.waterEveryDays, 'day')
    .toDate();

  const trigger: Notifications.NotificationTriggerInput =
    nextWaterDate.getTime() <= Date.now()
      ? null
      : {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: nextWaterDate,
        };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de riego',
      body: `Tu planta ${plant.name} necesita ser regada ahora mismo!`,
      sound: 'default',
    },
    trigger,
  });
}

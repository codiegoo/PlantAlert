// lib/dateUtils.ts
import dayjs from 'dayjs';

export function getWaterProgress(
  lastWateredAt: string,
  waterEveryDays: number
): number {
  const last = dayjs(lastWateredAt);
  const now = dayjs();
  const diffDays = now.diff(last, 'day', true); // con decimales
  const ratio = diffDays / waterEveryDays;
  const clamped = Math.max(0, Math.min(1, ratio));
  return clamped;
}

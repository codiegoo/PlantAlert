// lib/plantRepository.ts
import dayjs from 'dayjs';
import { getDb } from './db';

export type Plant = {
  id: number;
  name: string;
  photoUri: string | null;
  waterEveryDays: number;
  lastWateredAt: string;
  notes: string | null;
};

export async function getAllPlants(): Promise<Plant[]> {
  const db = await getDb();
  return await db.getAllAsync<Plant>('SELECT * FROM plants ORDER BY id DESC');
}

export async function getPlantById(id: number): Promise<Plant | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Plant>('SELECT * FROM plants WHERE id = ?', [
    id,
  ]);
  return row ?? null;
}

export async function createPlant(data: Omit<Plant, 'id'>) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO plants (name, photoUri, waterEveryDays, lastWateredAt, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.photoUri, data.waterEveryDays, data.lastWateredAt, data.notes]
  );
}

// 🔹 NUEVA FUNCIÓN: actualizar planta existente
export async function updatePlant(data: Plant) {
  const db = await getDb();
  await db.runAsync(
    `UPDATE plants
       SET name = ?,
           photoUri = ?,
           waterEveryDays = ?,
           lastWateredAt = ?,
           notes = ?
     WHERE id = ?`,
    [
      data.name,
      data.photoUri,
      data.waterEveryDays,
      data.lastWateredAt,
      data.notes,
      data.id,
    ]
  );
}

export async function markWateredNow(id: number) {
  const db = await getDb();
  const now = dayjs().toISOString();
  await db.runAsync('UPDATE plants SET lastWateredAt = ? WHERE id = ?', [now, id]);
}

export async function deletePlant(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM plants WHERE id = ?', [id]);
}

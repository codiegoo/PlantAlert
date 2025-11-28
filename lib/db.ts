// lib/db.ts
import * as SQLite from "expo-sqlite";

let dbPromise: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = await SQLite.openDatabaseAsync("plants.db");
    await dbPromise.execAsync(`
      CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        photoUri TEXT,
        waterEveryDays INTEGER NOT NULL,
        lastWateredAt TEXT NOT NULL,
        notes TEXT
      );
    `);
  }
  return dbPromise;
}

export async function initDb() {
  await getDb();
}

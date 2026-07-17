// run history still just lives on the phone - backend doesn't have an


import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LatLng } from '../utils/geo';

const STORAGE_KEYS = {
  runs: '@iter/runs',
} as const;

export type { LatLng };

export interface RunRecord {
  id: string;
  ownerId: string;
  pathId: string | null;
  pathName: string;
  distanceMiles: number;
  durationSeconds: number;
  route: LatLng[];
  date: string; // ISO date
  targetPaceSeconds: number;
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}


function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    // bad json, just start fresh
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const mockApi = {
  async getRuns(ownerId: string): Promise<RunRecord[]> {
    await delay(250);
    const all = await readJson<RunRecord[]>(STORAGE_KEYS.runs, []);
    return all
      .filter((r) => r.ownerId === ownerId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async saveRun(ownerId: string, run: Omit<RunRecord, 'id' | 'ownerId'>): Promise<RunRecord> {
    await delay();
    const all = await readJson<RunRecord[]>(STORAGE_KEYS.runs, []);
    const record: RunRecord = { ...run, id: makeId(), ownerId };
    await writeJson(STORAGE_KEYS.runs, [...all, record]);
    return record;
  },
};

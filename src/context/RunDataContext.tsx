import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { runsApi, type LatLng, type RunRecord } from '../api/runsApi';
import { pathsApi, type SavedPath } from '../api/pathsApi';
import { useAuth } from './AuthContext';

export type { SavedPath };

interface RunDataContextValue {
  savedPaths: SavedPath[];
  runs: RunRecord[];
  isLoading: boolean;
  refresh: () => Promise<void>; // Added <void>
  addPath: (name: string, points: LatLng[]) => Promise<SavedPath>; // Added <SavedPath>
  deletePath: (id: string) => Promise<void>; // Added <void>
  // Updated Omit to reflect the new API format (removing MongoDB keys that the backend generates)
  addRun: (run: Omit<RunRecord, 'id' | '_id' | 'userId'>) => Promise<RunRecord>; // Added <RunRecord>
}

const RunDataContext = createContext<RunDataContextValue | undefined>(undefined);

export function RunDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedPaths, setSavedPaths] = useState<SavedPath[]>([]);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setSavedPaths([]);
      setRuns([]);
      return;
    }
    setIsLoading(true);
    try {
      const [paths, runHistory] = await Promise.all([
        pathsApi.getSavedPaths(),
        runsApi.getRuns(user.id), // Switched to the real runsApi
      ]);
      setSavedPaths(paths);
      setRuns(runHistory);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Reload whenever the logged-in user changes (login, logout, switching accounts).
  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPath = useCallback(
    async (name: string, points: LatLng[]) => {
      if (!user) throw new Error('Must be signed in to save a path');
      const path = await pathsApi.savePath(name, points);
      setSavedPaths((prev) => [path, ...prev]);
      return path;
    },
    [user],
  );

  const deletePath = useCallback(
    async (id: string) => {
      if (!user) throw new Error('Must be signed in to delete a path');
      await pathsApi.deletePath(id);
      setSavedPaths((prev) => prev.filter((p) => p.id !== id));
    },
    [user],
  );

  const addRun = useCallback(
    async (run: Omit<RunRecord, 'id' | '_id' | 'userId'>) => {
      if (!user) throw new Error('Must be signed in to save a run');
      const record = await runsApi.saveRun(user.id, run); // Switched to the real runsApi
      setRuns((prev) => [record, ...prev]);
      return record;
    },
    [user],
  );

  const value = useMemo(
    () => ({ savedPaths, runs, isLoading, refresh, addPath, deletePath, addRun }),
    [savedPaths, runs, isLoading, refresh, addPath, deletePath, addRun],
  );

  return <RunDataContext.Provider value={value}>{children}</RunDataContext.Provider>;
}

export function useRunData(): RunDataContextValue {
  const ctx = useContext(RunDataContext);
  if (!ctx) throw new Error('useRunData must be used inside a RunDataProvider');
  return ctx;
}
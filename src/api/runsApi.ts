// run history, backed by the real backend now instead of AsyncStorage.
// backend stores a run's GPS trace as [lng, lat] pairs under "waypoints",
// same convention pathsApi already uses for saved paths - see that file
// for the same conversion.

import { apiRequest } from './client';
import type { LatLng } from '../utils/geo';

export interface Run {
  id: string;
  pathId: string;
  pathName: string;
  distanceMiles: number;
  durationSeconds: number;
  targetPaceSeconds: number;
  trace: LatLng[];
  createdAt: string; // ISO date
}

interface RunResponse {
  _id: string;
  user: string;
  path: string;
  pathName: string;
  distanceMiles: number;
  durationSeconds: number;
  targetPaceSeconds: number;
  waypoints: [number, number][]; // [lng, lat]
  createdAt: string;
}

function fromRun(run: RunResponse): Run {
  return {
    id: run._id,
    pathId: run.path,
    pathName: run.pathName,
    distanceMiles: run.distanceMiles,
    durationSeconds: run.durationSeconds,
    targetPaceSeconds: run.targetPaceSeconds,
    trace: run.waypoints.map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
    createdAt: run.createdAt,
  };
}

export const runsApi = {
  async getRuns(): Promise<Run[]> {
    const runs = await apiRequest<RunResponse[]>('/api/runs/my-runs', { auth: true });
    return runs.map(fromRun);
  },

  async saveRun(run: Omit<Run, 'id' | 'createdAt'>): Promise<Run> {
    const result = await apiRequest<{ message: string; run: RunResponse }>('/api/runs/save', {
      method: 'POST',
      auth: true,
      body: {
        pathId: run.pathId,
        pathName: run.pathName,
        distanceMiles: run.distanceMiles,
        durationSeconds: run.durationSeconds,
        targetPaceSeconds: run.targetPaceSeconds,
        waypoints: run.trace.map((p) => [p.longitude, p.latitude]),
      },
    });
    return fromRun(result.run);
  },
};

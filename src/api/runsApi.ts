import type { LatLng } from '../utils/geo';

// Ensure this matches your backend URL. If testing on Android emulator, use 10.0.2.2 instead of localhost.
const API_BASE = "https://three-phones-report.loca.lt/api/runs"; 

export type { LatLng };

// This represents the data exactly as it comes back from MongoDB
export interface RunRecord {
  _id: string;          // RecordID (MongoDB uses _id)
  userId: string;       // Foreign Key 1
  routeId: string | null; // Foreign Key 2 (Renamed from pathId)
  pathName: string;
  distanceMiles: number;
  durationSeconds: number; // Time run
  route: LatLng[];      
  date: string;         // When it was run (ISO date string)
}

export const runsApi = {
  async getRuns(userId: string): Promise<RunRecord[]> {
    try {
      const response = await fetch(`${API_BASE}/loadRuns/${userId}`, {
        headers: { "Bypass-Tunnel-Reminder": "true" } // This header is needed for the localtunnel to work properly
      };
      if (!response.ok) throw new Error("Failed to fetch runs");
      
      const data = await response.json();
      
      // Map _id to id so the frontend components (like the calendar) don't break
      return data.runs.map((r: any) => ({
        ...r,
        id: r._id,
      }));
    } catch (error) {
      console.error("Error loading runs:", error);
      return [];
    }
  },

  async saveRun(userId: string, run: Omit<RunRecord, '_id' | 'userId' | 'id'>): Promise<RunRecord> {
    try {
      const payload = {
        userId,
        routeId: run.routeId,
        pathName: run.pathName,
        distanceMiles: run.distanceMiles,
        durationSeconds: run.durationSeconds,
        route: run.route,
        date: run.date
      };

      const response = await fetch(`${API_BASE}/saveRun`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to save run");

      const data = await response.json();
      const savedRun = data.run;

      return {
        ...savedRun,
        id: savedRun._id,
      };
    } catch (error) {
      console.error("Error saving run:", error);
      throw error;
    }
  },
};
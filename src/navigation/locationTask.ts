import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const LOCATION_TASK_NAME = 'background-run-location';
export const RUN_LOCATIONS_KEY = 'current-run-locations';

type StoredPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error('Background location task error:', error);
      return;
    }

    if (!data) return;

    try {
      const { locations } = data as {
        locations: Location.LocationObject[];
      };

      const storedJson =
        await AsyncStorage.getItem(RUN_LOCATIONS_KEY);

      const storedPoints: StoredPoint[] = storedJson
        ? JSON.parse(storedJson)
        : [];

      const newPoints: StoredPoint[] = locations.map(
        (location) => ({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp,
        }),
      );

      await AsyncStorage.setItem(
        RUN_LOCATIONS_KEY,
        JSON.stringify([...storedPoints, ...newPoints]),
      );
    } catch (error) {
      console.error(
        'Could not save background locations:',
        error,
      );
    }
  },
);
// Turns a handful of tapped points into a route that actually follows
// footpaths/sidewalks instead of cutting straight lines between them.
// Hits OSRM's public routing server with the walking profile - same OSM data
// and same demo server the web app uses, so no API key and no backend work.
// Worth noting this is OSRM's /route endpoint, not real map-matching - it's
// finding the shortest walkable path between our points in order, which
// looks like snapping but isn't tracing an existing GPS trace onto a road.

import type { LatLng } from '../utils/geo';

const OSRM_URL = 'https://router.project-osrm.org/route/v1/walking';

export interface WalkingRoute {
  geometry: LatLng[];
  distanceMiles: number;
}

export async function getWalkingRoute(points: LatLng[]): Promise<WalkingRoute> {
  if (points.length < 2) throw new Error('Need at least 2 points to route');

  // OSRM wants "lng,lat" pairs joined with semicolons - the reverse of our LatLng shape.
  const coordinates = points.map((p) => `${p.longitude},${p.latitude}`).join(';');

  let response: Response;
  try {
    response = await fetch(`${OSRM_URL}/${coordinates}?overview=full&geometries=geojson`);
  } catch {
    throw new Error('Could not reach the routing server');
  }

  if (!response.ok) throw new Error('OSRM request failed');

  const data = await response.json();

  // A tap out in the water or somewhere with no walkable path still comes
  // back as a 200 with code: "NoRoute" rather than an HTTP error.
  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('No walking route found between these points');
  }

  const route = data.routes[0];
  const geometry: LatLng[] = route.geometry.coordinates.map(
    ([longitude, latitude]: [number, number]) => ({ latitude, longitude }),
  );

  return { geometry, distanceMiles: route.distance / 1609.34 };
}

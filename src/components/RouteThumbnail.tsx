// Small map-ish preview of a route, built from real lat/lng points instead
// of a canned SVG path. Used in the saved paths list, start-run list, and
// the calendar's "run logged" card.
//
// It doesn't show an actual map (no tiles, no API key needed) - just
// projects the GPS points onto a little grid background so it reads as
// "a route on a map" at a glance.

import React from 'react';
import Svg, { Circle, Line, Polyline, Rect } from 'react-native-svg';
import type { LatLng } from '../utils/geo';

interface Props {
  points: LatLng[];
  width?: number;
  height?: number;
  color?: string;
}

const GRID_COLOR = '#C8C2B8';
const MAP_BG = '#D8D3CA';

export function RouteThumbnail({ points, width = 88, height = 72, color = '#D5A021' }: Props) {
  const projected = projectPoints(points, width, height);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Rect width={width} height={height} rx={10} fill={MAP_BG} />

      {/* Faint grid lines just to sell the "map" look */}
      <Line x1={0} y1={height * 0.25} x2={width} y2={height * 0.25} stroke={GRID_COLOR} strokeWidth={1.5} />
      <Line x1={0} y1={height * 0.5} x2={width} y2={height * 0.5} stroke={GRID_COLOR} strokeWidth={1.5} />
      <Line x1={0} y1={height * 0.75} x2={width} y2={height * 0.75} stroke={GRID_COLOR} strokeWidth={1.5} />
      <Line x1={width * 0.25} y1={0} x2={width * 0.25} y2={height} stroke={GRID_COLOR} strokeWidth={1.5} />
      <Line x1={width * 0.5} y1={0} x2={width * 0.5} y2={height} stroke={GRID_COLOR} strokeWidth={1.5} />
      <Line x1={width * 0.75} y1={0} x2={width * 0.75} y2={height} stroke={GRID_COLOR} strokeWidth={1.5} />

      {projected.length > 1 && (
        <Polyline
          points={projected.map((p) => `${p.x},${p.y}`).join(' ')}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}

      {projected.length > 0 && (
        <>
          <Circle cx={projected[0].x} cy={projected[0].y} r={4} fill={color} stroke="#fff" strokeWidth={1.5} />
          <Circle
            cx={projected[projected.length - 1].x}
            cy={projected[projected.length - 1].y}
            r={4}
            fill="#fff"
            stroke={color}
            strokeWidth={2}
          />
        </>
      )}
    </Svg>
  );
}

// Squashes the real lat/lng coordinates down into the little box we're
// drawing in, flipping latitude since north is "up" but SVG y grows downward.
function projectPoints(points: LatLng[], width: number, height: number) {
  if (points.length === 0) return [];

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Avoid divide-by-zero for a single-point "route"
  const latRange = maxLat - minLat || 0.0001;
  const lngRange = maxLng - minLng || 0.0001;

  const padding = 10;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  return points.map((p) => ({
    x: padding + ((p.longitude - minLng) / lngRange) * usableWidth,
    y: padding + (1 - (p.latitude - minLat) / latRange) * usableHeight,
  }));
}

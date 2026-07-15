// One file with every little icon the app uses. They're all just simple
// SVG paths (mostly lifted straight from the Figma export, which used inline
// SVG on the web) redrawn with react-native-svg. Didn't feel like pulling in
// a whole icon library for a couple dozen glyphs.

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = { size?: number; color?: string };

// The little mountain/flag mark used as the app's logo throughout.
export function LogoMark({ size = 20, color = '#D5A021' }: IconProps) {
  const height = size * 1.25;
  return (
    <Svg width={size} height={height} viewBox="0 0 32 40" fill="none">
      <Path d="M20 2L4 22H16L12 38L28 18H16L20 2Z" fill={color} />
    </Svg>
  );
}

export function BackArrowIcon({ size = 18, color = '#2A1F14' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 14, color = '#6E6458' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EmailIcon({ size = 16, color = '#9A9080' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
        fill={color}
      />
    </Svg>
  );
}

export function LockIcon({ size = 16, color = '#9A9080' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
        fill={color}
      />
    </Svg>
  );
}

export function UserIcon({ size = 16, color = '#9A9080' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
        fill={color}
      />
    </Svg>
  );
}

export function EyeIcon({ size = 18, color = '#9A9080', open }: IconProps & { open: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {open ? (
        <Path
          d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
          fill={color}
        />
      ) : (
        <Path
          d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8Z"
          fill={color}
        />
      )}
    </Svg>
  );
}

export function CheckIcon({ size = 14, color = '#D5A021' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17L4 12"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PlusIcon({ size = 16, color = '#1A1714' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function TrashIcon({ size = 18, color = '#2A1F14' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6H21M8 6V4H16V6M19 6L18.08 19.13C17.95 20.19 17.06 21 15.99 21H8.01C6.94 21 6.05 20.19 5.92 19.13L5 6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function UndoIcon({ size = 18, color = '#2A1F14' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 14L4 9L9 4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 9H14.5C17.537 9 20 11.462 20 14.5C20 17.537 17.537 20 14.5 20H11"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function LocateIcon({ size = 18, color = '#2A1F14' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3.5} fill="#D5A021" />
      <Path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={12} cy={12} r={7} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function SaveIcon({ size = 18, color = '#1A1714' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16L21 8V19C21 20.1 20.1 21 19 21Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M17 21V13H7V21M7 3V8H15" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TrophyIcon({ size = 18, color = '#D5A021' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
    </Svg>
  );
}

export function LogoutIcon({ size = 17, color = '#C0392B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M16 17L21 12L16 7M21 12H9" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function InfoIcon({ size = 22, color = '#9A9080' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Path d="M12 8V12M12 16H12.01" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function BellIcon({ size = 18, color = '#6E6458' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path
        d="M13.73 21C13.55 21.3 13.3 21.55 13 21.72C12.7 21.9 12.35 22 12 22C11.65 22 11.3 21.9 11 21.72C10.7 21.55 10.45 21.3 10.27 21"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function AboutIcon({ size = 18, color = '#6E6458' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 5H17L14.5 7.5L15.5 11L12 9L8.5 11L9.5 7.5L7 5H10.5L12 2Z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M5 20H19" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M12 13V20" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

// --- Tab bar icons - each one supports an "active" state that swaps the fill/stroke color ---

export function HomeTabIcon({ size = 22, active }: IconProps & { active: boolean }) {
  const color = active ? '#D5A021' : '#6E6458';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"
        fill={active ? color : 'none'}
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PathsTabIcon({ size = 22, active }: IconProps & { active: boolean }) {
  const color = active ? '#D5A021' : '#6E6458';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
        fill={active ? color : 'none'}
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CalendarTabIcon({ size = 22, active }: IconProps & { active: boolean }) {
  const color = active ? '#D5A021' : '#6E6458';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 4H18C19.66 4 21 5.34 21 7V19C21 20.66 19.66 22 18 22H6C4.34 22 3 20.66 3 19V7C3 5.34 4.34 4 6 4Z"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path d="M3 9H21" stroke={color} strokeWidth={1.6} />
      <Path d="M8 2V5M16 2V5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function ProfileTabIcon({ size = 22, active }: IconProps & { active: boolean }) {
  const color = active ? '#D5A021' : '#6E6458';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.6} fill={active ? color : 'none'} fillOpacity={0.15} />
      <Path d="M4 20C4 17 7.58 14.5 12 14.5C16.42 14.5 20 17 20 20" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

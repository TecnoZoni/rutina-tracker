import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from 'react-native-paper';

export default function BrandMark({ size = 72 }: { size?: number }) {
  const theme = useTheme();
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const onPrimary = theme.colors.onPrimary;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="Rutina Tracker">
      <Rect x="8" y="10" width="48" height="46" rx="12" fill={primary} />
      <Rect x="8" y="10" width="48" height="14" rx="12" fill={secondary} opacity={0.9} />
      <Path
        d="M22 36.5l7 7L43 28.5"
        stroke={onPrimary}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 12v6M42 12v6"
        stroke={onPrimary}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.9}
      />
    </Svg>
  );
}

import * as React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { useTheme } from 'react-native-paper';

type Props = { size?: number };

export function ChecklistIllustration({ size = 84 }: Props) {
  const theme = useTheme();
  const bg = theme.colors.surfaceVariant;
  const primary = theme.colors.primary;
  const ink = theme.colors.onSurfaceVariant;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="Checklist">
      <Rect x="10" y="10" width="44" height="44" rx="10" fill={bg} />
      <Rect x="18" y="20" width="8" height="8" rx="2" fill={primary} opacity={0.9} />
      <Path d="M19.5 24l2 2 3.5-4" stroke={theme.colors.onPrimary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="30" y1="24" x2="46" y2="24" stroke={ink} strokeWidth={3} strokeLinecap="round" opacity={0.8} />

      <Rect x="18" y="32" width="8" height="8" rx="2" fill={primary} opacity={0.35} />
      <Line x1="30" y1="36" x2="46" y2="36" stroke={ink} strokeWidth={3} strokeLinecap="round" opacity={0.65} />

      <Rect x="18" y="44" width="8" height="8" rx="2" fill={primary} opacity={0.35} />
      <Line x1="30" y1="48" x2="46" y2="48" stroke={ink} strokeWidth={3} strokeLinecap="round" opacity={0.65} />
    </Svg>
  );
}

export function CalendarIllustration({ size = 84 }: Props) {
  const theme = useTheme();
  const bg = theme.colors.surfaceVariant;
  const primary = theme.colors.primary;
  const ink = theme.colors.onSurfaceVariant;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="Calendario">
      <Rect x="10" y="12" width="44" height="42" rx="10" fill={bg} />
      <Rect x="10" y="12" width="44" height="12" rx="10" fill={primary} opacity={0.9} />
      <Line x1="22" y1="12" x2="22" y2="22" stroke={theme.colors.onPrimary} strokeWidth={3} strokeLinecap="round" opacity={0.9} />
      <Line x1="42" y1="12" x2="42" y2="22" stroke={theme.colors.onPrimary} strokeWidth={3} strokeLinecap="round" opacity={0.9} />

      <Circle cx="22" cy="34" r="2.2" fill={primary} />
      <Circle cx="32" cy="34" r="2.2" fill={ink} opacity={0.8} />
      <Circle cx="42" cy="34" r="2.2" fill={ink} opacity={0.55} />

      <Circle cx="22" cy="44" r="2.2" fill={ink} opacity={0.55} />
      <Circle cx="32" cy="44" r="2.2" fill={primary} />
      <Circle cx="42" cy="44" r="2.2" fill={ink} opacity={0.55} />
    </Svg>
  );
}

export function TargetIllustration({ size = 84 }: Props) {
  const theme = useTheme();
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const surface = theme.colors.surfaceVariant;
  const ink = theme.colors.onSurfaceVariant;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="Metas">
      <Rect x="10" y="10" width="44" height="44" rx="10" fill={surface} />
      <Circle cx="32" cy="34" r="14" fill="none" stroke={ink} strokeWidth={3} opacity={0.35} />
      <Circle cx="32" cy="34" r="9" fill="none" stroke={secondary} strokeWidth={3} opacity={0.85} />
      <Circle cx="32" cy="34" r="4.5" fill={primary} opacity={0.95} />
      <Path
        d="M42 24l10-10"
        stroke={ink}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.35}
      />
      <Path d="M45 25l6-1-1 6" fill="none" stroke={primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

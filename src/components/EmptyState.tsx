import * as React from 'react';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={{ alignItems: 'center', paddingVertical: 16, gap: 10 }}>
      {icon ? <View style={{ opacity: 0.95 }}>{icon}</View> : null}
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text variant="titleMedium" style={{ textAlign: 'center' }}>
          {title}
        </Text>
        {description ? (
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
            {description}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Button mode="contained" icon="plus" onPress={onAction} style={{ marginTop: 4 }}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

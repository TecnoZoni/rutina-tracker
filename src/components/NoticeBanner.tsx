import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';

type NoticeBannerProps = {
  title: string;
  description: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

export default function NoticeBanner({ title, description, icon = 'lock-outline' }: NoticeBannerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.tertiaryContainer,
          borderColor: theme.colors.tertiary,
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={18} color={theme.colors.tertiary} />
      </View>
      <View style={styles.textWrap}>
        <Text variant="labelLarge" style={{ color: theme.colors.onTertiaryContainer }}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onTertiaryContainer }}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
});

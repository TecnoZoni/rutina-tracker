import * as React from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

type ScreenLayoutProps = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function ScreenLayout({ children, contentContainerStyle }: ScreenLayoutProps) {
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View
        pointerEvents="none"
        style={[
          styles.haloTop,
          {
            backgroundColor: theme.colors.tertiaryContainer,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.haloBottom,
          {
            backgroundColor: theme.colors.secondaryContainer,
          },
        ]}
      />
      <ScrollView contentContainerStyle={[styles.content, contentContainerStyle]}>{children}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  haloTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.32,
  },
  haloBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.22,
  },
});

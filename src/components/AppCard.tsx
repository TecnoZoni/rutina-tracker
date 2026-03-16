import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Card, type CardProps, useTheme } from 'react-native-paper';

type AppCardOwnProps = Omit<CardProps, 'mode' | 'elevation'>;

type AppCardComponent = React.FC<AppCardOwnProps> & {
  Content: typeof Card.Content;
  Title: typeof Card.Title;
  Actions: typeof Card.Actions;
  Cover: typeof Card.Cover;
};

function AppCardBase({ style, ...rest }: AppCardOwnProps) {
  const theme = useTheme();
  return (
    <Card
      mode="elevated"
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.14,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
      },
      default: {},
    }),
  },
});

const AppCard = AppCardBase as AppCardComponent;
AppCard.Content = Card.Content;
AppCard.Title = Card.Title;
AppCard.Actions = Card.Actions;
AppCard.Cover = Card.Cover;

export default AppCard;

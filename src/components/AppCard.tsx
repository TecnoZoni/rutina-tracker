import * as React from 'react';
import { StyleSheet } from 'react-native';
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
      mode="contained"
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
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

const AppCard = AppCardBase as AppCardComponent;
AppCard.Content = Card.Content;
AppCard.Title = Card.Title;
AppCard.Actions = Card.Actions;
AppCard.Cover = Card.Cover;

export default AppCard;

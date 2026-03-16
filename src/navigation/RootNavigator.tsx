import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import CalendarScreen from '../screens/CalendarScreen';
import DayScreen from '../screens/DayScreen';
import GoalsScreen from '../screens/GoalsScreen';

export type RootTabsParamList = {
  Dia: undefined;
  Calendario: undefined;
  Metas: undefined;
};

const Tab = createBottomTabNavigator<RootTabsParamList>();

export default function RootNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: '600',
          letterSpacing: 0.2,
          fontFamily: theme.fonts.titleLarge.fontFamily,
        },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.onSurface,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.labelMedium.fontFamily,
          letterSpacing: 0.2,
        },
        tabBarStyle: {
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 1,
          backgroundColor: theme.colors.background,
          ...Platform.select({
            android: { elevation: 0 },
            ios: { shadowOpacity: 0 },
            default: {},
          }),
        },
      }}
    >
      <Tab.Screen
        name="Dia"
        component={DayScreen}
        options={{
          title: 'Día',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="checkbox-marked-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendario"
        component={CalendarScreen}
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-month-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Metas"
        component={GoalsScreen}
        options={{
          title: 'Metas',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="target" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

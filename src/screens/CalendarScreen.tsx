import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar, LocaleConfig, type DateData } from 'react-native-calendars';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import AppCard from '../components/AppCard';
import { CalendarIllustration } from '../components/Illustrations';
import { useRoutine } from '../context/RoutineContext';
import { formatLongDate, todayId, type DateId } from '../utils/date';

LocaleConfig.locales.es = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

type MarkedDates = Record<
  string,
  { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string; selectedTextColor?: string }
>;

export default function CalendarScreen() {
  const theme = useTheme();
  const { completionsByDate, getActiveGoalsForDate, getDayProgress, isPerfectDay, toggleCompletion } = useRoutine();

  const [selectedDateId, setSelectedDateId] = React.useState<DateId>(todayId());
  const activeGoals = React.useMemo(() => getActiveGoalsForDate(selectedDateId), [getActiveGoalsForDate, selectedDateId]);
  const completedSet = React.useMemo(
    () => new Set(completionsByDate[selectedDateId] ?? []),
    [completionsByDate, selectedDateId],
  );
  const progress = React.useMemo(() => getDayProgress(selectedDateId), [getDayProgress, selectedDateId]);

  const markedDates = React.useMemo<MarkedDates>(() => {
    const marks: MarkedDates = {};
    for (const dateId of Object.keys(completionsByDate)) {
      if (isPerfectDay(dateId as DateId)) {
        marks[dateId] = { marked: true, dotColor: theme.colors.primary };
      }
    }
    marks[selectedDateId] = {
      ...(marks[selectedDateId] ?? {}),
      selected: true,
      selectedColor: theme.colors.primaryContainer,
      selectedTextColor: theme.colors.onPrimaryContainer,
    };
    return marks;
  }, [
    completionsByDate,
    isPerfectDay,
    selectedDateId,
    theme.colors.onPrimaryContainer,
    theme.colors.primary,
    theme.colors.primaryContainer,
  ]);

  const calendarTheme = React.useMemo(
    () => ({
      calendarBackground: theme.colors.surface,
      textSectionTitleColor: theme.colors.onSurfaceVariant,
      selectedDayBackgroundColor: theme.colors.primaryContainer,
      selectedDayTextColor: theme.colors.onPrimaryContainer,
      todayTextColor: theme.colors.primary,
      dayTextColor: theme.colors.onSurface,
      textDisabledColor: theme.colors.onSurfaceVariant,
      dotColor: theme.colors.primary,
      selectedDotColor: theme.colors.primary,
      monthTextColor: theme.colors.onSurface,
      arrowColor: theme.colors.onSurface,
    }),
    [theme.colors],
  );

  const onDayPress = React.useCallback((day: DateData) => {
    setSelectedDateId(day.dateString as DateId);
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 12 }}>
      <AppCard>
        <AppCard.Content style={{ gap: 10 }}>
          <View style={{ alignItems: 'center' }}>
            <CalendarIllustration size={72} />
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Los días marcados indican que completaste todas las metas de ese día.
          </Text>
          <Calendar
            firstDay={1}
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={calendarTheme}
            enableSwipeMonths
          />
        </AppCard.Content>
      </AppCard>

      <AppCard>
        <AppCard.Title title="Detalle del día" subtitle={formatLongDate(selectedDateId)} />
        <AppCard.Content style={{ gap: 8 }}>
          {progress.total === 0 ? (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              No había metas activas este día.
            </Text>
          ) : (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {progress.done}/{progress.total} completadas {progress.isPerfect ? '• Día completado' : ''}
            </Text>
          )}

          {activeGoals.map((goal) => {
            const checked = completedSet.has(goal.id);
            return (
              <React.Fragment key={goal.id}>
                <TouchableRipple
                  onPress={() => toggleCompletion(goal.id, selectedDateId)}
                  borderless={false}
                  style={{ borderRadius: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={checked ? 'Marcar como pendiente' : 'Marcar como completada'}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingRight: 4 }}>
                    <View style={{ width: 44, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialCommunityIcons
                        name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={26}
                        color={checked ? theme.colors.primary : theme.colors.onSurfaceVariant}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyLarge">{goal.title}</Text>
                    </View>
                  </View>
                </TouchableRipple>
                <Divider />
              </React.Fragment>
            );
          })}
        </AppCard.Content>
      </AppCard>
    </ScrollView>
  );
}

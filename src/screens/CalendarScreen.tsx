import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar, LocaleConfig, type DateData } from 'react-native-calendars';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import AppCard from '../components/AppCard';
import { CalendarIllustration } from '../components/Illustrations';
import NoticeBanner from '../components/NoticeBanner';
import ScreenLayout from '../components/ScreenLayout';
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

const calendarSerif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) ?? 'serif';
const calendarSans = Platform.select({ ios: 'Avenir Next', android: 'sans-serif', default: 'sans-serif' }) ?? 'sans-serif';

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

  const today = todayId();
  const isPastDay = selectedDateId < today;
  const canEdit = !isPastDay;

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

  const calendarTheme = React.useMemo(() => {
    const baseTheme = {
      textMonthFontFamily: calendarSerif,
      textDayFontFamily: calendarSans,
      textDayHeaderFontFamily: calendarSans,
      textMonthFontWeight: '600',
      textDayFontWeight: '400',
    };

    if (theme.dark) {
      return {
        ...baseTheme,
        calendarBackground: theme.colors.surface,
        textSectionTitleColor: theme.colors.onSurfaceVariant,
        selectedDayBackgroundColor: theme.colors.primaryContainer,
        selectedDayTextColor: theme.colors.onPrimaryContainer,
        todayTextColor: theme.colors.primary,
        dayTextColor: theme.colors.onSurface,
        textDisabledColor: theme.colors.outline,
        dotColor: theme.colors.primary,
        selectedDotColor: theme.colors.primary,
        monthTextColor: theme.colors.onSurface,
        arrowColor: theme.colors.onSurface,
      };
    }

    return {
      ...baseTheme,
      calendarBackground: theme.colors.surface,
      textSectionTitleColor: theme.colors.onSurfaceVariant,
      selectedDayBackgroundColor: theme.colors.primaryContainer,
      selectedDayTextColor: theme.colors.onPrimaryContainer,
      todayTextColor: theme.colors.primary,
      dayTextColor: theme.colors.onSurface,
      textDisabledColor: theme.colors.outline,
      dotColor: theme.colors.primary,
      selectedDotColor: theme.colors.primary,
      monthTextColor: theme.colors.onSurface,
      arrowColor: theme.colors.primary,
    };
  }, [theme]);

  const onDayPress = React.useCallback((day: DateData) => {
    setSelectedDateId(day.dateString as DateId);
  }, []);

  return (
    <ScreenLayout>
      <AppCard>
        <AppCard.Content style={{ gap: 12 }}>
          <View style={styles.calendarHeader}>
            <View style={styles.calendarTitle}>
              <View style={[styles.calendarIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                <CalendarIllustration size={36} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium">Calendario</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Sellá los días en los que cumplís todo.
                </Text>
              </View>
            </View>
            <View style={styles.legend}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Día completo
              </Text>
            </View>
          </View>

          <View style={[styles.calendarWrap, { borderColor: theme.colors.outlineVariant }]}>
            <Calendar
              key={theme.dark ? 'calendar-dark' : 'calendar-light'}
              firstDay={1}
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={calendarTheme}
              enableSwipeMonths
              style={{ backgroundColor: theme.colors.surface }}
            />
          </View>

          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Los días marcados indican que completaste todas las metas de ese día.
          </Text>
        </AppCard.Content>
      </AppCard>

      <AppCard>
        <AppCard.Content style={{ gap: 12 }}>
          <View style={styles.detailHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium">Detalle del día</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {formatLongDate(selectedDateId)}
              </Text>
            </View>
            {progress.isPerfect ? (
              <View style={[styles.detailBadge, { borderColor: theme.colors.secondary }]}>
                <MaterialCommunityIcons name="check-circle-outline" size={16} color={theme.colors.secondary} />
                <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>
                  Perfecto
                </Text>
              </View>
            ) : null}
          </View>

          {isPastDay ? (
            <NoticeBanner
              title="Solo lectura"
              description="Los días anteriores se consultan sin editar. Sumá avances desde hoy en adelante."
            />
          ) : null}

          {progress.total === 0 ? (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              No había metas activas este día.
            </Text>
          ) : (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {progress.done}/{progress.total} completadas {progress.isPerfect ? '• Día completo' : ''}
            </Text>
          )}

          {activeGoals.map((goal) => {
            const checked = completedSet.has(goal.id);
            return (
              <TouchableRipple
                key={goal.id}
                onPress={canEdit ? () => toggleCompletion(goal.id, selectedDateId) : undefined}
                borderless={false}
                disabled={!canEdit}
                style={[
                  styles.goalRow,
                  {
                    backgroundColor: checked ? theme.colors.secondaryContainer : theme.colors.surfaceVariant,
                    borderColor: checked ? theme.colors.secondary : theme.colors.outlineVariant,
                  },
                  !canEdit && styles.goalRowDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel={checked ? 'Marcar como pendiente' : 'Marcar como completada'}
              >
                <View style={styles.goalRowContent}>
                  <View style={styles.checkboxWrap}>
                    <MaterialCommunityIcons
                      name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={24}
                      color={checked ? theme.colors.secondary : theme.colors.onSurfaceVariant}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge">{goal.title}</Text>
                  </View>
                </View>
              </TouchableRipple>
            );
          })}
        </AppCard.Content>
      </AppCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  calendarWrap: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  goalRow: {
    borderRadius: 14,
    borderWidth: 1,
  },
  goalRowDisabled: {
    opacity: 0.6,
  },
  goalRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  checkboxWrap: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  ProgressBar,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import AppCard from '../components/AppCard';
import EmptyState from '../components/EmptyState';
import { ChecklistIllustration } from '../components/Illustrations';
import NoticeBanner from '../components/NoticeBanner';
import ScreenLayout from '../components/ScreenLayout';
import { useRoutine } from '../context/RoutineContext';
import { addDays, formatLongDate, todayId, type DateId } from '../utils/date';

export default function DayScreen() {
  const theme = useTheme();
  const { isHydrated, completionsByDate, getActiveGoalsForDate, getDayProgress, toggleCompletion, addGoal, deleteGoal } =
    useRoutine();

  const [dateId, setDateId] = React.useState<DateId>(todayId());

  const [addOpen, setAddOpen] = React.useState(false);
  const [newGoalTitle, setNewGoalTitle] = React.useState('');

  const [deleteGoalId, setDeleteGoalId] = React.useState<string | null>(null);

  const today = todayId();
  const isPastDay = dateId < today;
  const canEdit = !isPastDay;

  const activeGoals = React.useMemo(() => getActiveGoalsForDate(dateId), [getActiveGoalsForDate, dateId]);
  const completedSet = React.useMemo(() => new Set(completionsByDate[dateId] ?? []), [completionsByDate, dateId]);
  const progress = React.useMemo(() => getDayProgress(dateId), [getDayProgress, dateId]);

  const percent = progress.total > 0 ? progress.done / progress.total : 0;

  React.useEffect(() => {
    if (isPastDay && addOpen) {
      setAddOpen(false);
      setNewGoalTitle('');
    }
  }, [addOpen, isPastDay]);

  const closeAdd = React.useCallback(() => {
    setAddOpen(false);
    setNewGoalTitle('');
  }, []);

  const submitAdd = React.useCallback(() => {
    if (!canEdit) return;
    addGoal(newGoalTitle);
    closeAdd();
  }, [addGoal, closeAdd, newGoalTitle, canEdit]);

  const openAdd = React.useCallback(() => {
    if (!canEdit) return;
    setAddOpen(true);
  }, [canEdit]);

  const jumpToToday = React.useCallback(() => setDateId(todayId()), []);

  return (
    <ScreenLayout contentContainerStyle={{ paddingBottom: 32 }}>
      <AppCard>
        <AppCard.Content style={styles.dayCard}>
          <View style={styles.dayStrip}>
            <IconButton
              icon="chevron-left"
              onPress={() => setDateId((d) => addDays(d, -1))}
              accessibilityLabel="Día anterior"
            />
            <View style={styles.dayTitleWrap}>
              <Text variant="titleLarge" style={styles.dayTitle}>
                {formatLongDate(dateId)}
              </Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Registro del día
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              onPress={() => setDateId((d) => addDays(d, 1))}
              accessibilityLabel="Día siguiente"
            />
          </View>

          <View style={styles.dayActions}>
            <Button mode="outlined" onPress={jumpToToday} icon="calendar-today">
              Hoy
            </Button>
            {progress.isPerfect ? (
              <View
                style={[
                  styles.stamp,
                  {
                    backgroundColor: theme.colors.secondaryContainer,
                    borderColor: theme.colors.secondary,
                  },
                ]}
              >
                <MaterialCommunityIcons name="check-decagram" size={16} color={theme.colors.secondary} />
                <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer }}>
                  Día completo
                </Text>
              </View>
            ) : null}
          </View>

          {!isHydrated ? (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Cargando…
            </Text>
          ) : progress.total === 0 ? (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              No hay metas activas para este día.
            </Text>
          ) : (
            <View style={styles.progressBlock}>
              <View style={styles.progressHeader}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Progreso
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurface }}>
                  {progress.done}/{progress.total}
                </Text>
              </View>
              <ProgressBar progress={percent} color={theme.colors.primary} style={styles.progressBar} />
            </View>
          )}

          {progress.total > 0 && !progress.isPerfect && !isPastDay ? (
            <View style={styles.helperRow}>
              <MaterialCommunityIcons name="information-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>
                Completá todas las metas para registrar este día en el calendario.
              </Text>
            </View>
          ) : null}
        </AppCard.Content>
      </AppCard>

      {isPastDay ? (
        <NoticeBanner
          title="Solo lectura"
          description="En días anteriores no se pueden agregar ni editar actividades. Podés ver lo registrado y seguir sumando desde hoy."
        />
      ) : null}

      <AppCard>
        <AppCard.Content style={{ gap: 12 }}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium">Checklist</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Marcá tus metas del día
              </Text>
            </View>
            {activeGoals.length > 0 ? (
              <Button mode="contained-tonal" icon="plus" onPress={openAdd} disabled={!canEdit}>
                Agregar
              </Button>
            ) : null}
          </View>

          {activeGoals.length === 0 ? (
            <EmptyState
              icon={<ChecklistIllustration size={84} />}
              title="Sumá tu primera meta"
              description={
                canEdit
                  ? 'Creá metas y marcá cada día. Si completás todas, el día queda guardado en el calendario.'
                  : 'No hay metas activas para este día.'
              }
              actionLabel={canEdit ? 'Agregar meta' : undefined}
              onAction={canEdit ? openAdd : undefined}
            />
          ) : (
            activeGoals.map((goal) => {
              const checked = completedSet.has(goal.id);
              return (
                <TouchableRipple
                  key={goal.id}
                  onPress={canEdit ? () => toggleCompletion(goal.id, dateId) : undefined}
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
                    <IconButton
                      icon="trash-can-outline"
                      onPress={() => setDeleteGoalId(goal.id)}
                      accessibilityLabel="Eliminar meta"
                      disabled={!canEdit}
                      iconColor={canEdit ? theme.colors.onSurfaceVariant : theme.colors.outline}
                    />
                  </View>
                </TouchableRipple>
              );
            })
          )}

          {activeGoals.length > 0 ? (
            <View style={styles.addRow}>
              <Button mode="contained" icon="plus" onPress={openAdd} disabled={!canEdit}>
                Agregar meta
              </Button>
              {!canEdit ? (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Solo desde hoy ({today}).
                </Text>
              ) : null}
            </View>
          ) : null}
        </AppCard.Content>
      </AppCard>

      <Portal>
        <Dialog visible={addOpen} onDismiss={closeAdd} style={styles.dialog}>
          <Dialog.Title>Nueva meta</Dialog.Title>
          <Dialog.Content style={{ gap: 10 }}>
            <TextInput
              label="Título"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              placeholder="Ej: Leer 20 minutos"
              autoFocus
            />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              La meta empezará a contar desde hoy ({todayId()}).
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeAdd}>Cancelar</Button>
            <Button mode="contained" onPress={submitAdd} disabled={!newGoalTitle.trim()}>
              Agregar
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={!!deleteGoalId} onDismiss={() => setDeleteGoalId(null)}>
          <Dialog.Title>Eliminar meta</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">¿Seguro que querés eliminar esta meta?</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 6 }}>
              Se deja de contar desde {dateId}.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteGoalId(null)}>Cancelar</Button>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              onPress={() => {
                if (deleteGoalId) deleteGoal(deleteGoalId, dateId);
                setDeleteGoalId(null);
              }}
            >
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 10,
  },
  dayCard: {
    gap: 12,
  },
  dayStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  dayTitle: {
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  dayActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  stamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  progressBlock: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  addRow: {
    gap: 6,
  },
});

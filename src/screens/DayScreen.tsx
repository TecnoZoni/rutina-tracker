import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Button,
  Chip,
  Dialog,
  Divider,
  FAB,
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

  const activeGoals = React.useMemo(() => getActiveGoalsForDate(dateId), [getActiveGoalsForDate, dateId]);
  const completedSet = React.useMemo(() => new Set(completionsByDate[dateId] ?? []), [completionsByDate, dateId]);
  const progress = React.useMemo(() => getDayProgress(dateId), [getDayProgress, dateId]);

  const percent = progress.total > 0 ? progress.done / progress.total : 0;

  const closeAdd = React.useCallback(() => {
    setAddOpen(false);
    setNewGoalTitle('');
  }, []);

  const submitAdd = React.useCallback(() => {
    addGoal(newGoalTitle);
    closeAdd();
  }, [addGoal, closeAdd, newGoalTitle]);

  const jumpToToday = React.useCallback(() => setDateId(todayId()), []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}>
        <AppCard>
          <AppCard.Content style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IconButton
                icon="chevron-left"
                onPress={() => setDateId((d) => addDays(d, -1))}
                accessibilityLabel="Día anterior"
              />
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ textTransform: 'capitalize' }}>
                  {formatLongDate(dateId)}
                </Text>
                {!isHydrated ? (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Cargando…
                  </Text>
                ) : progress.total === 0 ? (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    No hay metas activas para este día.
                  </Text>
                ) : (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {progress.done}/{progress.total} completadas
                  </Text>
                )}
              </View>
              <IconButton
                icon="chevron-right"
                onPress={() => setDateId((d) => addDays(d, 1))}
                accessibilityLabel="Día siguiente"
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Button mode="outlined" onPress={jumpToToday} icon="calendar-today">
                Hoy
              </Button>
              {progress.isPerfect ? (
                <Chip icon="check-decagram" style={{ backgroundColor: theme.colors.primaryContainer }}>
                  Día completado
                </Chip>
              ) : null}
            </View>

            {progress.total > 0 ? (
              <ProgressBar progress={percent} color={theme.colors.primary} style={{ height: 10, borderRadius: 999 }} />
            ) : null}

            {progress.total > 0 && !progress.isPerfect ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="information-outline" size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>
                  Completá todas las metas para registrar este día en el calendario.
                </Text>
              </View>
            ) : null}
          </AppCard.Content>
        </AppCard>

        <AppCard>
          <AppCard.Title title="Checklist" subtitle="Marcá tus metas del día" />
          <AppCard.Content style={{ gap: 6 }}>
            {activeGoals.length === 0 ? (
              <EmptyState
                icon={<ChecklistIllustration size={84} />}
                title="Sumá tu primera meta"
                description="Creá metas y marcá cada día. Si completás todas, el día queda guardado en el calendario."
                actionLabel="Agregar meta"
                onAction={() => setAddOpen(true)}
              />
            ) : (
              activeGoals.map((goal) => {
                const checked = completedSet.has(goal.id);
                return (
                  <React.Fragment key={goal.id}>
                    <TouchableRipple
                      onPress={() => toggleCompletion(goal.id, dateId)}
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
                        <IconButton
                          icon="trash-can-outline"
                          onPress={() => setDeleteGoalId(goal.id)}
                          accessibilityLabel="Eliminar meta"
                        />
                      </View>
                    </TouchableRipple>
                    <Divider />
                  </React.Fragment>
                );
              })
            )}
          </AppCard.Content>
        </AppCard>
      </ScrollView>

      <FAB
        icon="plus"
        label="Agregar meta"
        onPress={() => setAddOpen(true)}
        style={{ position: 'absolute', right: 16, bottom: 16 }}
      />

      <Portal>
        <Dialog visible={addOpen} onDismiss={closeAdd}>
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
              Se deja de contar desde hoy ({todayId()}).
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteGoalId(null)}>Cancelar</Button>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              onPress={() => {
                if (deleteGoalId) deleteGoal(deleteGoalId);
                setDeleteGoalId(null);
              }}
            >
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

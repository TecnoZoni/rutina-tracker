import * as React from 'react';
import { ScrollView, View } from 'react-native';
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import AppCard from '../components/AppCard';
import EmptyState from '../components/EmptyState';
import { TargetIllustration } from '../components/Illustrations';
import { useRoutine } from '../context/RoutineContext';
import { useAppTheme, type ThemePreference } from '../context/ThemeContext';
import { todayId } from '../utils/date';

export default function GoalsScreen() {
  const theme = useTheme();
  const { goals, addGoal, deleteGoal } = useRoutine();
  const { preference, setPreference } = useAppTheme();

  const [addOpen, setAddOpen] = React.useState(false);
  const [newGoalTitle, setNewGoalTitle] = React.useState('');
  const [deleteGoalId, setDeleteGoalId] = React.useState<string | null>(null);

  const activeGoals = React.useMemo(() => goals.filter((g) => !g.deletedOn), [goals]);

  const closeAdd = React.useCallback(() => {
    setAddOpen(false);
    setNewGoalTitle('');
  }, []);

  const submitAdd = React.useCallback(() => {
    addGoal(newGoalTitle);
    closeAdd();
  }, [addGoal, closeAdd, newGoalTitle]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 12 }}>
      <AppCard>
        <AppCard.Title title="Metas activas" subtitle={`${activeGoals.length} en tu rutina`} />
        <AppCard.Content style={{ gap: 6 }}>
          {activeGoals.length === 0 ? (
            <EmptyState
              icon={<TargetIllustration size={84} />}
              title="Tu rutina empieza acá"
              description="Agregá tus metas y marcá cada día. Si completás todas, se registra en el calendario."
              actionLabel="Agregar meta"
              onAction={() => setAddOpen(true)}
            />
          ) : (
            <>
              {activeGoals.map((goal) => (
                <React.Fragment key={goal.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <List.Icon icon="target" />
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyLarge">{goal.title}</Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        Desde {goal.createdOn}
                      </Text>
                    </View>
                    <IconButton
                      icon="trash-can-outline"
                      onPress={() => setDeleteGoalId(goal.id)}
                      accessibilityLabel="Eliminar meta"
                    />
                  </View>
                  <Divider />
                </React.Fragment>
              ))}

              <Button mode="contained" icon="plus" onPress={() => setAddOpen(true)} style={{ marginTop: 6 }}>
                Agregar meta
              </Button>
            </>
          )}
        </AppCard.Content>
      </AppCard>

      <AppCard>
        <AppCard.Title title="Apariencia" subtitle="Modo claro / oscuro" />
        <AppCard.Content style={{ gap: 10 }}>
          <SegmentedButtons
            value={preference}
            onValueChange={(v) => setPreference(v as ThemePreference)}
            buttons={[
              { value: 'system', label: 'Sistema' },
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Oscuro' },
            ]}
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Se guarda en el dispositivo.
          </Text>
        </AppCard.Content>
      </AppCard>

      <Portal>
        <Dialog visible={addOpen} onDismiss={closeAdd}>
          <Dialog.Title>Nueva meta</Dialog.Title>
          <Dialog.Content style={{ gap: 10 }}>
            <TextInput
              label="Título"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              placeholder="Ej: Entrenar 30 minutos"
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
    </ScrollView>
  );
}

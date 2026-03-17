import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import AppCard from '../components/AppCard';
import EmptyState from '../components/EmptyState';
import { TargetIllustration } from '../components/Illustrations';
import ScreenLayout from '../components/ScreenLayout';
import { useRoutine, type Goal } from '../context/RoutineContext';
import { useAppTheme, type ThemePreference } from '../context/ThemeContext';
import { todayId } from '../utils/date';

export default function GoalsScreen() {
  const theme = useTheme();
  const { goals, addGoal, deleteGoal, reorderGoals } = useRoutine();
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

  const handleDragEnd = React.useCallback(
    ({ data }: { data: Goal[] }) => {
      reorderGoals(data.map((goal) => goal.id));
    },
    [reorderGoals],
  );

  const renderGoalItem = React.useCallback(
    ({ item, drag, isActive }: RenderItemParams<Goal>) => (
      <View
        style={[
          styles.goalRow,
          { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant },
          isActive ? styles.goalRowActive : null,
        ]}
      >
        <View style={styles.goalRowContent}>
          <View style={[styles.goalIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
            <MaterialCommunityIcons name="target" size={18} color={theme.colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodyLarge">{item.title}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Desde {item.createdOn}
            </Text>
          </View>
          <Pressable onLongPress={drag} style={styles.dragHandle} accessibilityLabel="Reordenar meta">
            <MaterialCommunityIcons name="drag" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>
          <IconButton
            icon="trash-can-outline"
            onPress={() => setDeleteGoalId(item.id)}
            accessibilityLabel="Eliminar meta"
          />
        </View>
      </View>
    ),
    [theme.colors, setDeleteGoalId],
  );

  return (
    <ScreenLayout>
      <AppCard>
        <AppCard.Content style={{ gap: 12 }}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium">Metas activas</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {activeGoals.length} en tu rutina
              </Text>
            </View>
            {activeGoals.length > 0 ? (
              <Button mode="contained-tonal" icon="plus" onPress={() => setAddOpen(true)}>
                Agregar
              </Button>
            ) : null}
          </View>

          {activeGoals.length === 0 ? (
            <EmptyState
              icon={<TargetIllustration size={84} />}
              title="Tu rutina empieza acá"
              description="Agregá tus metas y marcá cada día. Si completás todas, se registra en el calendario."
              actionLabel="Agregar meta"
              onAction={() => setAddOpen(true)}
            />
          ) : (
            <DraggableFlatList
              data={activeGoals}
              keyExtractor={(item) => item.id}
              renderItem={renderGoalItem}
              onDragEnd={handleDragEnd}
              activationDistance={8}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          )}

          {activeGoals.length > 0 ? (
            <View style={styles.addRow}>
              <Button mode="contained" icon="plus" onPress={() => setAddOpen(true)}>
                Agregar meta
              </Button>
            </View>
          ) : null}
        </AppCard.Content>
      </AppCard>

      <AppCard>
        <AppCard.Content style={{ gap: 12 }}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium">Apariencia</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Modo claro / oscuro
              </Text>
            </View>
          </View>
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
        <Dialog visible={addOpen} onDismiss={closeAdd} style={styles.dialog}>
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

        <Dialog visible={!!deleteGoalId} onDismiss={() => setDeleteGoalId(null)} style={styles.dialog}>
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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 10,
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
  goalRowActive: {
    opacity: 0.8,
  },
  goalRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dragHandle: {
    padding: 6,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: {
    gap: 6,
  },
  listContent: {
    gap: 10,
  },
});

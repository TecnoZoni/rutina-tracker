import * as React from 'react';
import { loadJson, saveJson } from '../storage/storage';
import { todayId, type DateId } from '../utils/date';
import { generateGoalId } from '../utils/id';

export type Goal = {
  id: string;
  title: string;
  createdOn: DateId;
  deletedOn?: DateId | null;
};

export type CompletionsByDate = Record<DateId, string[]>;

type RoutineState = {
  isHydrated: boolean;
  goals: Goal[];
  completionsByDate: CompletionsByDate;
};

type RoutineContextValue = RoutineState & {
  addGoal: (title: string) => void;
  deleteGoal: (goalId: string, deletedOn?: DateId) => void;
  toggleCompletion: (goalId: string, dateId: DateId) => void;
  getActiveGoalsForDate: (dateId: DateId) => Goal[];
  getDayProgress: (dateId: DateId) => { total: number; done: number; isPerfect: boolean };
  isPerfectDay: (dateId: DateId) => boolean;
};

const GOALS_KEY = 'rutina_goals_v1';
const COMPLETIONS_KEY = 'rutina_completions_v1';

type Action =
  | { type: 'hydrate'; goals: Goal[]; completionsByDate: CompletionsByDate }
  | { type: 'addGoal'; goal: Goal }
  | { type: 'deleteGoal'; goalId: string; deletedOn: DateId }
  | { type: 'toggleCompletion'; goalId: string; dateId: DateId };

function isGoalActiveOn(goal: Goal, dateId: DateId): boolean {
  return goal.createdOn <= dateId && (!goal.deletedOn || goal.deletedOn > dateId);
}

function toggleIdInList(list: readonly string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function reducer(state: RoutineState, action: Action): RoutineState {
  switch (action.type) {
    case 'hydrate':
      return {
        isHydrated: true,
        goals: action.goals,
        completionsByDate: action.completionsByDate,
      };
    case 'addGoal': {
      const nextGoals = [action.goal, ...state.goals];
      return { ...state, goals: nextGoals };
    }
    case 'deleteGoal': {
      const nextGoals = state.goals.map((goal) =>
        goal.id === action.goalId ? { ...goal, deletedOn: action.deletedOn } : goal,
      );
      return { ...state, goals: nextGoals };
    }
    case 'toggleCompletion': {
      const current = state.completionsByDate[action.dateId] ?? [];
      const next = toggleIdInList(current, action.goalId);
      const nextCompletions: CompletionsByDate = { ...state.completionsByDate, [action.dateId]: next };
      return { ...state, completionsByDate: nextCompletions };
    }
    default:
      return state;
  }
}

const RoutineContext = React.createContext<RoutineContextValue | null>(null);

export function RoutineProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    isHydrated: false,
    goals: [],
    completionsByDate: {},
  });

  React.useEffect(() => {
    let isMounted = true;
    void (async () => {
      const [goals, completionsByDate] = await Promise.all([
        loadJson<Goal[]>(GOALS_KEY, []),
        loadJson<CompletionsByDate>(COMPLETIONS_KEY, {}),
      ]);
      if (!isMounted) return;
      dispatch({
        type: 'hydrate',
        goals: Array.isArray(goals) ? goals : [],
        completionsByDate: completionsByDate && typeof completionsByDate === 'object' ? completionsByDate : {},
      });
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!state.isHydrated) return;
    void saveJson(GOALS_KEY, state.goals);
  }, [state.goals, state.isHydrated]);

  React.useEffect(() => {
    if (!state.isHydrated) return;
    void saveJson(COMPLETIONS_KEY, state.completionsByDate);
  }, [state.completionsByDate, state.isHydrated]);

  const addGoal = React.useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const goal: Goal = {
      id: generateGoalId(),
      title: trimmed,
      createdOn: todayId(),
      deletedOn: null,
    };
    dispatch({ type: 'addGoal', goal });
  }, []);

  const deleteGoal = React.useCallback((goalId: string, deletedOn?: DateId) => {
    dispatch({ type: 'deleteGoal', goalId, deletedOn: deletedOn ?? todayId() });
  }, []);

  const toggleCompletion = React.useCallback((goalId: string, dateId: DateId) => {
    dispatch({ type: 'toggleCompletion', goalId, dateId });
  }, []);

  const getActiveGoalsForDate = React.useCallback(
    (dateId: DateId) => state.goals.filter((goal) => isGoalActiveOn(goal, dateId)),
    [state.goals],
  );

  const getDayProgress = React.useCallback(
    (dateId: DateId) => {
      const activeGoals = getActiveGoalsForDate(dateId);
      const completed = new Set(state.completionsByDate[dateId] ?? []);
      const done = activeGoals.reduce((count, goal) => (completed.has(goal.id) ? count + 1 : count), 0);
      const total = activeGoals.length;
      return { total, done, isPerfect: total > 0 && done === total };
    },
    [getActiveGoalsForDate, state.completionsByDate],
  );

  const isPerfectDay = React.useCallback(
    (dateId: DateId) => getDayProgress(dateId).isPerfect,
    [getDayProgress],
  );

  const value = React.useMemo<RoutineContextValue>(
    () => ({
      ...state,
      addGoal,
      deleteGoal,
      toggleCompletion,
      getActiveGoalsForDate,
      getDayProgress,
      isPerfectDay,
    }),
    [state, addGoal, deleteGoal, toggleCompletion, getActiveGoalsForDate, getDayProgress, isPerfectDay],
  );

  return <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>;
}

export function useRoutine() {
  const value = React.useContext(RoutineContext);
  if (!value) throw new Error('useRoutine must be used within RoutineProvider');
  return value;
}

import React, { useState, useEffect, use } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreatePlan from './src/components/CreatePlan';
import Plan from './src/components/Plan';
import { Alert } from 'react-native';
import { Task, PlanEntry, PlansStore } from './src/types/task';
import usePlan from './src/hooks/usePlan';

import { darkTheme, lightTheme, Theme, ThemeType } from './src/types/theme';
import Layout from './src/components/Layout';

export type RootStackParamList = {
  Create: undefined;
  Plan: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const PLAN_STORAGE_KEY = 'latest_plan_v1';

export default function App() {
  const [plans, setPlans] = useState<PlanEntry[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [goalName, setGoalName] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const [theme, setTheme] = useState<Theme>(lightTheme);
  const { loading, error, generate, deletePlan } = usePlan(setPlans);

  // Load plan from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(PLAN_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as PlansStore | any;
          // If it's an array of tasks (legacy), wrap into one plan
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
            const wrapped: PlanEntry = {
              id: `${Date.now().toString(36)}`,
              name: 'Imported plan',
              tasks: parsed as Task[],
              createdAt: new Date().toISOString(),
            };
            setPlans([wrapped]);
            setActivePlanId(wrapped.id);
          } else if (Array.isArray(parsed)) {
            // assume it's PlansStore
            setPlans(parsed as PlansStore);
            setActivePlanId((parsed as PlansStore)[0]?.id ?? null);
          } else if (parsed?.plans) {
            setPlans(parsed.plans as PlansStore);
            setActivePlanId(parsed.plans[0]?.id ?? null);
          }
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Persist plans history
  useEffect(() => {
    AsyncStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    const colorScheme = 'light' as ThemeType; // replace with actual device theme detection
    setTheme(colorScheme === 'light' ? lightTheme : darkTheme);
  }, []);

  const handleGenerate = async (goal: string, timeHorizon: 'today' | 'week', navigation: any) => {
    try {
      const tasksArray = await generate(goal, timeHorizon);
      const entry: PlanEntry = {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        name: goal,
        tasks: tasksArray,
        createdAt: new Date().toISOString(),
      };
      setPlans((prev) => [entry, ...prev]);
      setActivePlanId(entry.id);
      setGoalName(goal);
      setFilter('all');
      navigation.navigate('Plan');
      console.log('Generated plan with tasks:', tasksArray.length);
    } catch (e: any) {
      console.error('Generate plan error:', e?.message || e);
      Alert.alert('Error', e?.message || 'Could not generate plan.');
    }
  };


  const onToggleTheme = () => {
    setTheme((prev) => (prev.type === 'light' ? darkTheme : lightTheme));
  };

  return (
    <NavigationContainer>
      <Layout
        theme={theme}
        onToggleTheme={onToggleTheme}
        currentTheme={theme.type}
      >
        <Stack.Navigator initialRouteName="Create" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Create">
            {({ navigation }) => (
              <CreatePlan
                onGenerate={(goal, timeHorizon) => handleGenerate(goal, timeHorizon, navigation)}
                loading={loading}
                theme={theme}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Plan">
            {({ navigation }) => (
                <Plan
                plans={plans}
                activePlanId={activePlanId}
                selectPlan={(id: string) => setActivePlanId(id)}
                toggleTask={(planId: string, taskId: string) => {
                  setPlans((prev) => prev.map((p) => p.id === planId ? {
                    ...p,
                    tasks: p.tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t)
                  } : p));
                }}
                deletePlan={(id: string) => deletePlan(id)}
                filter={filter}
                setFilter={setFilter}
                theme={theme}
                loading={loading}
                onBack={() => navigation.navigate('Create')}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </Layout>
    </NavigationContainer>
  );
}

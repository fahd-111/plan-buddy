import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import TaskItem from './TaskItem';
import PriorityFilter from './PriorityFilter';
import { Theme } from '../types/theme';
import { getCommonStyles } from '../styles/themeStyles';

interface PlanProps {
  plans: import('../types/task').PlanEntry[];
  activePlanId: string | null;
  selectPlan: (id: string) => void;
  toggleTask: (planId: string, taskId: string) => void;
  deletePlan?: (planId: string) => void;
  filter: 'all' | 'high' | 'medium' | 'low';
  setFilter: (priority: 'all' | 'high' | 'medium' | 'low') => void;
  loading: boolean;
  onBack: () => void;
  theme: Theme;
}

const Plan: React.FC<PlanProps> = ({ plans, activePlanId, selectPlan, toggleTask, deletePlan, filter, setFilter, loading, onBack, theme }) => {
  const common = getCommonStyles(theme);
  if (!plans || plans.length === 0) {
    return (
      <View style={[common.container, localStyles.container]}>
        <Button title="Back" onPress={onBack} accessibilityLabel="Back to create plan" color={theme.primary} />
        <Text style={localStyles.empty}>No plans yet. Create one!</Text>
      </View>
    );
  }

  const confirmDelete = (planId: string, planName?: string) => {
    if (!deletePlan) return;
    Alert.alert(
      'Delete plan',
      `Delete plan "${planName || ''}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePlan(planId) },
      ]
    );
  };

  return (
    <View style={[common.container, localStyles.container]}>
      <Text style={common.heading}>Plan History</Text>
      <PriorityFilter value={filter} onChange={setFilter} theme={theme} />

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => selectPlan(item.id)} accessibilityRole="button">
                  <Text style={[common.heading, { fontSize: 18, color: item.id === activePlanId ? theme.primary : undefined }]}>{item.name}</Text>
                </TouchableOpacity>
                {deletePlan ? (
                  <TouchableOpacity onPress={() => confirmDelete(item.id, item.name)} accessibilityRole="button" style={{ padding: 8 }}>
                    <Text style={{ color: '#c62828', fontWeight: '600' }}>Delete</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text style={{ color: '#888', marginBottom: 8 }}>Created: {new Date(item.createdAt).toLocaleString()}</Text>
              {item.tasks.length === 0 ? (
                <Text style={localStyles.empty}>No tasks in this plan.</Text>
              ) : (
                <FlatList
                  data={item.tasks.filter((t: import('../types/task').Task) => filter === 'all' ? true : t.priority === filter)}
                  keyExtractor={(t) => t.id}
                  renderItem={({ item: task }) => (
                    <TaskItem {...task} onToggle={() => toggleTask(item.id, task.id)} theme={theme} />
                  )}
                  contentContainerStyle={{ paddingBottom: 8 }}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
});

export default Plan;

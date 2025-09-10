import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types/task';
import { Theme } from '../types/theme';
import { getCommonStyles } from '../styles/themeStyles';

interface TaskItemProps extends Task {
  onToggle: () => void;
  theme: Theme;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, dueDate, priority, notes, emoji, completed, onToggle, theme }) => {
  const common = getCommonStyles(theme);
  return (
    <View style={[common.card, localStyles.container, { borderColor: theme.border }]}>
      <TouchableOpacity
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: !!completed }}
        style={[
          localStyles.checkbox,
          { borderColor: theme.primary, backgroundColor: completed ? theme.primary : 'transparent' },
        ]}
      >
        <Text style={[localStyles.checkboxText, { color: completed ? '#fff' : theme.primary }]}>{completed ? '✔' : ''}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[localStyles.content, completed && localStyles.completed]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={localStyles.header}>
          <View style={localStyles.titleRow}>
            {emoji ? <Text style={localStyles.emoji}>{emoji}</Text> : null}
            <Text style={[common.text, localStyles.title, completed && localStyles.completedText]} numberOfLines={2}>
              {title}
            </Text>
          </View>

          <Text style={[localStyles.priority, localStyles[priority]]}>{priority.toUpperCase()}</Text>
        </View>

        <Text style={[localStyles.dueDate, common.text]}>Due: {dueDate}</Text>
        {notes ? <Text style={[localStyles.notes, common.text]}>{notes}</Text> : null}
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  completed: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  dueDate: {
    fontSize: 12,
    marginTop: 4,
  },
  notes: {
    fontSize: 14,
    marginTop: 4,
  },
  priority: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#fff',
    overflow: 'hidden',
  },
  high: {
    backgroundColor: '#e53935',
  },
  medium: {
    backgroundColor: '#fbc02d',
  },
  low: {
    backgroundColor: '#43a047',
  },
});

export default TaskItem;

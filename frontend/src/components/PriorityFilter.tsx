
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../types/theme';
import { getCommonStyles } from '../styles/themeStyles';

interface PriorityFilterProps {
  value: 'all' | 'high' | 'medium' | 'low';
  onChange: (priority: 'all' | 'high' | 'medium' | 'low') => void;
  theme: Theme;
}

const priorities: Array<{ label: string; value: 'all' | 'high' | 'medium' | 'low' }> = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];


const PriorityFilter: React.FC<PriorityFilterProps> = ({ value, onChange, theme }) => {
  const common = getCommonStyles(theme);
  return (
    <View style={localStyles.container}>
      {priorities.map((p) => (
        <TouchableOpacity
          key={p.value}
          style={[localStyles.button, value === p.value ? { backgroundColor: theme.primary } : { backgroundColor: theme.lightBg }]}
          onPress={() => onChange(p.value)}
          accessibilityRole="button"
          accessibilityState={{ selected: value === p.value }}
        >
          <Text style={[common.text, localStyles.text, value === p.value && { color: '#fff' }]}>{p.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  text: {
    fontWeight: 'bold',
  },
});

export default PriorityFilter;

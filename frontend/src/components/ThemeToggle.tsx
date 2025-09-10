import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../types/theme';

interface ThemeToggleProps {
  onToggle: () => void;
  theme: Theme;
  currentTheme?: 'light' | 'dark';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle, theme, currentTheme }) => (
  <TouchableOpacity
    onPress={onToggle}
    accessibilityLabel="Toggle theme"
    style={[styles.toggleBtn, { borderColor: theme.text }]}
  >
    {currentTheme === 'light' ? (
      <Ionicons name="moon" size={22} color={theme.text} />
    ) : (
      <Ionicons name="sunny" size={22} color={theme.text} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  toggleBtn: {
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemeToggle;

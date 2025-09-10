import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../types/theme';

import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    theme: Theme;
    onToggleTheme: () => void;
    currentTheme?: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, currentTheme }) => {
    return (
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.primary }]}>PlanBuddy</Text>
            <ThemeToggle onToggle={onToggleTheme} theme={theme} currentTheme={currentTheme} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        elevation: 2,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    toggleBtn: {
        padding: 6,
        borderRadius: 20,
    },
});

export default Header;

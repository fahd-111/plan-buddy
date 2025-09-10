import React, { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Theme } from '../types/theme';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  theme: Theme;
  onToggleTheme: () => void;
  currentTheme?: 'light' | 'dark';
}

const Layout: React.FC<LayoutProps> = ({ children, theme, onToggleTheme, currentTheme }) => {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.primary }]}> 
      <Header theme={theme} onToggleTheme={onToggleTheme} currentTheme={currentTheme} />
      <View style={[styles.container, { backgroundColor: theme.background }]}> 
        {children}
      </View>
      <Footer theme={theme} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
});

export default Layout;

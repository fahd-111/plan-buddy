import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../types/theme';

interface FooterProps {
  theme: Theme;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const navigation: any = useNavigation();

  return (
    <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}> 
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Create')} accessibilityRole="button">
        <Text style={[styles.linkText, { color: theme.text }]}>Create +</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Plan')} accessibilityRole="button">
        <Text style={[styles.linkText, { color: theme.text }]}>View Plans</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  link: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Footer;

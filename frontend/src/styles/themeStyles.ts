import { StyleSheet } from 'react-native';
import { Theme } from '../types/theme';

export const getCommonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      shadowColor: theme.text,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    text: {
      color: theme.text,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
      marginVertical: 16,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 6,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.input,
      color: theme.text,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 6,
      paddingVertical: 10,
      alignItems: 'center',
      marginVertical: 8,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    error: {
      color: theme.error,
      textAlign: 'center',
      marginTop: 8,
    },
  });

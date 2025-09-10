export type ThemeType = 'light' | 'dark';

export interface Theme {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    surface: string;
    onSurface: string;
    input: string;
    placeholder: string;
    lightBg?: string;
    type?: ThemeType;
}

export const lightTheme: Theme = {
    background: '#fff',
    text: '#222',
    card: '#f8f8f8',
    border: '#e0e0e0',
    primary: '#1976d2',
    secondary: '#fbc02d',
    accent: '#43a047',
    error: '#e53935',
    surface: '#fafafa',
    onSurface: '#333',
    input: '#fafafa',
    placeholder: '#888',
    lightBg: '#f0f0f0',
    type: 'light',
};

export const darkTheme: Theme = {
    background: '#181a20',
    text: '#fff',
    card: '#23262f',
    border: '#333',
    primary: '#90caf9',
    secondary: '#ffe082',
    accent: '#81c784',
    error: '#ef9a9a',
    surface: '#23262f',
    onSurface: '#fff',
    input: '#23262f',
    placeholder: '#aaa',
    lightBg: '#2c2f36',
    type: 'dark',
};

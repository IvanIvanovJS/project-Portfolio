export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary?: string;
  accent?: string;
}

export interface Theme {
  name: 'light' | 'dark';
  colors: ThemeColors;
  glassmorphism: {
    blur: number;
    opacity: number;
    borderOpacity: number;
  };
}

export type ThemeMode = 'light' | 'dark';

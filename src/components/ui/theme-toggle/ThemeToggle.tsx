'use client';
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeContext } from '../../../providers/ThemeProvider';
import { GlassSwitcher, SwitcherOption } from '../glass-switcher';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useThemeContext();

  const themeOptions: SwitcherOption[] = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun size={18} />,
      ariaLabel: 'Switch to light mode',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon size={18} />,
      ariaLabel: 'Switch to dark mode',
    },
  ];

  return (
    <GlassSwitcher
      options={themeOptions}
      value={theme}
      onChange={(value) => setTheme(value as 'light' | 'dark')}
      className={className}
      legend="Theme selector"
    />
  );
};

export default ThemeToggle;

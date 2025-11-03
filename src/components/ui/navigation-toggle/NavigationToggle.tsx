'use client';
import React from 'react';
import { LayoutGrid, Menu } from 'lucide-react';
import { useNavigation } from '../../../providers/NavigationProvider';
import { GlassSwitcher, SwitcherOption } from '../glass-switcher';
import { NavigationMode } from '../../../providers/NavigationProvider';

interface NavigationToggleProps {
  className?: string;
}

export const NavigationToggle: React.FC<NavigationToggleProps> = ({
  className,
}) => {
  const { navigationMode, setNavigationMode } = useNavigation();

  const navigationOptions: SwitcherOption[] = [
    {
      value: 'horizontal',
      label: 'Horizontal',
      icon: <Menu size={18} />,
      ariaLabel: 'Switch to horizontal navigation',
    },
    {
      value: 'vertical',
      label: 'Vertical',
      icon: <LayoutGrid size={18} />,
      ariaLabel: 'Switch to vertical navigation',
    },
  ];

  return (
    <GlassSwitcher
      options={navigationOptions}
      value={navigationMode}
      onChange={(value) => setNavigationMode(value as NavigationMode)}
      className={className}
      legend="Navigation mode selector"
    />
  );
};

export default NavigationToggle;

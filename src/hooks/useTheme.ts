import { useThemeContext } from '../providers/ThemeProvider';

export const useTheme = () => {
  return useThemeContext();
};

export default useTheme;

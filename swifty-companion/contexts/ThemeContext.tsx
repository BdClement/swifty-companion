import { createContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';

export const ThemeContext = createContext(lightTheme);

export function ThemeProvider({ children }) {
  const scheme = useColorScheme();

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
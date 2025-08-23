import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn('useTheme must be used within a ThemeProvider. Returning default values.');
    // Return default values instead of throwing an error
    return {
      isDark: false,
      colors: {
        background: '#fff',
        surface: '#f5f5f5',
        card: '#fff',
        cardBackground: '#f5f5f5',
        text: '#111',
        textPrimary: '#111',
        textSecondary: '#666',
        textTertiary: '#9a9a9a',
        border: '#e5e5e5',
        primary: '#000',
        secondary: '#007AFF',
        success: '#0f6d00',
        danger: '#ff4444',
        warning: '#f39c12',
        disabled: '#e0e0e0',
        disabledText: '#999',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
        tabActive: '#0f6d00',
        inputBackground: '#f8f8f8',
      },
      themeMode: 'light',
      setThemeMode: () => {},
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (themeMode === 'system') {
        const systemTheme = Appearance.getColorScheme();
        setIsDark(systemTheme === 'dark');
      } else {
        setIsDark(themeMode === 'dark');
      }
    };

    updateTheme();

    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(updateTheme);
    return () => subscription?.remove();
  }, [themeMode]);

  const colors = {
    light: {
      background: '#fff',
      surface: '#f5f5f5',
      card: '#fff',
      cardBackground: '#f5f5f5',
      text: '#111',
      textPrimary: '#111',
      textSecondary: '#666',
      textTertiary: '#9a9a9a',
      border: '#e5e5e5',
      primary: '#000',
      secondary: '#007AFF',
      success: '#0f6d00',
      danger: '#ff4444',
      warning: '#f39c12',
      disabled: '#e0e0e0',
      disabledText: '#999',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      tabActive: '#0f6d00',
      inputBackground: '#f8f8f8',
    },
    dark: {
      background: '#121212',
      surface: '#1e1e1e',
      card: '#2a2a2a',
      cardBackground: '#2a2a2a',
      text: '#fff',
      textPrimary: '#fff',
      textSecondary: '#ccc',
      textTertiary: '#888',
      border: '#404040',
      primary: '#fff',
      secondary: '#64B5F6',
      success: '#4caf50',
      danger: '#f44336',
      warning: '#ff9800',
      disabled: '#404040',
      disabledText: '#666',
      modalOverlay: 'rgba(0, 0, 0, 0.7)',
      tabActive: '#4caf50',
      inputBackground: '#333',
    },
  };

  const theme = useMemo(() => ({
    isDark,
    colors: isDark ? colors.dark : colors.light,
    themeMode,
    setThemeMode,
  }), [isDark, themeMode]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

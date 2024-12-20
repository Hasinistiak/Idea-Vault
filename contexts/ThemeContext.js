import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Detect the system theme on initial load
  const systemTheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Check if there's a saved theme in AsyncStorage
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setTheme(storedTheme); // Set the saved theme
        } else {
          setTheme(systemTheme || 'light'); // Default to system theme or 'light'
        }
      } catch (error) {
        console.error('Failed to load theme from AsyncStorage:', error);
      }
    };

    loadTheme();
  }, [systemTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Save the new theme to AsyncStorage
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme to AsyncStorage:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use Theme Context
export const useTheme = () => useContext(ThemeContext);

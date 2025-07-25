// src/context/SettingsContext.js (or context/SettingsContext.js)
import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage'; // Adjust path if not in src

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('appTheme', 'light');
  const [language, setLanguage] = useLocalStorage('appLanguage', 'en');

  // Optional: Apply theme to document element for global styling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
    language,
    setLanguage,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
// src/hooks/useLocalStorage.js (or hooks/useLocalStorage.js)
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get from local storage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue; // Handle SSR case
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Effect to update local storage when the state changes
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure window is defined (client-side)
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
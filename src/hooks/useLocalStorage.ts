'use client';

import { useState, useEffect } from 'react';
import { WordData } from '@/types/vocabulary';

export function useLocalStorage(key: string, initialValue: WordData[]) {
  const [storedValue, setStoredValue] = useState<WordData[]>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Convert savedAt strings back to Date objects
        const wordsWithDates = parsed.map((word: { savedAt: string; [key: string]: unknown }) => ({
          ...word,
          savedAt: new Date(word.savedAt)
        }));
        setStoredValue(wordsWithDates);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, [key]);

  const setValue = (value: WordData[] | ((val: WordData[]) => WordData[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

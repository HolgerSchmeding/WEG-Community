"use client";

import { useState, useEffect } from 'react';

/**
 * Custom Hook für localStorage mit TypeScript-Unterstützung
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State zum Speichern des Werts
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Funktion zum Laden der Werte aus localStorage
  useEffect(() => {
    try {
      // Verhindert SSR-Probleme
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const item = window.localStorage.getItem(key);
      
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Funktion zum Setzen des Werts
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Funktionale Updates unterstützen
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Verhindert SSR-Probleme
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Funktion zum Entfernen des Werts
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue, isLoading] as const;
}

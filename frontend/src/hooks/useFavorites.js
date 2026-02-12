import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'markyt_favorites';
const MAX_FAVORITES = 20;

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((symbol) => {
    const normalizedSymbol = symbol.toUpperCase().trim();

    if (!normalizedSymbol) {
      return { success: false, error: 'Símbolo inválido' };
    }

    setFavorites((currentFavorites) => {
      if (currentFavorites.some((f) => f.symbol === normalizedSymbol)) {
        return currentFavorites;
      }

      if (currentFavorites.length >= MAX_FAVORITES) {
        return currentFavorites;
      }

      const newFavorite = {
        symbol: normalizedSymbol,
        addedAt: new Date().toISOString()
      };

      return [...currentFavorites, newFavorite];
    });

    return { success: true };
  }, []);

  const removeFavorite = useCallback((symbol) => {
    const normalizedSymbol = symbol.toUpperCase().trim();
    setFavorites((currentFavorites) => currentFavorites.filter((f) => f.symbol !== normalizedSymbol));
  }, []);

  const isFavorite = useCallback(
    (symbol) => {
      const normalizedSymbol = symbol.toUpperCase().trim();
      return favorites.some((f) => f.symbol === normalizedSymbol);
    },
    [favorites]
  );

  const toggleFavorite = useCallback((symbol) => {
    const normalizedSymbol = symbol.toUpperCase().trim();

    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((f) => f.symbol === normalizedSymbol);

      if (exists) {
        return currentFavorites.filter((f) => f.symbol !== normalizedSymbol);
      }

      if (currentFavorites.length >= MAX_FAVORITES) {
        return currentFavorites;
      }

      return [
        ...currentFavorites,
        {
          symbol: normalizedSymbol,
          addedAt: new Date().toISOString()
        }
      ];
    });

    return { success: true };
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
    isLoaded
  };
}

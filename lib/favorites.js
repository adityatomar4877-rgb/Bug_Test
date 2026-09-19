/* ============================================================
   Favorites helpers (localStorage)
   NOTE: contains intentional logical bugs (see README.md).
   ============================================================ */

import moviesData from '../data/movies.json';

const FAV_KEY = 'cineview_favorites';

export function getFavorites() {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(FAV_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveFavorites(favorites) {
  window.localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
}

// Adds a movie to favorites by its id.
// BUG 6: does not check whether the movie is already in the list,
// so the same movie can be added multiple times.
export function addFavorite(id) {
  const movie = moviesData.find(function (m) {
    return m.id === id;
  });
  if (!movie) return;

  const favorites = getFavorites();
  favorites.push(movie);
  saveFavorites(favorites);
}

// Removes a movie from favorites.
// BUG 7: compares the array index against the movie id instead of
// comparing the actual movie ids, so the wrong movie gets removed.
export function removeFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.filter(function (movie, index) {
    return index !== id;
  });
  saveFavorites(updated);
}

export function isFavorite(id) {
  return getFavorites().some(function (m) {
    return m.id === id;
  });
}

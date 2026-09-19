'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFavorites, removeFavorite } from '../../lib/favorites';

const genreEmoji = {
  Action: '💥',
  Drama: '🎭',
  Comedy: '😂',
  'Sci-Fi': '🚀',
  Horror: '👻',
  Thriller: '🔪',
  Animation: '🎨',
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(function () {
    setFavorites(getFavorites());
    setLoaded(true);
  }, []);

  const refresh = function () {
    setFavorites(getFavorites());
  };

  const handleRemove = function (id) {
    // removeFavorite contains BUG 7 (compares array index to id).
    removeFavorite(parseInt(id));
    refresh();
  };

  return (
    <section className="container" id="favorites">
      <h2>My Favorites</h2>

      {!loaded ? null : favorites.length === 0 ? (
        <p className="empty-state">
          No favorites yet. Click the heart on a movie to add it.
        </p>
      ) : (
        <div className="movie-grid">
          {favorites.map(function (movie) {
            return (
              <div className="fav-card" key={movie.id}>
                <div className="poster">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="poster-fallback">
                    <span className="emoji">
                      {genreEmoji[movie.genre] || '🎬'}
                    </span>
                  </div>
                </div>
                <div className="fav-info">
                  <h3 className="card-title">{movie.title}</h3>
                  <div className="card-meta">
                    {movie.year} &middot; {movie.genre}
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(movie.id)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ marginTop: '1.5rem' }}>
        <Link href="/" className="back-btn" style={{ display: 'inline-block' }}>
          &larr; Back to movies
        </Link>
      </p>
    </section>
  );
}

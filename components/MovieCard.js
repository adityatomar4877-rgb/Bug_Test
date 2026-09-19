'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import moviesData from '../data/movies.json';
import { addFavorite, isFavorite } from '../lib/favorites';

const genreEmoji = {
  Action: '💥',
  Drama: '🎭',
  Comedy: '😂',
  'Sci-Fi': '🚀',
  Horror: '👻',
  Thriller: '🔪',
  Animation: '🎨',
};

export default function MovieCard({ movie }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(movie.id));
  }, [movie.id]);

  const handleFavorite = () => {
    // BUG 5: passes the array index (moviesData.indexOf(movie)) instead of
    // movie.id, so the wrong movie gets added to favorites.
    addFavorite(moviesData.indexOf(movie));
    setIsFav(true);
  };

  return (
    <div className="movie-card">
      <div className="poster">
        <img
          src={movie.poster}
          alt={movie.title}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="poster-fallback">
          <span className="emoji">{genreEmoji[movie.genre] || '🎬'}</span>
          {movie.title}
        </div>
        <button
          className={'fav-btn' + (isFav ? ' active' : '')}
          onClick={handleFavorite}
          aria-label="Add to favorites"
        >
          &#9825;
        </button>
      </div>
      <div className="card-body">
        <h3 className="card-title">{movie.title}</h3>
        <div className="card-meta">
          {movie.year} &middot; {movie.genre}
        </div>
        <div className="card-rating">
          <span className="star">&#9733;</span> {movie.rating.toFixed(1)}
          <span className="reviews">{movie.reviews} reviews</span>
        </div>
        <div className="card-actions">
          <Link href={'/movies/' + movie.id} className="view-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

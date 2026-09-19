'use client';

import { useState } from 'react';
import moviesData from '../data/movies.json';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All Genres');
  const [sort, setSort] = useState('default');

  let list = moviesData; // BUG 3: a reference, not a copy.

  // Search by title
  if (search) {
    // BUG 1: case-sensitive comparison (no toLowerCase).
    list = list.filter(function (m) {
      return m.title.includes(search);
    });
  }

  // Filter by genre
  if (genre && genre !== 'All Genres') {
    list = list.filter(function (m) {
      return m.genre === genre;
    });
  }

  // Sort. When no filter is active, `list` still points at `moviesData`,
  // so list.sort() mutates the original array (BUG 3).
  if (sort !== 'default') {
    if (sort === 'rating-desc') {
      list.sort(function (a, b) {
        return b.rating - a.rating;
      });
    } else if (sort === 'rating-asc') {
      list.sort(function (a, b) {
        return a.rating - b.rating;
      });
    } else if (sort === 'year-new') {
      list.sort(function (a, b) {
        return b.year - a.year;
      });
    } else if (sort === 'year-old') {
      list.sort(function (a, b) {
        return a.year - b.year;
      });
    } else if (sort === 'title-az') {
      list.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    }
  }

  // BUG 2: selecting "All Genres" does not reset the filter, because we
  // only update the state when the value is NOT "All Genres".
  const handleGenreChange = function (e) {
    const value = e.target.value;
    if (value !== 'All Genres') {
      setGenre(value);
    }
  };

  const visible = list;

  return (
    <>
      <header className="hero" id="home">
        <h1>Find your next movie.</h1>
        <p>Explore movies, ratings and reviews from our simple movie collection.</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
      </header>

      <main className="container" id="movies">
        <div className="section-header">
          <h2>Popular Movies</h2>
          <div className="controls">
            <select value={genre} onChange={handleGenreChange}>
              <option value="All Genres">All Genres</option>
              <option value="Action">Action</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedy</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Horror">Horror</option>
              <option value="Thriller">Thriller</option>
              <option value="Animation">Animation</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Sort By</option>
              <option value="rating-desc">Rating: High &rarr; Low</option>
              <option value="rating-asc">Rating: Low &rarr; High</option>
              <option value="year-new">Year: Newest</option>
              <option value="year-old">Year: Oldest</option>
              <option value="title-az">Title: A &rarr; Z</option>
            </select>
          </div>
        </div>

        <div className="movie-grid">
          {visible.map(function (m) {
            return <MovieCard key={m.id} movie={m} />;
          })}
        </div>

        {visible.length === 0 && <p className="empty-state">No movies found.</p>}
      </main>
    </>
  );
}

'use client';

import { useState, useReducer } from 'react';
import Link from 'next/link';
import moviesData from '../../../data/movies.json';

const genreEmoji = {
  Action: '💥',
  Drama: '🎭',
  Comedy: '😂',
  'Sci-Fi': '🚀',
  Horror: '👻',
  Thriller: '🔪',
  Animation: '🎨',
};

export default function MovieDetails({ params }) {
  const [, forceRender] = useReducer(function (x) {
    return x + 1;
  }, 0);

  const [userReviews, setUserReviews] = useState([]);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [ratingMsg, setRatingMsg] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  // BUG 10: uses the id as an array index instead of looking the movie up
  // by its id, so the wrong movie can be displayed.
  const movie = moviesData[parseInt(params.id)];

  if (!movie) {
    return (
      <section className="details-section">
        <Link href="/" className="back-btn">
          &larr; Back to movies
        </Link>
        <p className="empty-state">Movie not found.</p>
      </section>
    );
  }

  const submitRating = function () {
    const newRating = parseInt(ratingValue);
    const oldAverage = movie.rating;
    // BUG 4: incorrect average calculation (ignores existing review count).
    movie.rating = (oldAverage + newRating) / 2;

    setRatingMsg('Rating submitted successfully.');
    forceRender();
  };

  const submitReview = function () {
    const text = reviewText;

    // BUG 9: no empty/whitespace validation, so empty reviews are accepted.
    movie.reviews += 2; // BUG 8: increments by 2 instead of 1.
    setUserReviews(
      userReviews.concat([
        {
          text: text,
        },
      ])
    );
    setReviewMsg('Review submitted successfully.');
    setReviewText('');
    forceRender();
  };

  return (
    <section className="details-section">
      <Link href="/" className="back-btn">
        &larr; Back to movies
      </Link>

      <div className="details-card">
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
        </div>
        <div className="details-info">
          <h2>{movie.title}</h2>
          <div className="meta">
            {movie.year} &middot; {movie.genre}
          </div>
          <div className="rating-row">
            <div className="rating-box">
              <div className="value">{movie.rating.toFixed(1)}</div>
              <div className="label">Rating</div>
            </div>
            <div className="rating-box">
              <div className="value">{movie.reviews}</div>
              <div className="label">Reviews</div>
            </div>
          </div>
          <p className="description">{movie.description}</p>

          <div className="form-group">
            <label htmlFor="ratingInput">Your rating (1-5)</label>
            <select
              id="ratingInput"
              value={ratingValue}
              onChange={(e) => setRatingValue(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </div>
          <button className="submit-btn" onClick={submitRating}>
            Submit Rating
          </button>
          <div className="message" id="ratingMessage">
            {ratingMsg}
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label htmlFor="reviewInput">Write your review...</label>
            <textarea
              id="reviewInput"
              rows={3}
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          <button className="submit-btn" onClick={submitReview}>
            Submit Review
          </button>
          <div className="message" id="reviewMessage">
            {reviewMsg}
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h3>User Reviews</h3>
        {userReviews.length === 0 ? (
          <p className="empty-state">No reviews yet. Be the first!</p>
        ) : (
          userReviews.map(function (r, i) {
            return (
              <div className="review-item" key={i}>
                <div className="review-meta">User review</div>
                <p>{r.text}</p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

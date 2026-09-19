# CineView (Next.js)

A simple movie review website built with **Next.js (App Router)**, React, and
CSS. The movie data is imported directly from a local JSON file.

> Discover. Review. Rate.

## Features

- Movie browsing
- Search movies by title
- Genre filtering
- Sorting (rating, year, title)
- Movie details page
- Ratings (1–5)
- Reviews
- Favorites (saved with localStorage)

## Technologies

- Next.js (App Router)
- React
- CSS
- JSON
- LocalStorage

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Project Structure

```text
cineview-next/
├── app/
│   ├── layout.js            # Root layout + navbar + fonts
│   ├── globals.css          # All styles
│   ├── page.js              # Home (search / filter / sort / grid)
│   ├── movies/[id]/page.js  # Movie details (rating + review)
│   └── favorites/page.js    # Favorites list
├── components/
│   ├── Navbar.js
│   └── MovieCard.js
├── lib/
│   └── favorites.js         # localStorage helpers
├── data/
│   └── movies.json          # Movie database (imported directly)
├── package.json
└── next.config.mjs
```

---

# Bug Documentation

This project contains **10 intentional logical bugs** for debugging practice.
The application still loads and runs — the bugs are realistic programming
mistakes, not syntax errors.

| #  | Bug                   | Problem                                   | Expected Behavior                   | Fix                    |
| -- | --------------------- | ----------------------------------------- | ----------------------------------- | ---------------------- |
| 1  | Case-sensitive search | Search fails for different capitalization | Search should ignore capitalization | Normalize both strings  |
| 2  | Genre reset           | "All Genres" does not properly reset       | Show all movies                     | Reset the genre filter  |
| 3  | Array mutation        | Sorting changes the original data          | Preserve original movie list        | Sort a copy of the list |
| 4  | Rating calculation    | Average is calculated incorrectly          | Correct weighted average            | Fix the calculation     |
| 5  | Wrong favorite ID     | Wrong movie gets favorited                 | Favorite the clicked movie          | Use the correct movie ID |
| 6  | Duplicate favorites   | Same movie can appear multiple times       | One entry per movie                 | Check before adding     |
| 7  | Wrong removal         | Incorrect movie is removed                 | Remove the selected movie           | Compare actual movie IDs |
| 8  | Review count          | Count increases incorrectly                | Increase by 1                       | Increment once          |
| 9  | Empty reviews         | Empty reviews are accepted                 | Reject empty reviews                | Validate the input      |
| 10 | Wrong movie details   | Incorrect movie can open                   | Open the selected movie             | Use the movie ID correctly |

---

## Bug Details

For every bug you will find below:

- **Bug** – what is wrong
- **Why it happens** – the code mistake that causes it
- **How to reproduce it** – steps to see the bug
- **How to fix it** – the expected correction

### Bug 1 — Case-sensitive search

- **Bug:** Searching for `"inception"` does not find the movie `"Inception"`.
- **Why it happens:** In `app/page.js` the search filters with
  `m.title.includes(search)` without normalizing the case of either string.
- **How to reproduce it:** Type `inception` (lowercase) in the search box. No
  results appear even though `Inception` exists.
- **How to fix it:** Convert both strings to the same case, e.g.
  `m.title.toLowerCase().includes(search.toLowerCase())`.

### Bug 2 — Genre filter does not reset

- **Bug:** After selecting a genre, choosing `All Genres` keeps the previous
  genre filter applied.
- **Why it happens:** In `app/page.js`, `handleGenreChange` only calls
  `setGenre(value)` when `value` is **not** `All Genres`. When `All Genres` is
  selected the state keeps its previous value, so the filter stays active.
- **How to reproduce it:** Select `Sci-Fi`, then select `All Genres`. The grid
  still only shows Sci-Fi movies while the dropdown shows `All Genres`.
- **How to fix it:** Reset the filter when `All Genres` is selected, e.g. add an
  `else { setGenre('All Genres'); }` branch (or just `setGenre(value);`).

### Bug 3 — Sorting mutates the original movie array

- **Bug:** Sorting permanently changes the order of the imported `moviesData`
  array, so later operations behave unexpectedly (the original order is lost).
- **Why it happens:** `app/page.js` starts with `let list = moviesData;` (a
  reference, not a copy). When no search/genre filter is active, `list` and
  `moviesData` point to the same array, so `list.sort(...)` mutates the
  original imported JSON.
- **How to reproduce it:** Sort by `Rating: High → Low`, then change the sort
  back to `Sort By` (default). The movies stay in rating order instead of
  returning to their original order.
- **How to fix it:** Work on a copy, e.g. `let list = [...moviesData];`.

### Bug 4 — Rating average calculation is incorrect

- **Bug:** Submitting a rating produces a wrong new average.
- **Why it happens:** In `app/movies/[id]/page.js`, `submitRating` computes
  `(oldAverage + newRating) / 2`, a simple average that ignores how many
  ratings already exist.
- **How to reproduce it:** Open a movie with rating `8.8` and `245` reviews,
  submit a rating of `5`. The average drops to `(8.8 + 5) / 2 = 6.9`, which is
  far too low for a movie with 245 existing reviews.
- **How to fix it:** Use the weighted average:
  `(oldAverage * oldCount + newRating) / (oldCount + 1)`.

### Bug 5 — Favorite button uses the wrong movie ID

- **Bug:** Clicking the favorite (heart) button on a movie favorites the wrong
  movie (or none).
- **Why it happens:** In `components/MovieCard.js`, the favorite button calls
  `addFavorite(moviesData.indexOf(movie))`, passing the array **index** instead
  of `movie.id`. `addFavorite` (in `lib/favorites.js`) then looks the movie up
  by `id`, so it finds a different movie (the one whose `id` equals the index).
  The first movie's index is `0`, and no movie has `id` `0`, so it cannot be
  favorited at all.
- **How to reproduce it:** Click the heart on `The Dark Knight` (2nd movie). It
  adds `Inception` (the previous movie) to Favorites instead.
- **How to fix it:** Pass the real id: `addFavorite(movie.id)`.

### Bug 6 — Favorites can contain duplicates

- **Bug:** The same movie can appear multiple times in Favorites.
- **Why it happens:** `addFavorite` in `lib/favorites.js` does
  `favorites.push(movie)` without first checking whether it is already there.
- **How to reproduce it:** Click the heart on the same movie twice (or more).
  The movie is added again each time and shows up multiple times on the
  Favorites page.
- **How to fix it:** Check `isFavorite(id)` before pushing, e.g.
  `if (isFavorite(id)) return;`.

### Bug 7 — Removing a favorite removes the wrong movie

- **Bug:** Clicking `Remove` on a favorite can remove a different favorite, or
  fail to remove anything.
- **Why it happens:** `removeFavorite` in `lib/favorites.js` filters with
  `index !== id`, comparing the array **index** against the movie **id**, instead
  of comparing the actual movie ids.
- **How to reproduce it:** Add two different movies to Favorites. Click
  `Remove` on the first one — the second one disappears (because it sits at
  index `1`, matching the first movie's `id` of `1`).
- **How to fix it:** Compare against the movie id:
  `favorites.filter((m) => m.id !== id)`.

### Bug 8 — Review count increases incorrectly

- **Bug:** Submitting a review increases the review count by `2` instead of
  `1`.
- **Why it happens:** In `app/movies/[id]/page.js`, `submitReview` does
  `movie.reviews += 2`.
- **How to reproduce it:** Note a movie's review count, open its details, and
  submit a review. The count goes up by `2`.
- **How to fix it:** Increment by one: `movie.reviews += 1;` (or
  `movie.reviews++`).

### Bug 9 — Empty review can be submitted

- **Bug:** A blank review (or one with only spaces) is accepted and saved.
- **Why it happens:** `submitReview` never validates the review text before
  adding it.
- **How to reproduce it:** Open a movie, leave the review box empty, and click
  `Submit Review`. It says "Review submitted successfully." and adds an empty
  review.
- **How to fix it:** Validate before saving, e.g.
  ```js
  if (!reviewText || reviewText.trim() === '') {
    setReviewMsg('Please write a review before submitting.');
    return;
  }
  ```

### Bug 10 — Movie details can display the wrong movie

- **Bug:** Opening a movie's details can show the wrong movie.
- **Why it happens:** In `app/movies/[id]/page.js`, the movie is retrieved with
  `moviesData[parseInt(params.id)]`, treating the movie **id** as an array
  **index**. The route passes the real `movie.id`, so for `id` `1` it returns
  `moviesData[1]` (the 2nd movie). For the last movie (`id` `15`) it returns
  `undefined` and shows "Movie not found."
- **How to reproduce it:** Click `View Details` on `Inception` (id 1). The
  details page shows `The Dark Knight` instead. Click it on the last movie and
  you get "Movie not found."
- **How to fix it:** Look up by id:
  `moviesData.find((m) => m.id === parseInt(params.id))`.

---

## Disclaimer

These bugs are intentional and meant for learning. Once you fix all 10, the
website should behave as described in the "Expected Behavior" column.

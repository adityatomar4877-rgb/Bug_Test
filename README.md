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

- Next.js (App Router) `14.2.x`
- React `18`
- CSS
- JSON
- LocalStorage

## Getting Started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000> (or the port shown in your terminal).

## Project Structure

```text
cineview-next/
├── app/
│   ├── layout.js              # Root layout + navbar + fonts
│   ├── globals.css            # All styles
│   ├── page.js                # Home (search / filter / sort / grid)        ← Bugs 1, 2, 3
│   ├── movies/[id]/page.js    # Movie details (rating + review)            ← Bugs 4, 8, 9, 10
│   └── favorites/page.js      # Favorites list
├── components/
│   ├── Navbar.js
│   └── MovieCard.js           # Movie card + favorite button               ← Bug 5
├── lib/
│   └── favorites.js           # localStorage helpers                      ← Bugs 6, 7
├── data/
│   └── movies.json            # Movie database (imported directly)
├── package.json
└── next.config.mjs
```

---

# Bug Documentation

This project contains **10 intentional logical bugs** for debugging practice.
The application still loads and runs — the bugs are realistic programming
mistakes, not syntax errors.

Below is a quick-reference table, followed by a detailed per-bug section that
tells you **exactly which file and line to open** and **exactly how to fix it**.

## Quick Reference

| #  | Bug                   | File                          | Line  | Problem                                   | Expected Behavior                   | Fix                    |
| -- | --------------------- | ----------------------------- | ----- | ----------------------------------------- | ----------------------------------- | ---------------------- |
| 1  | Case-sensitive search | `app/page.js`                 | 18    | Search fails for different capitalization | Search should ignore capitalization | Normalize both strings |
| 2  | Genre reset           | `app/page.js`                 | 59    | "All Genres" does not properly reset       | Show all movies                     | Reset the genre filter |
| 3  | Array mutation        | `app/page.js`                 | 12    | Sorting changes the original data          | Preserve original movie list        | Sort a copy of the list |
| 4  | Rating calculation    | `app/movies/[id]/page.js`     | 47    | Average is calculated incorrectly          | Correct weighted average            | Fix the calculation |
| 5  | Wrong favorite ID     | `components/MovieCard.js`     | 28    | Wrong movie gets favorited                 | Favorite the clicked movie          | Use the correct movie ID |
| 6  | Duplicate favorites   | `lib/favorites.js`            | 30    | Same movie can appear multiple times       | One entry per movie                 | Check before adding |
| 7  | Wrong removal         | `lib/favorites.js`            | 40    | Incorrect movie is removed                 | Remove the selected movie           | Compare actual movie IDs |
| 8  | Review count          | `app/movies/[id]/page.js`     | 57    | Count increases incorrectly                | Increase by 1                       | Increment once |
| 9  | Empty reviews         | `app/movies/[id]/page.js`     | 53–68 | Empty reviews are accepted                 | Reject empty reviews                | Validate the input |
| 10 | Wrong movie details   | `app/movies/[id]/page.js`     | 30    | Incorrect movie can open                   | Open the selected movie             | Use the movie ID correctly |

> **Line numbers** refer to the original buggy files. If you edit a file above a
> bug, the line numbers below it may shift — match by the code snippet shown.

---

## Detailed Bug Fixes

For every bug:

- **Bug** – what is wrong
- **Why it happens** – the code mistake that causes it
- **Where** – the exact file and line to open
- **Buggy code** – the line(s) to find
- **Fix** – the corrected code to replace it with
- **How to reproduce it** – steps to see the bug

---

### Bug 1 — Case-sensitive search

- **Bug:** Searching for `inception` does not find the movie `Inception`.
- **Why it happens:** The search compares the movie title with the search term
  without normalizing the case of either string.
- **Where:** `app/page.js`, line **18** (inside the `if (search)` filter block).
- **Buggy code:**
  ```js
  // app/page.js  (line 17–18)
  list = list.filter(function (m) {
    return m.title.includes(search);          // ← BUG 1
  });
  ```
- **Fix:** Convert both strings to the same case before comparing.
  ```js
  list = list.filter(function (m) {
    return m.title.toLowerCase().includes(search.toLowerCase());   // ✅ FIX 1
  });
  ```
- **How to reproduce it:** Type `inception` (lowercase) in the search box on the
  home page. No results appear even though `Inception` exists in the data.

---

### Bug 2 — Genre filter does not reset

- **Bug:** After selecting a genre, choosing `All Genres` keeps the previous
  genre filter applied.
- **Why it happens:** `handleGenreChange` only calls `setGenre(value)` when
  `value` is **not** `All Genres`. When `All Genres` is selected the state keeps
  its previous value, so the filter stays active.
- **Where:** `app/page.js`, line **59** (inside `handleGenreChange`).
- **Buggy code:**
  ```js
  // app/page.js  (line 57–62)
  const handleGenreChange = function (e) {
    const value = e.target.value;
    if (value !== 'All Genres') {              // ← BUG 2: no else branch
      setGenre(value);
    }
  };
  ```
- **Fix:** Update the state unconditionally (so `All Genres` resets the filter).
  ```js
  const handleGenreChange = function (e) {
    setGenre(e.target.value);                  // ✅ FIX 2: always update
  };
  ```
- **How to reproduce it:** Select `Sci-Fi`, then select `All Genres`. The grid
  still only shows Sci-Fi movies while the dropdown shows `All Genres`.

---

### Bug 3 — Sorting mutates the original movie array

- **Bug:** Sorting permanently changes the order of the imported `moviesData`
  array, so later operations behave unexpectedly (the original order is lost).
- **Why it happens:** `let list = moviesData;` is a **reference**, not a copy.
  When no search/genre filter is active, `list` and `moviesData` point to the
  same array, so `list.sort(...)` mutates the original imported JSON.
- **Where:** `app/page.js`, line **12**.
- **Buggy code:**
  ```js
  // app/page.js  (line 12)
  let list = moviesData;                       // ← BUG 3: reference, not a copy
  ```
- **Fix:** Work on a copy so the original is preserved.
  ```js
  let list = [...moviesData];                  // ✅ FIX 3: copy the array
  ```
- **How to reproduce it:** Sort by `Rating: High → Low`, then change the sort
  back to `Sort By` (default). The movies stay in rating order instead of
  returning to their original order.

---

### Bug 4 — Rating average calculation is incorrect

- **Bug:** Submitting a rating produces a wrong new average.
- **Why it happens:** `submitRating` computes a simple average
  `(oldAverage + newRating) / 2`, which ignores how many ratings already exist.
- **Where:** `app/movies/[id]/page.js`, line **47** (inside `submitRating`).
- **Buggy code:**
  ```js
  // app/movies/[id]/page.js  (line 43–47)
  const submitRating = function () {
    const newRating = parseInt(ratingValue);
    const oldAverage = movie.rating;
    movie.rating = (oldAverage + newRating) / 2;   // ← BUG 4
  ```
- **Fix:** Use the weighted average formula
  `(oldAverage × oldCount + newRating) / (oldCount + 1)`. The existing review
  count (`movie.reviews`) represents the number of prior ratings.
  ```js
  const submitRating = function () {
    const newRating = parseInt(ratingValue);
    const oldAverage = movie.rating;
    const oldCount = movie.reviews;
    movie.rating = (oldAverage * oldCount + newRating) / (oldCount + 1); // ✅ FIX 4
  ```
- **How to reproduce it:** Open a movie with rating `8.8` and `245` reviews,
  submit a rating of `5`. The average drops to `(8.8 + 5) / 2 = 6.9`, which is
  far too low for a movie with 245 existing reviews.

---

### Bug 5 — Favorite button uses the wrong movie ID

- **Bug:** Clicking the favorite (heart) button on a movie favorites the wrong
  movie (or none at all).
- **Why it happens:** The favorite button calls
  `addFavorite(moviesData.indexOf(movie))`, passing the array **index** instead
  of `movie.id`. `addFavorite` (in `lib/favorites.js`) looks the movie up by
  `id`, so it finds a different movie (the one whose `id` equals the index).
  The first movie's index is `0`, and no movie has `id` `0`, so it cannot be
  favorited at all.
- **Where:** `components/MovieCard.js`, line **28** (inside `handleFavorite`).
- **Buggy code:**
  ```js
  // components/MovieCard.js  (line 25–28)
  const handleFavorite = () => {
    addFavorite(moviesData.indexOf(movie));    // ← BUG 5: index, not id
    setIsFav(true);
  };
  ```
- **Fix:** Pass the real movie id.
  ```js
  const handleFavorite = () => {
    addFavorite(movie.id);                     // ✅ FIX 5: use the real id
    setIsFav(true);
  };
  ```
- **How to reproduce it:** Click the heart on `The Dark Knight` (the 2nd movie
  in the list, array index `1`). It adds `Inception` (whose `id` is `1`) to
  Favorites instead. Click the heart on the very first movie — nothing is added.

---

### Bug 6 — Favorites can contain duplicates

- **Bug:** The same movie can appear multiple times in Favorites.
- **Why it happens:** `addFavorite` pushes the movie into the `favorites` array
  without first checking whether it is already there.
- **Where:** `lib/favorites.js`, line **30** (inside `addFavorite`).
- **Buggy code:**
  ```js
  // lib/favorites.js  (line 23–31)
  export function addFavorite(id) {
    const movie = moviesData.find(function (m) {
      return m.id === id;
    });
    if (!movie) return;

    const favorites = getFavorites();
    favorites.push(movie);                     // ← BUG 6: no duplicate check
    saveFavorites(favorites);
  }
  ```
- **Fix:** Check `isFavorite(id)` before pushing.
  ```js
  export function addFavorite(id) {
    const movie = moviesData.find(function (m) {
      return m.id === id;
    });
    if (!movie) return;

    if (isFavorite(id)) return;                 // ✅ FIX 6: skip duplicates
    const favorites = getFavorites();
    favorites.push(movie);
    saveFavorites(favorites);
  }
  ```
- **How to reproduce it:** Click the heart on the same movie twice (or more).
  The movie is added again each time and shows up multiple times on the
  `/favorites` page.

---

### Bug 7 — Removing a favorite removes the wrong movie

- **Bug:** Clicking `Remove` on a favorite can remove a different favorite, or
  fail to remove anything.
- **Why it happens:** `removeFavorite` filters with `index !== id`, comparing
  the array **index** against the movie **id**, instead of comparing the actual
  movie ids.
- **Where:** `lib/favorites.js`, line **40** (inside `removeFavorite`).
- **Buggy code:**
  ```js
  // lib/favorites.js  (line 37–42)
  export function removeFavorite(id) {
    const favorites = getFavorites();
    const updated = favorites.filter(function (movie, index) {
      return index !== id;                      // ← BUG 7: index vs id
    });
    saveFavorites(updated);
  }
  ```
- **Fix:** Compare against the actual movie id.
  ```js
  export function removeFavorite(id) {
    const favorites = getFavorites();
    const updated = favorites.filter(function (movie) {
      return movie.id !== id;                   // ✅ FIX 7: compare ids
    });
    saveFavorites(updated);
  }
  ```
- **How to reproduce it:** Add two different movies to Favorites (e.g. `Inception`
  with id `1` and `The Dark Knight` with id `2`). Click `Remove` on the first
  one — the **second** one disappears instead, because it sits at array index
  `1` (matching the first movie's `id` of `1`).

---

### Bug 8 — Review count increases incorrectly

- **Bug:** Submitting a review increases the review count by `2` instead of
  `1`.
- **Why it happens:** `submitReview` does `movie.reviews += 2`.
- **Where:** `app/movies/[id]/page.js`, line **57** (inside `submitReview`).
- **Buggy code:**
  ```js
  // app/movies/[id]/page.js  (line 57)
  movie.reviews += 2;                           // ← BUG 8: +2 instead of +1
  ```
- **Fix:** Increment by one.
  ```js
  movie.reviews += 1;                           // ✅ FIX 8: increment by 1
  ```
- **How to reproduce it:** Note a movie's review count (shown on its card and at
  the top of its details page), open its details, and submit a review. The
  count goes up by `2`.

---

### Bug 9 — Empty review can be submitted

- **Bug:** A blank review (or one with only spaces) is accepted and saved.
- **Why it happens:** `submitReview` never validates the review text before
  adding it.
- **Where:** `app/movies/[id]/page.js`, lines **53–68** (the whole
  `submitReview` function — the validation is *missing*).
- **Buggy code:**
  ```js
  // app/movies/[id]/page.js  (line 53–68)
  const submitReview = function () {
    const text = reviewText;
                                                // ← BUG 9: no validation here
    movie.reviews += 2;
    setUserReviews(
      userReviews.concat([{ text: text }])
    );
    setReviewMsg('Review submitted successfully.');
    setReviewText('');
    forceRender();
  };
  ```
- **Fix:** Validate before saving; reject empty or whitespace-only reviews and
  show the required message.
  ```js
  const submitReview = function () {
    const text = reviewText;

    if (!text || text.trim() === '') {           // ✅ FIX 9: validate input
      setReviewMsg('Please write a review before submitting.');
      return;
    }

    movie.reviews += 1;
    setUserReviews(
      userReviews.concat([{ text: text }])
    );
    setReviewMsg('Review submitted successfully.');
    setReviewText('');
    forceRender();
  };
  ```
- **How to reproduce it:** Open a movie, leave the review box completely empty,
  and click `Submit Review`. It says "Review submitted successfully." and adds
  an empty review to the list.

---

### Bug 10 — Movie details can display the wrong movie

- **Bug:** Opening a movie's details can show the wrong movie.
- **Why it happens:** The movie is retrieved with
  `moviesData[parseInt(params.id)]`, treating the movie **id** as an array
  **index**. The route passes the real `movie.id`, so for `id` `1` it returns
  `moviesData[1]` (the 2nd movie). For the last movie (`id` `15`) it returns
  `undefined` and shows "Movie not found."
- **Where:** `app/movies/[id]/page.js`, line **30** (top of `MovieDetails`).
- **Buggy code:**
  ```js
  // app/movies/[id]/page.js  (line 30)
  const movie = moviesData[parseInt(params.id)]; // ← BUG 10: id used as index
  ```
- **Fix:** Look the movie up by its id using `.find(...)`.
  ```js
  const movie = moviesData.find(function (m) {
    return m.id === parseInt(params.id);        // ✅ FIX 10: find by id
  });
  ```
- **How to reproduce it:** Click `View Details` on `Inception` (id `1`). The
  details page shows `The Dark Knight` instead. Click `View Details` on the
  last movie (id `15`) — you get "Movie not found."

---

## Fix Order Suggestion

Some bugs interact, so fixing them in this order avoids confusion:

1. **Bug 3** (array copy) — fix first so sorting doesn't interfere with other
   tests.
2. **Bug 10** (details lookup by id) — fix next so you can trust the details
   page while testing the rating/review bugs.
3. **Bug 5** (favorite id) — fix before bugs 6 & 7, since the wrong id makes
   the favorites bugs hard to reproduce cleanly.
4. **Bug 6** (duplicate favorites) and **Bug 7** (wrong removal) — fix together
   in `lib/favorites.js`.
5. **Bug 4** (rating calc), **Bug 8** (review count), **Bug 9** (empty review) —
   all live in `submitRating` / `submitReview`.
6. **Bug 1** (search case) and **Bug 2** (genre reset) — independent, easy
   wins to finish.

---

## Disclaimer

These bugs are intentional and meant for learning. Once you fix all 10, the
website should behave as described in the "Expected Behavior" column.

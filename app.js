const OMDB_API_KEY = '9b5bb831'


const input = document.getElementById('searchInput')
const btn = document.getElementById('searchBtn')
const resultsEl = document.getElementById('results')
const filterEl = document.getElementById('filter')

let currentMovies = []

function getSortedMovies(list, sortOrder) {
  const movies = [...list]
  if (sortOrder === 'az') {
    movies.sort((a, b) => a.Title.localeCompare(b.Title))
  } else if (sortOrder === 'za') {
    movies.sort((a, b) => b.Title.localeCompare(a.Title))
  }
  return movies
}

function renderMovies(list) {
  if (!list || list.length === 0) {
    resultsEl.innerHTML = '<p class="empty">No results found.</p>'
    return
  }
  resultsEl.innerHTML = list
    .map((m) => {
      const poster = m.Poster && m.Poster !== 'N/A' ? m.Poster : ''
      return `
        <article class="movie-card">
          <div class="poster">${poster ? `<img src="${poster}" alt="${m.Title}">` : '<div class="no-poster">No Image</div>'}</div>
          <h3 class="title">${m.Title}</h3>
          <p class="meta">${m.Year} · ${m.Type}</p>
          <a class="imdb" href="https://www.imdb.com/title/${m.imdbID}/" target="_blank" rel="noopener">View on IMDb</a>
        </article>
      `
    })
    .join('')
}

async function search(query) {
  if (!query || query.trim() === '') {
    resultsEl.innerHTML = '<p class="empty">Enter a search term above.</p>'
    return
  }
  resultsEl.innerHTML = '<p class="loading">Loading…</p>'
  try {
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`
    const res = await fetch(url)
    const data = await res.json()
    if (data.Response === 'True') {
      currentMovies = data.Search
      const sorted = getSortedMovies(currentMovies, filterEl.value)
      renderMovies(sorted)
    } else {
      resultsEl.innerHTML = `<p class="empty">${data.Error || 'No results'}</p>`
    }
  } catch (err) {
    resultsEl.innerHTML = '<p class="error">Failed to load results.</p>'
  }
}

btn.addEventListener('click', () => search(input.value))
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') search(input.value)
})
filterEl.addEventListener('change', () => {
  const sorted = getSortedMovies(currentMovies, filterEl.value)
  renderMovies(sorted)
})

// Initial demo search
search('Batman')

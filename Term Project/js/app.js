// ===== GLOBAL VARIABLES =====
const apiKey = "c3fa69d0d5078ebcf691a99e3e4c626e";
const imageBase = "https://image.tmdb.org/t/p/w500";
let sessionId = localStorage.getItem('tmdb_session_id');
let accountId = localStorage.getItem('tmdb_account_id');

let currentPage = 1;
let currentMode = 'popular';
let currentQuery = '';
let currentGenre = '';

$(document).ready(function () {

  loadPopularMovies();

  // View Toggle
  $('#gridViewBtn').click(() => {
    $('#results').removeClass('list-view').addClass('grid-view');
  });

  $('#listViewBtn').click(() => {
    $('#results').removeClass('grid-view').addClass('list-view');
  });

  // Load popular movies
  function loadPopularMovies(page = 1) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
    currentMode = 'popular';
    currentPage = page;
    $.getJSON(url, displayMovies);
  }

  // Search
  function searchMovies(query, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
    currentMode = 'search';
    currentQuery = query;
    currentPage = page;
    $.getJSON(url, displayMovies);
  }

  // Discover by genre
  function discoverByGenre(genreId, page = 1) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}`;
    currentMode = 'genre';
    currentGenre = genreId;
    currentPage = page;
    $.getJSON(url, displayMovies);
  }

  // Display results
  function displayMovies(data) {
    $('#results').empty();

    if (data.results.length > 0) {
      data.results.forEach(movie => {
        const poster = movie.poster_path
          ? `${imageBase}${movie.poster_path}`
          : "https://via.placeholder.com/200x300?text=No+Image";

        const movieCard = `
          <div class="movie-card" data-id="${movie.id}">
            <img src="${poster}" alt="${movie.title}" class="movie-poster" />
            <h3>${movie.title}</h3>
            <p>Release: ${movie.release_date || "N/A"}</p>
          </div>
        `;
        $('#results').append(movieCard);
      });
      $('#currentPage').text(`Page ${currentPage}`);
    } else {
      $('#results').html("<p>No movies found.</p>");
    }
  }

  // Paging
  $('#nextPageBtn').click(() => {
    const nextPage = currentPage + 1;
    if (currentMode === 'popular') {
      loadPopularMovies(nextPage);
    } else if (currentMode === 'search') {
      searchMovies(currentQuery, nextPage);
    } else if (currentMode === 'genre') {
      discoverByGenre(currentGenre, nextPage);
    }
  });

  $('#prevPageBtn').click(() => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      if (currentMode === 'popular') {
        loadPopularMovies(prevPage);
      } else if (currentMode === 'search') {
        searchMovies(currentQuery, prevPage);
      } else if (currentMode === 'genre') {
        discoverByGenre(currentGenre, prevPage);
      }
    }
  });

  // Search buttons
  $('#searchBtn').click(() => {
    const query = $('#searchInput').val().trim();
    if (query) {
      searchMovies(query);
    }
  });

  $('#genreBtn').click(() => {
    const genreId = $('#genreSelect').val();
    if (genreId) {
      discoverByGenre(genreId);
    }
  });

$('#results').on('click', '.movie-card', function () {
  const movieId = $(this).data('id');
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

  $.getJSON(url, function (movie) {
    const poster = movie.poster_path
      ? `${imageBase}${movie.poster_path}`
      : "https://via.placeholder.com/200x300?text=No+Image";

    const genres = movie.genres.map(g => g.name).join(", ");

    // Base info for all movies
    let html = `
      <h2>${movie.title}</h2>
      <img src="${poster}" class="movie-poster" style="width:150px;" />
      <p><strong>Release Date:</strong> ${movie.release_date}</p>
      <p><strong>Rating:</strong> ${movie.vote_average}</p>
      <p><strong>Genres:</strong> ${genres}</p>
      <p><strong>Overview:</strong> ${movie.overview}</p>

      <!-- ✅ Buttons for ALL movies -->
      <button onclick="updateList(${movieId}, 'favorite', true)">Add to Favorites</button>
      <button onclick="updateList(${movieId}, 'watchlist', true)">Add to Watchlist</button>
    `;

    // ✅ Only Superman gets extra cast & reviews
    if (movieId == 1061474) {
      html += `
        <div id="superman-cast" style="margin-top:10px;"></div>
        <div id="superman-reviews" style="margin-top:10px;"></div>
        <div id="superman-actor-details" style="margin-top:10px;"></div>
      `;

      // Load cast
      $.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`, data => {
        const castHtml = data.cast.slice(0, 5).map(actor => `
          <li onclick="showPersonDetails(${actor.id})" style="cursor:pointer;">
            ${actor.name} as ${actor.character}
          </li>
        `).join('');
        $('#superman-cast').html(`<h3>Cast</h3><ul>${castHtml}</ul>`);
      });

      // Load reviews
      $.get(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${apiKey}`, data => {
        const reviewsHtml = data.results.slice(0, 3).map(r => `
          <blockquote>${r.content}<footer>- ${r.author}</footer></blockquote>
        `).join('');
        $('#superman-reviews').html(`<h3>Reviews</h3>${reviewsHtml}`);
      });
    }

    $('#movieDetails').html(html);
    $('#movieModal').fadeIn();
  });
});




  // Close modal
  $('.close').click(() => {
    $('#movieModal').fadeOut();
  });
  $('#movieModal').click(function (e) {
    if (e.target === this) {
      $(this).fadeOut();
    }
  });

  // Auth and favorites/watchlist initialization
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('approved') && !sessionId) {
    createSession();
  }

  if (!sessionId) {
    $("#auth-btn").show().click(authenticateUser);
  } else {
    $("#auth-btn").hide();
    loadUserMovies('favorites');
    loadUserMovies('watchlist');
  }
});

// ===== AUTH / LIST FUNCTIONS =====
function authenticateUser() {
  $.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`, data => {
    window.location.href = `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${window.location.href}`;
    localStorage.setItem('request_token', data.request_token);
  });
}

function createSession() {
  const token = localStorage.getItem('request_token');
  if (!token) return;
  $.ajax({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`,
    method: 'POST',
    data: JSON.stringify({ request_token: token }),
    contentType: 'application/json;charset=utf-8',
    success: data => {
      localStorage.setItem('tmdb_session_id', data.session_id);
      sessionId = data.session_id; // update global
      getAccountId(data.session_id);
    }
  });
}

function getAccountId(session_id) {
  $.get(`https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${session_id}`, data => {
    localStorage.setItem('tmdb_account_id', data.id);
    accountId = data.id; // update global
    location.reload();
  });
}

function updateList(movieId, listType, status) {
  $.ajax({
    url: `https://api.themoviedb.org/3/account/${accountId}/${listType}?api_key=${apiKey}&session_id=${sessionId}`,
    method: 'POST',
    data: JSON.stringify({
      media_type: 'movie',
      media_id: movieId,
      [listType === 'favorite' ? 'favorite' : 'watchlist']: status
    }),
    contentType: 'application/json;charset=utf-8',
    success: () => {
      if (listType === 'favorite') {
        alert(`${status ? 'Added to' : 'Removed from'} your favorites`);
      } else {
        alert(`${status ? 'Added to' : 'Removed from'} your watchlist`);
      }
      loadUserMovies(listType);
    }
  });
}

function loadUserMovies(listType) {
  $.get(`https://api.themoviedb.org/3/account/${accountId}/${listType}/movies?api_key=${apiKey}&session_id=${sessionId}`, data => {
    const html = data.results.map(m => `
      <li>
        ${m.title}
        <button onclick="updateList(${m.id}, '${listType}', false)">Remove</button>
      </li>
    `).join('');
    $(`#${listType}-movies`).html(`<ul>${html}</ul>`);
  });
}

function showPersonDetails(personId) {
  $.get(`https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}`, data => {
    $('#superman-actor-details').html(`
      <h3>${data.name}</h3>
      <p>${data.biography || 'No biography available.'}</p>
      <p>Birthday: ${data.birthday || 'N/A'}</p>
      <p>Known For: ${data.known_for_department}</p>
    `);
  });
}

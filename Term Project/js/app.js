let currentPage = 1;
let currentMode = 'popular';
let currentQuery = '';
let currentGenre = '';

$(document).ready(function () {
  const apiKey = "c3fa69d0d5078ebcf691a99e3e4c626e";
  const imageBase = "https://image.tmdb.org/t/p/w500";

  
  loadPopularMovies();

  // View Toggle
  $('#gridViewBtn').click(() => {
    $('#results').removeClass('list-view').addClass('grid-view');
  });

  $('#listViewBtn').click(() => {
    $('#results').removeClass('grid-view').addClass('list-view');
  });

  
  function loadPopularMovies(page = 1) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
    currentMode = 'popular';
    currentPage = page;
    $.getJSON(url, displayMovies);
  }

  function searchMovies(query, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
    currentMode = 'search';
    currentQuery = query;
    currentPage = page;
    $.getJSON(url, displayMovies);
  }

  function discoverByGenre(genreId, page = 1) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}`;
    currentMode = 'genre';
    currentGenre = genreId;
    currentPage = page;
    $.getJSON(url, displayMovies);
  }

  
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

      const html = `
        <h2>${movie.title}</h2>
        <img src="${poster}" class="movie-poster" style="width:150px;" />
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
        <p><strong>Genres:</strong> ${genres}</p>
        <p><strong>Overview:</strong> ${movie.overview}</p>
      `;

      $('#movieDetails').html(html);
      $('#movieModal').fadeIn();
    });
  });

  $('.close').click(() => {
    $('#movieModal').fadeOut();
  });

  $('#movieModal').click(function (e) {
    if (e.target === this) {
      $(this).fadeOut();
    }
  });
});

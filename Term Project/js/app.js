$(document).ready(function () {
  const apiKey = "c3fa69d0d5078ebcf691a99e3e4c626e";
  const imageBase = "https://image.tmdb.org/t/p/w500";
  loadPopularMovies();

function loadPopularMovies() {
  $('#results').empty();
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

  $.getJSON(url, function (data) {
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
    } else {
      $('#results').html("<p>No popular movies found.</p>");
    }
  });
}


  $('#searchBtn').click(function () {
    const query = $('#searchInput').val().trim();
    if (query) {
      searchMovies(query);
    }
  });

  function searchMovies(query) {
    $('#results').empty();
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    $.getJSON(url, function (data) {
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
      } else {
        $('#results').html("<p>No movies found.</p>");
      }
    });
  }
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
  
  $('.close').click(function () {
    $('#movieModal').fadeOut();
  });

  $('#movieModal').click(function (e) {
    if (e.target === this) {
      $(this).fadeOut();
    }
  });
});


$(document).ready(function () {
  const apiKey = "c3fa69d0d5078ebcf691a99e3e4c626e";
  const imageBase = "https://image.tmdb.org/t/p/w500";

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
            <div class="movie-card">
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
    }).fail(() => {
      $('#results').html("<p>Failed to load data. Please try again later.</p>");
    });
  }
});

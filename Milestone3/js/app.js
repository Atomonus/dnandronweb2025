$(document).ready(function () {
  const maxResults = 10;
  let currentQuery = "";
  let currentPage = 1;
  let currentSearchResults = [];
  let bookshelf = [];

  $('#searchBtn').click(function () {
    currentQuery = $('#searchInput').val().trim();
    if (currentQuery) {
      searchBooks(currentQuery, 1);
    }
  });

  function searchBooks(query, page) {
    const startIndex = (page - 1) * maxResults;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}`;

    $.getJSON(url, function (data) {
      currentSearchResults = data.items || [];
      displayResults(currentSearchResults);
      createPagination(Math.ceil(data.totalItems / maxResults), page);
    });
  }

  function displayResults(books) {
    $('#searchResults').empty();
    books.forEach(book => {
      const info = book.volumeInfo;
      const bookId = book.id;
      const title = info.title || "No Title";
      const thumbnail = info.imageLinks?.thumbnail || "https://via.placeholder.com/128x200?text=No+Cover";

      const bookHTML = `
        <div class="book-item">
          <img src="${thumbnail}" alt="${title}" />
          <p><a href="#" class="book-link" data-id="${bookId}">${title}</a></p>
          <button class="saveBtn" data-id="${bookId}">Save to Bookshelf</button>
        </div>
      `;
      $('#searchResults').append(bookHTML);
    });

    $('.book-link').click(function (e) {
      e.preventDefault();
      const bookId = $(this).data('id');
      loadBookDetails(bookId);
    });
  }

  function createPagination(totalPages, currentPage) {
    $('#pagination').empty();
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      const button = $('<button>')
        .text(i)
        .click(() => searchBooks(currentQuery, i));
      if (i === currentPage) button.attr('disabled', true);
      $('#pagination').append(button);
    }
  }

  function loadBookDetails(bookId) {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    $.getJSON(url, function (data) {
      const info = data.volumeInfo;
      const title = info.title || "No Title";
      const authors = info.authors ? info.authors.join(", ") : "Unknown Author";
      const publisher = info.publisher || "Unknown Publisher";
      const description = info.description || "No description available.";
      const thumbnail = info.imageLinks?.thumbnail || "";
      const previewLink = info.previewLink || "";
      const pageCount = info.pageCount || "N/A";
      const publishedDate = info.publishedDate || "N/A";

      const detailHTML = `
        <h3>${title}</h3>
        <img src="${thumbnail}" alt="${title}" />
        <p><strong>Authors:</strong> ${authors}</p>
        <p><strong>Publisher:</strong> ${publisher}</p>
        <p><strong>Published Date:</strong> ${publishedDate}</p>
        <p><strong>Page Count:</strong> ${pageCount}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${previewLink ? `<p><a href="${previewLink}" target="_blank">Preview</a></p>` : ""}
      `;
      $('#bookDetails').html(detailHTML);
    });
  }

  function loadBookshelf() {
    $('#bookshelf').empty();
    bookshelf.forEach(book => {
      const info = book.volumeInfo;
      const title = info.title || "No Title";
      const thumbnail = info.imageLinks?.thumbnail || "https://via.placeholder.com/128x200?text=No+Cover";
      const bookId = book.id;

      const bookHTML = `
        <div class="book-item">
          <img src="${thumbnail}" alt="${title}" />
          <p><a href="#" class="book-link" data-id="${bookId}">${title}</a></p>
        </div>
      `;
      $('#bookshelf').append(bookHTML);
    });

    $('.book-link').click(function (e) {
      e.preventDefault();
      const bookId = $(this).data('id');
      loadBookDetails(bookId);
    });
  }

  $(document).on("click", ".saveBtn", function (e) {
    e.stopPropagation();
    const bookId = $(this).data("id");
    const book = currentSearchResults.find(b => b.id === bookId);
    if (book && !bookshelf.some(b => b.id === book.id)) {
      bookshelf.push(book);
      loadBookshelf();
    }
  });

  loadBookshelf();
});

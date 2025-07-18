$(document).ready(function () {
  const maxResults = 10;
  let currentQuery = "";
  let currentPage = 1;
  let currentSearchResults = [];
  let bookshelf = [];
  let isGridView = true;
$('#searchBtn').click(function () {
  currentQuery = $('#searchInput').val().trim();
  if (currentQuery) {
    // Switch to Search section view
    $('#searchSection').show();
    $('#bookshelfSection').hide();
    $('#showSearch').addClass('active');
    $('#showShelf').removeClass('active');

    // Clear previous UI states
    $('#searchResults').empty();
    $('#pagination').empty();
    $('#bookDetails').empty();
    searchBooks(currentQuery, 1);
  }
});
  $('#gridView').click(function () {
  isGridView = true;
  displayResults(currentSearchResults);
  loadBookshelf(); 
});
  $('#listView').click(function () {
  isGridView = false;
  displayResults(currentSearchResults);
  loadBookshelf(); 
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
    const layoutClass = isGridView ? 'grid' : 'list';
    $('#searchResults').removeClass('grid list').addClass(layoutClass).empty();
    books.forEach(book => {
      const info = book.volumeInfo;
      const bookId = book.id;
      const title = info.title || "No Title";
      const thumbnail = info.imageLinks?.thumbnail || "https://via.placeholder.com/128x200?text=No+Cover";
      const bookHTML = isGridView
        ? `
          <div class="book-item grid-item">
            <img src="${thumbnail}" alt="${title}" />
            <p><a href="#" class="book-link" data-id="${bookId}">${title}</a></p>
            <button class="saveBtn" data-id="${bookId}">Save to Bookshelf</button>
          </div>
        `
        : `
          <div class="book-item list-item" style="display: flex; align-items: center; gap: 10px;">
            <img src="${thumbnail}" alt="${title}" style="width: 80px; height: auto;" />
            <div>
              <p><a href="#" class="book-link" data-id="${bookId}">${title}</a></p>
              <button class="saveBtn" data-id="${bookId}">Save to Bookshelf</button>
            </div>
          </div>
        `;

      $('#searchResults').append(bookHTML);
    });

    $('.book-link').click(function (e) {
      e.preventDefault();
      const bookId = $(this).data('id');
      loadBookDetails(bookId);
    });

    $('.saveBtn').click(function (e) {
      e.stopPropagation();
      const bookId = $(this).data("id");
      const book = currentSearchResults.find(b => b.id === bookId);
      if (book && !bookshelf.some(b => b.id === book.id)) {
        bookshelf.push(book);

        loadBookshelf();
       
      }
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
  const layoutClass = isGridView ? 'grid' : 'list';
  $('#bookshelf').removeClass('grid list').addClass(layoutClass).empty();

  bookshelf.forEach(book => {
    const info = book.volumeInfo;
    const title = info.title || "No Title";
    const authors = info.authors ? info.authors.join(", ") : "Unknown Author";
    const thumbnail = info.imageLinks?.thumbnail || "https://via.placeholder.com/128x200?text=No+Cover";
    const bookId = book.id;

    const bookHTML = isGridView
      ? `
        <div class="book-item grid-item">
          <img src="${thumbnail}" alt="${title}" />
          <p><a href="#" class="book-link" data-id="${bookId}">${title}</a></p>
        </div>
      `
      : `
        <div class="book-item list-item" style="display: flex; align-items: center; gap: 10px;">
          <img src="${thumbnail}" alt="${title}" style="width: 80px; height: auto;" />
          <div>
            <p><a href="#" class="book-link" data-id="${bookId}">${title}</a></p>
            <p>${authors}</p>
          </div>
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

  loadBookshelf();
     $('#showSearch').click(function () {
  $('#searchSection').show();
  $('#bookshelfSection').hide();
  $('#showSearch').addClass('active');
  $('#showShelf').removeClass('active');
});

$('#showShelf').click(function () {
  $('#searchSection').hide();
  $('#bookshelfSection').show();
  $('#showShelf').addClass('active');
  $('#showSearch').removeClass('active');
  loadBookshelf();
});
  $('#gridView').click(function () {
  isGridView = true;
  $('#gridView').addClass('active');
  $('#listView').removeClass('active');
  displayResults(currentSearchResults);
  loadBookshelf();
});

$('#listView').click(function () {
  isGridView = false;
  $('#listView').addClass('active');
  $('#gridView').removeClass('active');
  displayResults(currentSearchResults);
  loadBookshelf();
});
});


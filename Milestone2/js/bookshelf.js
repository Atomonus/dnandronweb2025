$(document).ready(function () {
    // Your Google Books user ID and bookshelf ID (Favorites)
    const userId = "115117675132723452396";
    const bookshelfId = "0";
    const url = `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${bookshelfId}/volumes?maxResults=20`;

    $.getJSON(url, function (data) {
        $('#bookshelf').empty();

        if (!data.items || data.items.length === 0) {
            $('#bookshelf').html("<p>No books found in your Favorites bookshelf. Please add books at books.google.com.</p>");
            return;
        }

        data.items.forEach(book => {
            const info = book.volumeInfo;
            const title = info.title || "No Title";
            const thumbnail = info.imageLinks?.thumbnail || "https://via.placeholder.com/128x200?text=No+Cover";
            const bookId = book.id;

            const bookHTML = `
                <div class="book-item">
                    <img src="${thumbnail}" alt="${title}" />
                    <p><a href="book-details.html?id=${bookId}">${title}</a></p>
                </div>
            `;
            $('#bookshelf').append(bookHTML);
        });
    }).fail(function (jqXHR, textStatus, error) {
        $('#bookshelf').html("<p>Failed to load bookshelf data. Error: " + textStatus + "</p>");
        console.error("API Error:", textStatus, error);
    });
});

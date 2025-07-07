$(document).ready(function () {
    $.getJSON("books.json", function (data) {
        $('#bookshelf').empty();

        if (!data.items || data.items.length === 0) {
            $('#bookshelf').html("<p>No books found.</p>");
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
    }).fail(function () {
        $('#bookshelf').html("<p>Failed to load bookshelf data. Make sure books.json is uploaded to GitHub.</p>");
    });
});

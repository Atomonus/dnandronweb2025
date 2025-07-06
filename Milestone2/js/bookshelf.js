$(document).ready(function () {
    const url = "https://books.google.com/books?uid=115117675132723452396&as_coll=0&source=gbs_lp_bookshelf_list";

    $.getJSON(url, function (data) {
        $('#bookshelf').empty();

        if (!data.items || data.items.length === 0) {
            $('#bookshelf').html("<p>No books found in your Favorites shelf.</p>");
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
        $('#bookshelf').html("<p>Failed to load bookshelf data. Make sure the Favorites shelf is public and has books.</p>");
    });
});

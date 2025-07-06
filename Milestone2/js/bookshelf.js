
// TODO: Replace USER_ID and SHELF_ID with your actual public bookshelf info
$(document).ready(function () {
    const url = `https://books.google.com/books?uid=115117675132723452396&as_coll=1001&source=gbs_lp_bookshelf_list`;

    $.getJSON(url, function (data) {
        $('#bookshelf').empty();

        if (!data.items || data.items.length === 0) {
            $('#bookshelf').html("<p>No books found in your bookshelf.</p>");
            return;
        }

        data.items.forEach(book => {
            const info = book.volumeInfo;
            const title = info.title || "No Title";
            const thumbnail = info.imageLinks?.thumbnail || "";
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
        $('#bookshelf').html("<p>Failed to load bookshelf data. Make sure USER_ID and SHELF_ID are correct and public.</p>");
    });
});

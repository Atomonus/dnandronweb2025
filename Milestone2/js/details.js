$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        $('#bookDetails').html("<p>No book ID.</p>");
        return;
    }

    const url = `js/books.json`;

    $.getJSON(url, function (data) {
        const book = data.items.find(item => item.id === bookId);

        if (!book) {
            $('#bookDetails').html("<p>Book not found.</p>");
            return;
        }

        const info = book.volumeInfo;
        const title = info.title || "No Title";
        const authors = info.authors ? info.authors.join(", ") : "Unknown Author";
        const publisher = info.publisher || "Unknown Publisher";
        const description = info.description || "No description available.";
        const thumbnail = info.imageLinks?.thumbnail || "";
        const previewLink = info.previewLink || "#";
        const pageCount = info.pageCount || "N/A";
        const publishedDate = info.publishedDate || "N/A";

        const detailHTML = `
            <h2>${title}</h2>
            <img src="${thumbnail}" alt="${title}" />
            <p><strong>Authors:</strong> ${authors}</p>
            <p><strong>Publisher:</strong> ${publisher}</p>
            <p><strong>Published Date:</strong> ${publishedDate}</p>
            <p><strong>Page Count:</strong> ${pageCount}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><a href="${previewLink}" target="_blank">Preview on Google Books</a></p>
        `;

        $('#bookDetails').html(detailHTML);
    }).fail(function () {
        $('#bookDetails').html("<p>Failed to load book information.</p>");
    });
});


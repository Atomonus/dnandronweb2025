
$(document).ready(function () {
    const maxResults = 20;
    let currentPage = 1;
    let totalItems = 0;
    let searchTerm = "";

    function fetchBooks(page) {
        const startIndex = (page - 1) * maxResults;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&startIndex=${startIndex}&maxResults=${maxResults}`;

        $.getJSON(url, function (data) {
            $('#results').empty();

            if (!data.items || data.items.length === 0) {
                $('#results').html("<p>No results found.</p>");
                return;
            }

            totalItems = data.totalItems;
            displayResults(data.items);
            setupPagination();
        }).fail(function () {
            $('#results').html("<p>Something went wrong with the search.</p>");
        });
    }

    function displayResults(books) {
        books.forEach(book => {
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
            $('#results').append(bookHTML);
        });
    }

    function setupPagination() {
        const totalPages = Math.min(Math.ceil(totalItems / maxResults), 3);
        let paginationHTML = '<div id="pagination">Page: ';

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<label><input type="radio" name="page" value="${i}" ${i === currentPage ? "checked" : ""}> ${i}</label> `;
        }

        paginationHTML += '</div>';
        $('#results').append(paginationHTML);

        $('input[name="page"]').on("change", function () {
            currentPage = parseInt($(this).val());
            fetchBooks(currentPage);
        });
    }

    $('#searchBtn').on('click', function () {
        searchTerm = $('#searchInput').val().trim();
        if (searchTerm.length === 0) {
            alert("Please enter a search term.");
            return;
        }
        currentPage = 1;
        fetchBooks(currentPage);
    });
});

$(document).ready(function () {
    const data = {
        items: [
            {
                id: "book1",
                volumeInfo: {
                    title: "Popular Mechanics",
                    imageLinks: {
                        thumbnail: "https://i.imgur.com/vJg8T3A.png"
                    }
                }
            },
            {
                id: "book2",
                volumeInfo: {
                    title: "Write Modern Web Apps with the MEAN Stack",
                    imageLinks: {
                        thumbnail: "https://i.imgur.com/Emx1F0L.png"
                    }
                }
            },
            {
                id: "book3",
                volumeInfo: {
                    title: "How to Code in Python 3",
                    imageLinks: {
                        thumbnail: "https://i.imgur.com/gul7mX2.png"
                    }
                }
            }
        ]
    };

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
});

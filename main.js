document.addEventListener('DOMContentLoaded', function () {
    const inputBookForm = document.getElementById('inputBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    inputBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    function addBook() {
        const inputBookTitle = document.getElementById('inputBookTitle').value;
        const inputBookAuthor = document.getElementById('inputBookAuthor').value;
        const inputBookYear = document.getElementById('inputBookYear').value;
        const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;
        const newBook = createBook(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);

        if (inputBookIsComplete) {
            completeBookshelfList.appendChild(newBook);
        } 
        else {
            incompleteBookshelfList.appendChild(newBook);
        }

        saveToLocalStorage();
        resetForm();
    }

    function createBook(title, author, year, isComplete) {
        const bookItem = document.createElement('article');
        bookItem.classList.add('book_item');

        const titleElement = document.createElement('h3');
        titleElement.innerText = title;

        const authorElement = document.createElement('p');
        authorElement.innerText = `Penulis: ${author}`;

        const yearElement = document.createElement('p');
        yearElement.innerText = `Tahun: ${year}`;

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');

        const greenButton = document.createElement('button');
        greenButton.classList.add('green');
        greenButton.innerText = isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
        greenButton.addEventListener('click', function () {
        toggleBookStatus(bookItem, isComplete);
        });

        const redButton = document.createElement('button');
        redButton.classList.add('red');
        redButton.innerText = 'Hapus buku';
        redButton.addEventListener('click', function () {
        removeBook(bookItem);
        });

        actionContainer.appendChild(greenButton);
        actionContainer.appendChild(redButton);

        bookItem.appendChild(titleElement);
        bookItem.appendChild(authorElement);
        bookItem.appendChild(yearElement);
        bookItem.appendChild(actionContainer);

        return bookItem;
    }

    function toggleBookStatus(bookItem, isComplete) {
        const destinationList = isComplete ? incompleteBookshelfList : completeBookshelfList;
        const oppositeList = isComplete ? completeBookshelfList : incompleteBookshelfList;

        const greenButton = bookItem.querySelector('.green');
        greenButton.innerText = isComplete ? 'Selesai dibaca' : 'Belum selesai di Baca';
        greenButton.addEventListener('click', function () {
        toggleBookStatus(bookItem, !isComplete);
        });

        destinationList.appendChild(bookItem);
        oppositeList.removeChild(bookItem);

        saveToLocalStorage();
    }

    function removeBook(bookItem) {
        const confirmation = confirm('Apakah kamu yakin ingin menghapus buku ini?')
        if (confirmation) {
        bookItem.parentNode.removeChild(bookItem);
        saveToLocalStorage();
        }
    }

    function resetForm() {
        document.getElementById('inputBookTitle').value = '';
        document.getElementById('inputBookAuthor').value = '';
        document.getElementById('inputBookYear').value = '';
        document.getElementById('inputBookIsComplete').checked = false;
    }

    function saveToLocalStorage() {
        const incompleteBooks = Array.from(incompleteBookshelfList.children).map(extractBookDetails);
        const completeBooks = Array.from(completeBookshelfList.children).map(extractBookDetails);

        const books = {
            incomplete: incompleteBooks,
            complete: completeBooks
        };

    localStorage.setItem('books', JSON.stringify(books));
    }

    function extractBookDetails(book) {
        const title = book.querySelector('h3').innerText;
        const author = book.querySelector('p:nth-child(2)').innerText.slice(9);
        const year = book.querySelector('p:nth-child(3)').innerText.slice(6);
        return { title, author, year };
    }

    function loadFromLocalStorage() {
        const storedBooks = localStorage.getItem('books');
        if (storedBooks !== null) {
            const books = JSON.parse(storedBooks);

            for (const book of books.incomplete) {
                const newBook = createBook(book.title, book.author, book.year, false);
                incompleteBookshelfList.appendChild(newBook);
            }

            for (const book of books.complete) {
                const newBook = createBook(book.title, book.author, book.year, true);
                completeBookshelfList.appendChild(newBook);
            }
        }
    }

    loadFromLocalStorage();
});

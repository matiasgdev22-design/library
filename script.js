
//Biblioteca.

const myLibrary = [];

//información del libro.

class Book {
  constructor(title, author, pages, category, status = "pending", cover = "", notes = "") {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.category = category;
    this.status = status;
    this.cover = cover;
    this.notes = notes;
  }
}
function addBookToLibrary(book) {
  myLibrary.push(book);
  saveLibrary();
}

function saveLibrary() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

//5 libros.
const book1 = new Book(
  "Eloquent JavaScript",
  "Marijn Haverbeke",
  472,
  "JavaScript"
);

const book2 = new Book(
  "The Pragmatic Programmer",
  "David Thomas y Andrew Hunt",
  352,
  "Programación"
);

const book3 = new Book(
  "Grokking Algorithms",
  "Aditya Bhargava",
  256,
  "Algoritmos"
);

const book4 = new Book(
  "Clean Code",
  "Robert C. Martin",
  464,
  "Programación"
);

const book5 = new Book(
  "1984",
  "George Orwell",
  328,
  "Literatura"
);
//incorporacion de libros al array.

const savedLibrary = localStorage.getItem("myLibrary");

if (savedLibrary) {
  myLibrary.push(...JSON.parse(savedLibrary));
} else {
  addBookToLibrary(book1);
  addBookToLibrary(book2);
  addBookToLibrary(book3);
  addBookToLibrary(book4);
  addBookToLibrary(book5);
}

        
const libraryContainer = document.querySelector("#library-container");
  
function displayBooks(booksToDisplay = myLibrary) {
  libraryContainer.innerHTML = "";

  booksToDisplay.forEach((book) => {

    const card = document.createElement("article");
    card.classList.add("book-card");

    // Guardamos el ID del libro en la tarjeta
    card.dataset.id = book.id;

    const cover = document.createElement("img");

cover.classList.add("book-cover");

if (book.cover) {
  cover.src = book.cover;
  cover.alt = `Portada de ${book.title}`;

  cover.onerror = () => {
    cover.remove();
  };
} else {
  cover.classList.add("no-cover");
  cover.alt = "Libro sin portada";
}

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = `Autor: ${book.author}`;

    const pages = document.createElement("p");
    pages.textContent = `${book.pages} páginas`;

    const category = document.createElement("p");
    category.textContent = book.category;

    const notes = document.createElement("p");
    notes.classList.add("book-notes");
    notes.textContent = book.notes
    ? `Mis notas: ${book.notes}`
    : "Sin notas personales";

    const status = document.createElement("span");
    status.classList.add("book-status");

    const statusLabels = {
      pending: "Pendiente",
      reading: "Leyendo",
      finished: "Terminado"
    };

    status.textContent = statusLabels[book.status];

    // Botón para cambiar estado

    const changeStatusBtn = document.createElement("button");
    changeStatusBtn.textContent = "Cambiar estado";
    changeStatusBtn.dataset.action = "change-status";

    // Botón para editar

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.dataset.action = "edit";

    // Botón para eliminar

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.dataset.action = "delete";

    card.appendChild(cover);
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(pages);
    card.appendChild(category);
    card.appendChild(status);
    card.appendChild(changeStatusBtn);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
    card.appendChild(notes);

    libraryContainer.appendChild(card);

  });
}


function changeBookStatus(bookId) {

  const book = myLibrary.find(book => book.id === bookId);
  if (!book) return;
  if (book.status === "pending") {
    book.status = "reading";
  } else if (book.status === "reading") {
    book.status = "finished";
  } else {
    book.status = "pending";
  }
  saveLibrary();

  renderLibrary();
  updateStats();
}


function removeBook(bookId) {

  const bookIndex = myLibrary.findIndex(
    book => book.id === bookId
  );

  if (bookIndex !== -1) {
    myLibrary.splice(bookIndex, 1);
  }
  saveLibrary();

  renderLibrary();
  updateStats();
}

function editBook(bookId) {
  const book = myLibrary.find(book => book.id === bookId);

  if (!book) return;

  editingBookId = bookId;

  document.querySelector("#title").value = book.title;
  document.querySelector("#author").value = book.author;
  document.querySelector("#pages").value = book.pages;
  document.querySelector("#category").value = book.category;
  document.querySelector("#status").value = book.status;
  document.querySelector("#cover").value = book.cover || "";
  document.querySelector("#notes").value = book.notes || "";

  bookForm.hidden = false;
}


let currentFilter = "all";
let searchTerm = "";
let editingBookId = null;
let currentCategory = "all";

function renderLibrary() {
  const filteredBooks = myLibrary.filter((book) => {
    const matchesStatus =
      currentFilter === "all" || book.status === currentFilter;

    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm);

    const matchesCategory =
      currentCategory === "all" || book.category === currentCategory;

    return matchesStatus && matchesSearch && matchesCategory;
  });

  displayBooks(filteredBooks);
  updateCategoryFilter();
}
function updateCategoryFilter() {
  const categoryFilter = document.querySelector("#category-filter");

  const selectedCategory = currentCategory;

  const categories = [...new Set(
    myLibrary.map(book => book.category)
  )];

  categoryFilter.innerHTML = `
    <option value="all">Todas las categorías</option>
  `;

  categories.forEach(category => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selectedCategory;
}

libraryContainer.addEventListener("click", (event) => {

  const button = event.target.closest("button");

  if (!button) return;

  const card = button.closest(".book-card");
  const bookId = card.dataset.id;

  if (button.dataset.action === "change-status") {
    changeBookStatus(bookId);
  }

  if (button.dataset.action === "delete") {
    removeBook(bookId);
  }

  if (button.dataset.action === "edit") {
  editBook(bookId);
}

});


function updateStats() {
  document.querySelector("#total-books").textContent =
  myLibrary.length;
  
  document.querySelector("#pending-books").textContent =
  myLibrary.filter(book => book.status === "pending").length;
  
  document.querySelector("#reading-books").textContent =
  myLibrary.filter(book => book.status === "reading").length;
  
  document.querySelector("#finished-books").textContent =
  myLibrary.filter(book => book.status === "finished").length;
}

renderLibrary();
updateStats();


// Seleccionamos los elementos del formulario

const newBookBtn = document.querySelector("#new-book-btn");
const bookForm = document.querySelector("#book-form");
const cancelBtn = document.querySelector("#cancel-btn");

// Mostrar formulario

newBookBtn.addEventListener("click", () => {
  bookForm.hidden = false;
});

// Ocultar formulario

cancelBtn.addEventListener("click", () => {
  bookForm.hidden = true;
  bookForm.reset();
  editingBookId = null;
});

// Escuchar el envío del formulario

bookForm.addEventListener("submit", (event) => {

  event.preventDefault();

  const cover = document.querySelector("#cover").value.trim();
  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const pages = Number(document.querySelector("#pages").value);
  const notes = document.querySelector("#notes").value.trim();

  if (!title || !author || !Number.isInteger(pages) || pages <= 0) {
    alert("Completá correctamente el título, autor y cantidad de páginas.");
    return;
  }

  const category = document.querySelector("#category").value;
  const status = document.querySelector("#status").value;

  if (editingBookId) {
  const book = myLibrary.find(
    book => book.id === editingBookId
  );

  book.title = title;
  book.author = author;
  book.pages = pages;
  book.category = category;
  book.status = status;
  book.cover = cover;
  book.notes = notes;

  saveLibrary();

  editingBookId = null;

} else {
  const newBook = new Book(
    title,
    author,
    pages,
    category,
    status,
    cover,
    notes
  );

  addBookToLibrary(newBook);
}

  renderLibrary();
  updateStats();

  bookForm.reset();
  bookForm.hidden = true;

});



const filters = document.querySelector(".filters");

filters.addEventListener("click", (event) => {

  const button = event.target.closest(".filter-btn");

  if (!button) return;

  currentFilter = button.dataset.filter;

  // Actualizar el botón activo

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  renderLibrary();

});

const searchInput = document.querySelector("#search-book");

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.toLowerCase().trim();

  renderLibrary();
});

const categoryFilter = document.querySelector("#category-filter");

categoryFilter.addEventListener("change", () => {
  currentCategory = categoryFilter.value;

  renderLibrary();
});
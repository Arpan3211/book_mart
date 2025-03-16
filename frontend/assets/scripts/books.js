import { fetchBooks, addToCart, markAsFavorite, unmarkAsFavorite } from "../scripts/api.js";
import { showToast } from "../../components/toast.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const toastData = localStorage.getItem("toastMessage");
    if (toastData) {
      const { message, type } = JSON.parse(toastData);
      showToast(message, type);
      localStorage.removeItem("toastMessage");
    }
    const books = await fetchBooks();
    displayBooks(books);
  } catch (error) {
    console.error("Error loading books:", error);
  }
});

function displayBooks(books) {
  const bookList = document.getElementById("book-list");
  bookList.innerHTML = "";

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    bookCard.innerHTML = `
      <img src="${book.image}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>by ${book.author}</p>
      <p class="price">₹${book.price}</p>
      <div class="book-functional-btn">
      <button class="add-to-cart-btn" data-id="${book.bookId}">Add to Cart</button>
      <button class="favorite-btn" data-id="${book.bookId}">
        ${book.favorite ? "❤️" : "🤍"}
      </button>
      </div>
    `;

    bookList.appendChild(bookCard);
  });

  bookList.addEventListener("click", async (e) => {
    const bookId = e.target.getAttribute("data-id");

    if (e.target.classList.contains("add-to-cart-btn")) {
      await addToCart(bookId);
    } 
    
    if (e.target.classList.contains("favorite-btn")) {
      await toggleFavorite(e.target, bookId);
    }
  });
}

async function toggleFavorite(button, bookId) {
  const isFavorite = button.textContent === "❤️";

  try {
    if (isFavorite) {
      await unmarkAsFavorite(bookId);
      button.textContent = "🤍";
      showToast("Removed from favorites", "info");
    } else {
      await markAsFavorite(bookId);
      button.textContent = "❤️";
      showToast("Added to favorites", "success");
    }
  } catch (error) {
    console.error("Error updating favorite:", error);
    showToast("Failed to update favorite", "error");
  }
}

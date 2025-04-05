import { addToCart, unmarkAsFavorite } from "./api.js";
import { showToast } from "../../components/toast.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Check if user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "index.html";
      return;
    }

    // Fetch favorite books
    await loadFavoriteBooks(userId);
  } catch (error) {
    console.error("Error loading favorites:", error);
    showToast("Failed to load favorite books", "error");
  }
});

async function loadFavoriteBooks(userId) {
  try {
    const favoritesList = document.getElementById("favorites-list");
    const noFavoritesMessage = document.getElementById("no-favorites");

    if (!userId) {
      favoritesList.style.display = "none";
      noFavoritesMessage.style.display = "flex";
      showToast("Please log in to view favorites", "error");
      return;
    }

    // Show loading message
    favoritesList.innerHTML = '<div class="loading-message">Loading your favorite books... <span class="loading-dots">...</span></div>';

    // Fetch favorite books from API
    const API_BASE_URL = "http://localhost:5000/api";
    const response = await fetch(`${API_BASE_URL}/books/favorites?userId=${userId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch favorite books");
    }

    const favoriteBooks = await response.json();

    // Clear loading message
    favoritesList.innerHTML = '';

    // Check if there are any favorite books
    if (favoriteBooks.length === 0) {
      favoritesList.classList.add("hidden");
      noFavoritesMessage.classList.remove("hidden");
      return;
    }

    // Display favorite books
    favoritesList.classList.remove("hidden");
    noFavoritesMessage.classList.add("hidden");

    displayFavoriteBooks(favoriteBooks);
  } catch (error) {
    console.error("Error fetching favorite books:", error);
    showToast(error.message || "Failed to load favorite books", "error");

    // Show no favorites message on error
    const favoritesList = document.getElementById("favorites-list");
    const noFavoritesMessage = document.getElementById("no-favorites");
    favoritesList.classList.add("hidden");
    noFavoritesMessage.classList.remove("hidden");
  }
}

function displayFavoriteBooks(books) {
  const favoritesList = document.getElementById("favorites-list");

  // Create a document fragment to batch DOM operations
  const fragment = document.createDocumentFragment();

  books.forEach((book, index) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    // Limit animation delays to reduce flickering
    if (index < 5) {
      bookCard.style.animationDelay = `${index * 0.05}s`;
    }

    // Create rating stars
    const ratingStars = generateRatingStars(book.rating);

    // Prepare variables to reduce template string interpolations
    const genre = book.genre || 'Fiction';
    const year = book.publishedYear || 'N/A';
    const description = book.description ? book.description.substring(0, 80) + '...' : 'No description available';

    bookCard.innerHTML = `
      <div class="book-card-container">
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">by ${book.author}</p>
          <div class="book-rating">${ratingStars}</div>
          <div class="book-details">
            <span class="book-genre-tag">${genre}</span>
            <span class="book-year">${year}</span>
          </div>
          <p class="book-price">₹${book.price}</p>
          <div class="book-description-preview">${description}</div>
          <div class="book-actions">
            <button class="add-to-cart-btn" data-id="${book.bookId}">Add to Cart</button>
            <button class="remove-favorite-btn favorited" data-id="${book.bookId}" title="Remove from favorites">
              <span class="heart-icon">❤️</span>
            </button>
          </div>
          <div class="favorite-badge">In your favorites</div>
        </div>
        <div class="book-cover">
          <img src="${book.image}" alt="${book.title}" loading="lazy">
          <div class="book-genre">${genre}</div>
          <div class="favorite-ribbon">Favorite</div>
        </div>
      </div>
    `;

    // Add to fragment instead of directly to DOM
    fragment.appendChild(bookCard);
  });

  // Add all cards to the DOM at once
  favoritesList.appendChild(fragment);

  // Add event listeners for buttons
  addButtonEventListeners();
}

function generateRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let starsHTML = '';

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star full-star">★</span>';
  }

  // Add half star if needed
  if (halfStar) {
    starsHTML += '<span class="star half-star">★</span>';
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="star empty-star">☆</span>';
  }

  return starsHTML;
}

function addButtonEventListeners() {
  const favoritesList = document.getElementById("favorites-list");

  favoritesList.addEventListener("click", async (e) => {
    // Find the closest button to the clicked element
    const button = e.target.closest('button');
    if (!button) return; // If no button was clicked, exit

    const bookId = button.getAttribute("data-id");
    if (!bookId) return; // If no bookId, exit

    // Handle add to cart button
    if (button.classList.contains("add-to-cart-btn")) {
      try {
        await addToCart(bookId);
        showToast("Book added to cart", "success");
      } catch (error) {
        console.error("Error adding to cart:", error);
        showToast("Failed to add book to cart", "error");
      }
    }

    // Handle remove from favorites button
    if (button.classList.contains("remove-favorite-btn")) {
      try {
        const bookCard = button.closest(".book-card");

        // Add removal animation
        bookCard.classList.add("removing");

        // Remove from favorites
        const success = await unmarkAsFavorite(bookId);

        if (success) {
          // Wait for animation to complete
          setTimeout(() => {
            bookCard.remove();

            // Check if there are any favorites left
            const remainingCards = document.querySelectorAll(".book-card");
            if (remainingCards.length === 0) {
              document.getElementById("favorites-list").classList.add("hidden");
              document.getElementById("no-favorites").classList.remove("hidden");
            }

            // Update the favorites count in the header
            if (typeof updateFavoritesCount === 'function') {
              updateFavoritesCount();
            }
          }, 300);

          showToast("Book removed from favorites", "info");
        }
      } catch (error) {
        console.error("Error removing from favorites:", error);
        showToast("Failed to remove book from favorites", "error");
      }
    }
  });
}

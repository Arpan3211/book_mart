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

  // Create a document fragment to batch DOM operations
  const fragment = document.createDocumentFragment();

  // Clear the book list
  bookList.innerHTML = "";

  // Create all book cards first
  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    // Generate rating stars
    const ratingStars = generateRatingStars(book.rating || 4);

    // Use a simplified template with fewer interpolations
    const favorite = book.favorite ? 'favorited' : '';
    const favoriteIcon = book.favorite ? "❤️" : "🤍";
    const favoriteTitle = book.favorite ? 'Remove from favorites' : 'Add to favorites';
    const favoriteBadge = book.favorite ? '<div class="favorite-badge">In your favorites</div>' : '';
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
            <button class="favorite-btn ${favorite}" data-id="${book.bookId}" title="${favoriteTitle}">
              <span class="heart-icon">${favoriteIcon}</span>
            </button>
          </div>
          ${favoriteBadge}
        </div>
        <div class="book-cover">
          <img src="${book.image}" alt="${book.title}" loading="lazy">
          <div class="book-genre">${genre}</div>
        </div>
      </div>
    `;

    // Add to fragment instead of directly to DOM
    fragment.appendChild(bookCard);
  });

  // Add all cards to the DOM at once
  bookList.appendChild(fragment);

  // Add event listeners
  bookList.addEventListener("click", async (e) => {
    // Find the closest button to the clicked element
    const button = e.target.closest('button');
    if (!button) return; // If no button was clicked, exit

    const bookId = button.getAttribute("data-id");
    if (!bookId) return; // If no bookId, exit

    if (button.classList.contains("add-to-cart-btn")) {
      await addToCart(bookId);
    }

    if (button.classList.contains("favorite-btn")) {
      await toggleFavorite(button, bookId);
    }
  });
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

async function toggleFavorite(button, bookId) {
  // Get the heart icon span inside the button
  const heartIcon = button.querySelector('.heart-icon') || button;
  const isFavorite = heartIcon.textContent === "❤️";

  try {
    let success;

    if (isFavorite) {
      success = await unmarkAsFavorite(bookId);
      if (success) {
        heartIcon.textContent = "🤍";
        button.classList.remove('favorited');
        button.classList.add('favorite-animation');
        showToast("Removed from favorites", "info");

        // Update the book card to remove the favorite badge
        const bookCard = button.closest('.book-card');
        const favoriteBadge = bookCard.querySelector('.favorite-badge');
        if (favoriteBadge) {
          favoriteBadge.remove();
        }
      }
    } else {
      success = await markAsFavorite(bookId);
      if (success) {
        heartIcon.textContent = "❤️";
        button.classList.add('favorited');
        button.classList.add('favorite-animation');
        showToast("Added to favorites", "success");

        // Update the book card to add the favorite badge
        const bookCard = button.closest('.book-card');
        const bookInfo = bookCard.querySelector('.book-info');
        if (bookInfo && !bookInfo.querySelector('.favorite-badge')) {
          const favoriteBadge = document.createElement('div');
          favoriteBadge.className = 'favorite-badge';
          favoriteBadge.textContent = 'In your favorites';
          bookInfo.appendChild(favoriteBadge);
        }
      }
    }

    if (success) {
      // Remove animation class after animation completes
      setTimeout(() => {
        button.classList.remove('favorite-animation');
      }, 300);

      // Update the favorites count in the header
      if (typeof updateFavoritesCount === 'function') {
        updateFavoritesCount();
      }
    }
  } catch (error) {
    console.error("Error updating favorite:", error);
    showToast("Failed to update favorite", "error");
  }
}

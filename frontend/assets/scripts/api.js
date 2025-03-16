import { showToast } from "../../components/toast.js";

const API_BASE_URL = "http://localhost:5000/api";
const userId = localStorage.getItem("userId") || "user123"; 

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      localStorage.setItem(
        "toastMessage",
        JSON.stringify({ message: "Welcome back!", type: "success" })
      );

      window.location.href = "books.html";
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.error("Login Error:", error);
    showToast("An error occurred while logging in. Please try again.", "error");
  }
}

export async function registerUser(name, email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast("Registration successful! Please log in.");
      return true;
    } else {
      showToast(data.message);
      return false;
    }
  } catch (error) {
    console.error("Registration Error:", error);
    showToast("An error occurred while registering. Please try again.");
    return false;
  }
}

export async function fetchBooks() {
  try {
    const res = await fetch(`${API_BASE_URL}/books?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch books");
    return await res.json();
  } catch (error) {
    console.error("Fetch Books Error:", error);
    return [];
  }
}

export async function addToCart(bookId) {
  const userId = localStorage.getItem("userId") || "guest";

  try {
    const res = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, bookId, quantity: 1 }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast("Book added to cart!");
    } else {
      showToast(data.message);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showToast("An error occurred while adding the book to cart.");
  }
}

export const getCart = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch cart");
    return await res.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

export async function fetchCart(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/${userId}`);
    if (!res.ok) throw new Error("Failed to load cart");
    return await res.json();
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    return { items: [] };
  }
}

export async function updateCartItem(userId, bookId, change, isExact = false) {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, bookId, change, isExact }),
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.message);
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    showToast("Failed to update the cart item.");
  }
}

export async function removeCartItem(userId, bookId) {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, bookId }),
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.message);
    } else {
      showToast("Item removed from cart.");
    }
  } catch (error) {
    console.error("Error removing item:", error);
    showToast("An error occurred while removing the item.");
  }
}

export async function fetchUserDetails(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user details:", error);
    showToast("Failed to load user details", "error");
    return null;
  }
}

export async function markAsFavorite(bookId) {
  await fetch(`${API_BASE_URL}/books/${bookId}/favorite`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}

export async function unmarkAsFavorite(bookId) {
  await fetch(`${API_BASE_URL}/books/${bookId}/unfavorite`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}
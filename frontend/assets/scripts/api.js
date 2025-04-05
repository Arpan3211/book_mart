import { showToast } from "../../components/toast.js";

const API_BASE_URL = "http://localhost:5000/api";

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
        JSON.stringify({ message: data.message || "Welcome back!", type: "success" })
      );

      window.location.href = "books.html";
      return true;
    } else {
      // Handle validation errors
      if (data.errors && data.errors.length > 0) {
        // Return the first error to display in the form
        const formError = document.getElementById("login-form-error");
        if (formError) {
          formError.textContent = data.message;
        }

        // Display field-specific errors
        data.errors.forEach(error => {
          const errorElement = document.getElementById(`login-${error.field}-error`);
          if (errorElement) {
            errorElement.textContent = error.message;
          }
        });
      } else {
        showToast(data.message || "Login failed", "error");
      }
      return false;
    }
  } catch (error) {
    console.error("Login Error:", error);
    showToast("An error occurred while logging in. Please try again.", "error");
    return false;
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
      showToast(data.message || "Registration successful! Please log in.", "success");
      return true;
    } else {
      // Handle validation errors
      if (data.errors && data.errors.length > 0) {
        // Return the first error to display in the form
        const formError = document.getElementById("form-error");
        if (formError) {
          formError.textContent = data.message;
        }

        // Display field-specific errors
        data.errors.forEach(error => {
          const errorElement = document.getElementById(`${error.field}-error`);
          if (errorElement) {
            errorElement.textContent = error.message;
          }
        });
      } else {
        showToast(data.message || "Registration failed", "error");
      }
      return false;
    }
  } catch (error) {
    console.error("Registration Error:", error);
    showToast("An error occurred while registering. Please try again.", "error");
    return false;
  }
}

export async function fetchBooks() {
  try {
    const currentUserId = localStorage.getItem("userId");
    const res = await fetch(`${API_BASE_URL}/books?userId=${currentUserId || ''}`);

    if (!res.ok) {
      throw new Error("Failed to fetch books");
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch Books Error:", error);
    showToast("Failed to load books", "error");
    return [];
  }
}

export async function addToCart(bookId) {
  const currentUserId = localStorage.getItem("userId");

  if (!currentUserId) {
    showToast("Please log in to add items to cart", "error");
    return false;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId, bookId, quantity: 1 }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast("Book added to cart!", "success");
      return true;
    } else {
      showToast(data.message || "Failed to add to cart", "error");
      return false;
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showToast("An error occurred while adding the book to cart.", "error");
    return false;
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
  const currentUserId = localStorage.getItem("userId");
  if (!currentUserId) {
    showToast("Please log in to add favorites", "error");
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/favorite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add favorite");
    }

    return true;
  } catch (error) {
    console.error("Error marking as favorite:", error);
    showToast(error.message || "Failed to add favorite", "error");
    return false;
  }
}

export async function unmarkAsFavorite(bookId) {
  const currentUserId = localStorage.getItem("userId");
  if (!currentUserId) {
    showToast("Please log in to manage favorites", "error");
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/unfavorite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove favorite");
    }

    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    showToast(error.message || "Failed to remove favorite", "error");
    return false;
  }
}

export async function placeOrder(userId, paymentMethod, address, totalAmount) {
  const orderData = {
    userId,
    paymentMethod,
    address,
    totalAmount: Number(totalAmount),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/orders/place-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    return response.ok
      ? { success: true, ...result }
      : { success: false, ...result };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function fetchUserOrders(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    showToast(error.message, "error");
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/update-status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });

    const result = await response.json();
    if (response.ok) {
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
  } catch (error) {
    showToast("Failed to update order status.", "error");
  }
}

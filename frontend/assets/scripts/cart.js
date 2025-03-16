import { fetchCart, updateCartItem, removeCartItem } from "../scripts/api.js";
import { showPaymentModal } from "../../components/paymentModal.js";

document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();
});

async function loadCartItems() {
  const userId = localStorage.getItem("userId") || "guest";
  const cartContainer = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");

  cartContainer.innerHTML = "<p>Loading cart...</p>";

  const data = await fetchCart(userId);
  if (!data.items || data.items.length === 0) {
    cartContainer.innerHTML = "<p>Cart is empty</p>";
    cartTotal.textContent = "Total: ₹0";
    return;
  }

  cartContainer.innerHTML = "";
  let totalPrice = 0;

  data.items.forEach((item) => {
    totalPrice += item.book.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.book.image}" alt="${item.book.title}" class="cart-item-image">
      <div class="cart-item-details">
          <p class="cart-item-title">${item.book.title}</p>
          <p class="cart-item-price">₹${item.book.price}</p>
      </div>
      <div class="cart-item-actions">
          <button class="decrease-btn" data-id="${item.book.bookId}">-</button>
          <input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-id="${item.book._id}">
          <button class="increase-btn" data-id="${item.book.bookId}">+</button>
          <button class="remove-btn" data-id="${item.book.bookId}">Remove</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `Total: ₹${totalPrice}`;
  attachCartEventListeners();
}

function attachCartEventListeners() {
  document
    .querySelectorAll(".increase-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => modifyQuantity(btn.dataset.id, 1))
    );

  document
    .querySelectorAll(".decrease-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => modifyQuantity(btn.dataset.id, -1))
    );

  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", async () => {
      await removeCartItem(localStorage.getItem("userId"), btn.dataset.id);
      loadCartItems();
    })
  );

  document
    .querySelectorAll(".cart-quantity")
    .forEach((input) =>
      input.addEventListener("change", (e) => handleQuantityInput(e))
    );

  document.getElementById("checkout-btn").addEventListener("click", () => {
    showPaymentModal();
  });
}

async function modifyQuantity(bookId, change) {
  await updateCartItem(localStorage.getItem("userId"), bookId, change);
  loadCartItems();
}

async function handleQuantityInput(event) {
  const bookId = event.target.dataset.id;
  let newQuantity = parseInt(event.target.value, 10);

  if (newQuantity < 1) {
    event.target.value = 1;
    return;
  }

  await updateCartItem(
    localStorage.getItem("userId"),
    bookId,
    newQuantity,
    true
  );
  loadCartItems();
}

import { fetchUserOrders } from "../scripts/api.js";
import { showToast } from "../../components/toast.js";

document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");
  const ordersSection = document.getElementById("orders-section");

  if (!userId) {
    ordersSection.innerHTML = "<p>Please log in to view your orders.</p>";
    return;
  }

  try {
    const orders = await fetchUserOrders(userId);

    if (!orders || orders.length === 0) {
      ordersSection.innerHTML = "<p>No orders found. Start shopping now!</p>";
      return;
    }

    ordersSection.innerHTML = orders
      .map((order) => createOrderCard(order))
      .join("");
  } catch (error) {
    showToast(error.message, "error");
  }
});

function createOrderCard(order) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString();
  const statusClass =
    order.status === "Pending" ? "status pending" : "status completed";

  return `
    <div class="order-card">
      <h3>Order #${order._id}</h3>
      <p><strong>Status:</strong> <span class="${statusClass}">${
    order.status
  }</span></p>
      <p><strong>Placed on:</strong> ${formattedDate}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      
      <div class="order-details">
        <h4>Items:</h4>
        <ul>
          ${order.items
            .map(
              (item) => `
                <li>
                  <img src="${item.book?.image}" alt="${
                item.book?.title
              }" class="book-image" />
                  <div>
                    <p><strong>${
                      item.book?.title || "Unknown Book"
                    }</strong></p>
                    <p>Author: ${item.book?.author || "Unknown Author"}</p>
                    <p>₹${item.book?.price || "0"} x ${item.quantity}</p>
                  </div>
                </li>`
            )
            .join("")}
        </ul>
      </div>

      <div class="order-address">
        <h4>Delivery Address:</h4>
        <p>${order.address.address}, ${order.address.city}, ${
    order.address.zip
  }</p>
      </div>
    </div>
  `;
}

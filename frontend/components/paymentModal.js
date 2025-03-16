import { showToast } from "./toast.js";
import { fetchUserDetails } from "../assets/scripts/api.js";

export async function showPaymentModal() {
  const userId = localStorage.getItem("userId") || "guest";
  const userDetails = await fetchUserDetails(userId);
  if (!userDetails) return;

  const totalElement = document.getElementById("cart-total");
  let totalAmount = totalElement
    ? parseFloat(totalElement.textContent.replace("Total: ₹", ""))
    : 0;

  if (totalAmount <= 0) {
    showToast("Your cart is empty! Add items to proceed.", "error");
    return;
  }

  const modal = document.createElement("div");
  modal.id = "payment-modal";
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3><span class="payment-icon">💳</span> Payment Details</h3>
          <p><strong>👤 User:</strong> ${userDetails.name}</p>
          <p><strong>📧 Email:</strong> ${userDetails.email}</p>
          <p><strong>💰 Total Amount:</strong> ₹${totalAmount}</p>
        </div>
        <div class="modal-body" id="modal-body">
          ${getPaymentSelectionUI()}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  attachEventListeners(modal, totalAmount);
}

function getPaymentSelectionUI() {
  return `
    <h3>Select Payment Method:</h3>
    <div id="payment-methods">
      <button class="payment-btn payment-modal-all-btn" data-method="upi">UPI</button>
      <button class="payment-btn payment-modal-all-btn" data-method="net-banking">Net Banking</button>
      <button class="payment-btn payment-modal-all-btn" data-method="credit-card">Credit Card</button>
    </div>
    <button id="close-modal" class="payment-modal-all-btn">Cancel</button>
  `;
}

function attachEventListeners(modal, totalAmount) {
  modal.addEventListener("click", (e) => {
    if (e.target.id === "close-modal") {
      document.body.removeChild(modal);
    }

    if (e.target.classList.contains("payment-btn")) {
      const method = e.target.dataset.method;
      showAddressForm(method);
    }

    if (e.target.id === "save-address") {
      saveAddress();
      const method = e.target.dataset.method;
      showPaymentStep(method);
    }

    if (e.target.id === "back-btn") {
      document.getElementById("modal-body").innerHTML = getPaymentSelectionUI();
    }

    if (e.target.id === "pay-now") {
      const method = e.target.dataset.method;
      processPayment(method, totalAmount);
    }
  });
}

function showAddressForm(method) {
  const savedAddress = JSON.parse(localStorage.getItem("userAddress")) || {};
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = `
    <h3>Enter Delivery Address</h3>
    <label>Address:</label>
    <input type="text" id="user-address" class="payment-input" placeholder="Enter your address" value="${savedAddress.address || ''}">
    <label>City:</label>
    <input type="text" id="user-city" class="payment-input" placeholder="Enter city" value="${savedAddress.city || ''}">
    <label>ZIP Code:</label>
    <input type="text" id="user-zip" class="payment-input" placeholder="Enter ZIP code" value="${savedAddress.zip || ''}">
    <button id="save-address" class="payment-modal-all-btn" data-method="${method}">Save Address</button>
    <button id="back-btn" class="payment-modal-all-btn">Back</button>
    <button id="close-modal" class="payment-modal-all-btn">Cancel</button>
  `;
}

function saveAddress() {
  const address = document.getElementById("user-address").value;
  const city = document.getElementById("user-city").value;
  const zip = document.getElementById("user-zip").value;

  const userAddress = { address, city, zip };
  localStorage.setItem("userAddress", JSON.stringify(userAddress));
  showToast("Address saved successfully!", "success");
}

function showPaymentStep(method) {
  const modalBody = document.getElementById("modal-body");
  let paymentFields = "";
  if (method === "upi") {
    paymentFields = `
      <h3>UPI Payment</h3>
      <label>Enter UPI ID:</label>
      <input type="text" id="upi-id" class="payment-input" placeholder="example@upi">
      <label>Enter UPI PIN:</label>
      <input type="password" id="upi-pin" class="payment-input" placeholder="****">
    `;
  } else if (method === "net-banking") {
    paymentFields = `
      <h3>Net Banking</h3>
      <label>Bank Name:</label>
      <input type="text" id="bank-name" class="payment-input" placeholder="Enter bank name">
      <label>Account Number:</label>
      <input type="text" id="account-number" class="payment-input" placeholder="Enter account number">
      <label>Password:</label>
      <input type="password" id="netbanking-password" class="payment-input" placeholder="********">
    `;
  } else if (method === "credit-card") {
    paymentFields = `
      <h3>Credit Card Payment</h3>
      <label>Card Number:</label>
      <input type="text" id="card-number" class="payment-input" placeholder="**** **** **** ****">
      <label>Expiry Date:</label>
      <input type="text" id="expiry-date" class="payment-input" placeholder="MM/YY">
      <label>CVV:</label>
      <input type="password" id="cvv" class="payment-input" placeholder="***">
      <label>Cardholder Name:</label>
      <input type="text" id="card-holder" class="payment-input" placeholder="Full Name">
    `;
  }
  
  modalBody.innerHTML = `
    <h2>Complete Your Payment</h2>
    ${paymentFields}
    <button id="pay-now" class="payment-modal-all-btn" data-method="${method}">Pay Now</button>
    <button id="back-btn" class="payment-modal-all-btn">Back</button>
    <button id="close-modal" class="payment-modal-all-btn">Cancel</button>
  `;
}

function processPayment(method, totalAmount) {
  const userAddress = JSON.parse(localStorage.getItem("userAddress")) || {};
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = "<div class='loader-wrapper'><span class='loader'></span></div>";

  setTimeout(() => {
    showToast(`Payment successful via ${method}! Total: ₹${totalAmount}. Delivery Address: ${userAddress.address}, ${userAddress.city}, ${userAddress.zip}`, "success");
    document.body.removeChild(document.getElementById("payment-modal"));
  }, 2000);
}

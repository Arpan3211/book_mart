// Toast Manager
const createToastContainer = () => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
};

export function showToast(message, type = "success") {
  console.log("show toast hit 1");
  createToastContainer();
  console.log("show toast hit 2");
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
      <span>${message}</span>
      <button class="close-btn">&times;</button>
  `;

  toastContainer.appendChild(toast);
  console.log("show toast hit 3");
  toast.querySelector(".close-btn").addEventListener("click", () => {
    toast.style.animation = "fadeOut 0.5s forwards";
    setTimeout(() => toast.remove(), 500);
  });

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.5s forwards";
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

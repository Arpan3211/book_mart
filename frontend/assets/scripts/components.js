async function loadComponent(componentId, filePath) {
  try {
    const response = await fetch(filePath);
    const content = await response.text();
    document.getElementById(componentId).innerHTML = content;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "../components/header.html");
  loadComponent("footer", "../components/footer.html");

  setTimeout(() => {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "index.html";
      });
    }
  }, 500);
});

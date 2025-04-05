async function loadComponent(componentId, filePath) {
  try {
    const response = await fetch(filePath);
    const content = await response.text();
    document.getElementById(componentId).innerHTML = content;

    // If this is the header, initialize the favorites count
    if (componentId === 'header') {
      setTimeout(updateFavoritesCount, 100);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

async function updateFavoritesCount() {
  try {
    const favCountElement = document.getElementById('favorites-count');
    if (!favCountElement) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      favCountElement.style.display = 'none';
      return;
    }

    const API_BASE_URL = 'http://localhost:5000/api';
    const response = await fetch(`${API_BASE_URL}/books/favorites?userId=${userId}`);

    if (!response.ok) {
      favCountElement.style.display = 'none';
      return;
    }

    const favorites = await response.json();
    const count = favorites.length;

    if (count > 0) {
      favCountElement.textContent = count > 99 ? '99+' : count;
      favCountElement.style.display = 'flex';
    } else {
      favCountElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Error updating favorites count:', error);
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

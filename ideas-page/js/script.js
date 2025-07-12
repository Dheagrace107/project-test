document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.remove("visible");
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
      header.classList.add("visible");
    }

    // Parallax
    const heroImage = document.querySelector(".hero-image");
    if (heroImage && currentScrollY <= 500) {
      heroImage.style.transform = `translateY(${currentScrollY * 0.3}px)`;
    }

    lastScrollY = currentScrollY;
  });

  const perPageSelect = document.getElementById("perPageSelect");
  const savedSize = localStorage.getItem("perPage") || "10";
  perPageSelect.value = savedSize;

  const sortSelect = document.getElementById("sortSelect");
  const savedSort = localStorage.getItem("sort") || "newest";
  sortSelect.value = savedSort;

  const paginationButtons = document.querySelectorAll(".pagination button");
  const activePage = parseInt(localStorage.getItem("currentPage")) || 1;

  paginationButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pageNum = parseInt(btn.innerText);
      if (!isNaN(pageNum)) {
        localStorage.setItem("currentPage", pageNum);
        location.reload();
      }
    });

    if (parseInt(btn.innerText) === activePage) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  renderItems();
});

document.getElementById("perPageSelect").addEventListener("change", (e) => {
  const size = e.target.value;
  localStorage.setItem("perPage", size);
  localStorage.setItem("currentPage", 1);
  renderItems();
});

document.getElementById("sortSelect").addEventListener("change", (e) => {
  const sortValue = e.target.value;
  localStorage.setItem("sort", sortValue);
  localStorage.setItem("currentPage", 1);
  renderItems();
});

async function renderItems() {
  try {
    const page = localStorage.getItem("currentPage") || 1;
    const size = localStorage.getItem("perPage") || 10;
    const sort =
      localStorage.getItem("sort") === "oldest"
        ? "published_at"
        : "-published_at";

    const url = `http://localhost:3001/proxy?page=${page}&size=${size}&sort=${sort}`;
    const response = await fetch(url);
    const result = await response.json();

    const data = result.data;
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.medium_image}" alt="Thumbnail" loading="lazy" />
        <small>${new Date(item.published_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</small>
        <h4>${item.title}</h4>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Gagal fetch API:", err);
    document.querySelector(
      ".grid"
    ).innerHTML = `<p style="color:red;">Gagal memuat data. Periksa koneksi API.</p>`;
  }
}

renderItems();

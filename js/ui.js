// =====================================================
// MENU RENDER
// =====================================================
function renderMenu(filter = "All") {
  menuGrid.innerHTML = "";
  const filtered =
    filter === "All" ? pizzas : pizzas.filter((p) => p.category === filter);
  if (!filtered.length) {
    menuGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;">No pizzas found in this category.</div>`;
    return;
  }
  filtered.forEach((pizza) => {
    const stars =
      "★".repeat(Math.floor(pizza.rating)) +
      (pizza.rating % 1 >= 0.5 ? "½" : "");
    const card = document.createElement("div");
    card.className = "pizza-card";
    card.innerHTML = `
            ${pizza.tag ? `<div class="pizza-tag">${pizza.tag}</div>` : ""}
            <div class="pizza-img-container" style="cursor:pointer" onclick="openDetailModal(${pizza.id})">
                <img src="${pizza.image}" alt="${pizza.name}" loading="lazy">
            </div>
            <div class="pizza-info">
                <div class="pizza-card-meta">
                    <span class="veg-dot ${pizza.isVeg ? "veg" : "nonveg"}"></span>
                    <span>${pizza.isVeg ? "Veg" : "Non-Veg"}</span>
                </div>
                <h3 class="pizza-title">${pizza.name}</h3>
                <div class="pizza-rating">${stars} <span>(${pizza.reviewCount} reviews)</span></div>
                <div class="pizza-delivery-time">⏱ Est. ${pizza.deliveryTime} min delivery</div>
                <p class="pizza-desc">${pizza.description}</p>
                <div class="pizza-footer">
                    <span class="pizza-price">${formatCurrency(pizza.price)}</span>
                    <div style="display:flex;gap:0.5rem;align-items:center;">
                        <button class="detail-link" onclick="openDetailModal(${pizza.id})">Details</button>
                        <button class="add-btn" onclick="addToCart(${pizza.id})">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add
                        </button>
                    </div>
                </div>
            </div>`;
    menuGrid.appendChild(card);
  });
}

// =====================================================
// REVIEWS TICKER
// =====================================================
function renderReviewsTicker() {
  const track = document.getElementById("reviewsTrack");
  if (!track || !pizzas.length) return;
  const allReviews = [];
  pizzas.forEach((p) =>
    p.reviews.forEach((r) => allReviews.push({ ...r, pizzaName: p.name })),
  );
  // Duplicate for infinite scroll
  const combined = [...allReviews, ...allReviews];
  track.innerHTML = combined
    .map(
      (r) => `
        <div class="review-card-mini">
            <div class="stars">${"★".repeat(r.rating)}</div>
            <p>"${r.comment}"</p>
            <div class="reviewer">${r.name}</div>
            <div class="pizza-name">on ${r.pizzaName}</div>
        </div>`,
    )
    .join("");
}

// =====================================================
// PIZZA DETAIL MODAL
// =====================================================
window.openDetailModal = function (id) {
  const pizza = pizzas.find((p) => p.id === id);
  if (!pizza) return;
  currentDetailPizza = pizza;
  selectedStarRating = 0;

  document.getElementById("detailImg").src = pizza.image;
  document.getElementById("detailImg").alt = pizza.name;
  document.getElementById("detailTag").textContent = pizza.tag || "";
  document.getElementById("detailTag").style.display = pizza.tag ? "" : "none";
  document.getElementById("detailVeg").innerHTML =
    `<span class="veg-dot ${pizza.isVeg ? "veg" : "nonveg"}"></span>${pizza.isVeg ? "Veg" : "Non-Veg"}`;
  document.getElementById("detailName").textContent = pizza.name;
  document.getElementById("detailRating").textContent = `★ ${pizza.rating}`;
  document.getElementById("detailReviewCount").textContent =
    `(${pizza.reviewCount} reviews)`;
  document.getElementById("detailTime").textContent =
    `⏱ ${pizza.deliveryTime} min`;
  document.getElementById("detailDesc").textContent = pizza.longDescription;
  document.getElementById("detailPrice").textContent = formatCurrency(
    pizza.price,
  );

  // Ingredients
  const ingList = document.getElementById("detailIngredients");
  ingList.innerHTML = pizza.ingredients
    .map((i) => `<span class="ingredient-chip">${i}</span>`)
    .join("");

  // Reviews
  renderDetailReviews(pizza);

  // Reset star picker
  resetStars();

  document.getElementById("detailAddBtn").onclick = () => {
    addToCart(pizza.id);
    closeModal(detailModal);
  };

  openModal(detailModal);
};

function renderDetailReviews(pizza) {
  const list = document.getElementById("detailReviewsList");
  const saved = JSON.parse(localStorage.getItem(`reviews_${pizza.id}`)) || [];
  const all = [...saved, ...pizza.reviews];
  list.innerHTML = all
    .map(
      (r) => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${r.name}</span>
                <span class="review-date">${r.date}</span>
            </div>
            <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
            <p class="review-comment">${r.comment}</p>
        </div>`,
    )
    .join("");
}

function resetStars() {
  selectedStarRating = 0;
  document
    .querySelectorAll(".star-picker .star")
    .forEach((s) => s.classList.remove("active"));
  const ta = document.getElementById("reviewText");
  if (ta) ta.value = "";
  const err = document.getElementById("reviewError");
  if (err) err.classList.add("hidden");
}

function submitReview() {
  if (!currentUser) {
    showError(
      document.getElementById("reviewError"),
      "Please login to leave a review.",
    );
    return;
  }
  if (!selectedStarRating) {
    showError(
      document.getElementById("reviewError"),
      "Please select a star rating.",
    );
    return;
  }
  const text = document.getElementById("reviewText").value.trim();
  if (!text) {
    showError(
      document.getElementById("reviewError"),
      "Please write a comment.",
    );
    return;
  }

  const review = {
    name: currentUser.name,
    rating: selectedStarRating,
    comment: text,
    date: "Just now",
  };
  const key = `reviews_${currentDetailPizza.id}`;
  const saved = JSON.parse(localStorage.getItem(key)) || [];
  saved.unshift(review);
  localStorage.setItem(key, JSON.stringify(saved));
  renderDetailReviews(currentDetailPizza);
  resetStars();
  showToast("Review posted! Thank you 🙏", "success");
}

// =====================================================
// TOAST
// =====================================================
let toastTimer;
function showToast(msg, type = "default") {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.style.background = type === "success" ? "#2ed573" : "#FF4757";
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// =====================================================
// MODAL HELPERS
// =====================================================
function openModal(el) {
  el.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeModal(el) {
  el.classList.remove("active");
  document.body.style.overflow = "";
}
function closeCart() {
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Global Variables
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let balance = parseFloat(localStorage.getItem("userBalance")) || 1000;
let discount = 0;
let currentBannerIndex = 0;
const bannerImages = 4;
let currentReviewIndex = 0;

// Reviews Data
const reviews = [
  {
    name: "Jasim",
    comment: "Amazing products and fast delivery!",
    rating: 5,
    date: "2025-10-01",
  },
  {
    name: "Akbar",
    comment: "Great quality, highly recommend.",
    rating: 4,
    date: "2025-10-05",
  },
  {
    name: "Sokina",
    comment: "Good value for money.",
    rating: 4,
    date: "2025-10-10",
  },
  {
    name: "Damish",
    comment: "Excellent customer service.",
    rating: 5,
    date: "2025-10-12",
  },
];

// Update Balance Display
function updateBalanceDisplay() {
  document.getElementById("balance-nav").textContent = `${balance.toFixed(2)} BDT`;
  document.getElementById("balance-display").textContent = `${balance.toFixed(2)} BDT`;
  localStorage.setItem("userBalance", balance);
}

// Add Money
function addMoney() {
  balance += 1000;
  updateBalanceDisplay();
}

// Show Warning
function showWarning(message) {
  const warning = document.getElementById("warning");
  warning.textContent = message;
  warning.classList.remove("hidden");
}

// Check Balance Warning
function checkBalanceWarning() {
  const subtotal = calculateSubtotal();
  if (subtotal > balance) {
    showWarning("Warning: Your balance is insufficient for items in cart!");
  } else {
    document.getElementById("warning").classList.add("hidden");
  }
}

// Calculate Subtotal
function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity*123, 0);
}

// Total Items
function getTotalItems() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Add to Cart
function addToCart(id) {
  const product = products.find((p) => p.id === id);

  const currentSubtotal = calculateSubtotal();
  if (currentSubtotal + product.price > balance) {
    showWarning("Cannot add: Insufficient balance!");
    return;
  }

  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  checkBalanceWarning();
}

// Change Quantity
function changeQuantity(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (delta > 0) {
    const currentSubtotal = calculateSubtotal();
    if (currentSubtotal + item.price > balance) {
      showWarning("Cannot increase: Insufficient balance!");
      return;
    }
  }

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  checkBalanceWarning();
}

// Remove from Cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  checkBalanceWarning();
}

// Render Products
function renderProducts(searchTerm = "") {
  const grid = document.getElementById("product-grid");
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  grid.innerHTML = "";
  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition";
    card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover rounded mb-2">
            <h3 class="font-bold text-lg mb-1">${product.title.substring(0, 50)}...</h3>
            <p class="text-orange-600 font-semibold text-xl mb-1">${product.price*123} BDT</p>
            <p class="text-sm text-gray-600 mb-2">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
            <button onclick="addToCart(${product.id})" class="w-full bg-orange-600 text-white py-2 rounded hover:bg-green-600 transition">Add to Cart</button>
        `;
    grid.appendChild(card);
  });
}

// Render Cart
function renderCart() {
  const subtotal = calculateSubtotal();
  const totalItems = getTotalItems();
  const total = subtotal - discount;
  document.getElementById("total-products").textContent = totalItems;
  document.getElementById("subtotal").textContent = `${subtotal.toFixed(2)} BDT`;
  document.getElementById("discount").textContent = `${discount.toFixed(2)} BDT`;
  document.getElementById("total").textContent = `${total.toFixed(2)} BDT`;
}

// Apply Coupon
function applyCoupon() {
  const code = document.getElementById("coupon-input").value.trim().toUpperCase();
  if (code === "SMART10") {
    discount = calculateSubtotal() * 0.1;
  } else {
    discount = 0;
    if (code !== "") {
      showWarning("Invalid coupon code!");
    }
  }
  renderCart();
}

// Order Now
function orderNow() {
  const total = parseFloat(document.getElementById("total").textContent);
  if (total === 0) {
    alert("Your cart is empty!");
    return;
  }
  if (total > balance) {
    showWarning("Insufficient balance for order!");
    return;
  }
  if (confirm("Confirm order?")) {
    alert("Order placed successfully!");
    cart = [];
    balance -= total; 
    updateBalanceDisplay(); 
    localStorage.setItem("cart", JSON.stringify(cart));
    discount = 0;
    document.getElementById("coupon-input").value = "";
    renderCart();
  }
}

// Banner Slider Functions
function nextBannerSlide() {
  currentBannerIndex = (currentBannerIndex + 1) % bannerImages;
}

function prevBannerSlide() {
  currentBannerIndex = (currentBannerIndex - 1 + bannerImages) % bannerImages;
}

// Review Slider Functions
function renderReviews() {
  const slides = document.getElementById("review-slides");
  slides.innerHTML = "";
  reviews.forEach((review, index) => {
    const card = document.createElement("div");
    card.className = "flex-shrink-0 w-full p-6 bg-gray-50 rounded-lg shadow-md mx-2";
    card.innerHTML = `
            <div class="flex items-center mb-2">
                <span class="text-yellow-500 mr-2">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
                <span class="font-bold">${review.name}</span>
            </div>
            <p class="text-gray-700 mb-2">${review.comment}</p>
            <p class="text-sm text-gray-500">${review.date}</p>
        `;
    slides.appendChild(card);
  });
  updateReviewCounter();
}

function showReviewSlide() {
  const slides = document.getElementById("review-slides");
  slides.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
  updateReviewCounter();
}

function nextReviewSlide() {
  currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
  showReviewSlide();
}

function prevReviewSlide() {
  currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
  showReviewSlide();
}

function updateReviewCounter() {
  document.getElementById('current-review').textContent = currentReviewIndex + 1;
  document.getElementById('total-reviews').textContent = reviews.length;
}

// Contact Form
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email.");
    return;
  }

  document.getElementById("form-message").textContent = "Thank you for your message! We will get back to you soon.";
  document.getElementById("form-message").classList.remove("hidden");
  document.getElementById("contact-form").reset();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  updateBalanceDisplay();
  renderCart();

  // Fetch Products (all products)
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      renderProducts();
    })
    .catch(error => {
      console.error("Error fetching products:", error);
    });

  // Render Reviews
  renderReviews();
  showReviewSlide();

  // Mobile Menu Toggle
  document.getElementById("mobile-toggle").addEventListener("click", () => {
    document.getElementById("mobile-menu").classList.toggle("hidden");
  });

  // Add Money
  document.getElementById("add-money").addEventListener("click", addMoney);
  // Review Controls
  document.getElementById("next-review").addEventListener("click", nextReviewSlide);
  document.getElementById("prev-review").addEventListener("click", prevReviewSlide);
  setInterval(nextReviewSlide, 5000);

  // Product Search
  document.getElementById("product-search").addEventListener("input", (e) => {
    renderProducts(e.target.value);
  });

  // Apply Coupon
  document.getElementById("apply-coupon").addEventListener("click", applyCoupon);

  // Order Now
  document.getElementById("order-now").addEventListener("click", orderNow);

  // Contact Form
  document.getElementById("contact-form").addEventListener("submit", handleFormSubmit);

  // Back to Top
  document.getElementById("back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Navbar Active Highlight (simple on click)
  document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      document.querySelectorAll("nav a").forEach((a) => a.classList.remove("text-yellow-200"));
      e.target.classList.add("text-yellow-200");
    });
  });

});



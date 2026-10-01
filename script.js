// ==========================================
// 1. SEED DATA
// ==========================================

const defaultRecipes = [
  {
    id: 1,
    title: "Classic Margherita Pizza",
    cuisine: "Italian",
    diet: "Vegetarian",
    author: "System Chef",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Pizza dough", "San Marzano tomatoes", "Fresh mozzarella", "Fresh basil", "Olive oil", "Salt"],
    instructions: [
      "Preheat oven to maximum heat (ideally with a pizza stone inside).",
      "Stretch the pizza dough evenly onto a floured surface.",
      "Spread crushed tomatoes lightly across the dough.",
      "Tear and distribute mozzarella evenly.",
      "Bake for 8-10 minutes until crust is blistered and cheese is melted.",
      "Garnish with fresh basil leaves and a drizzle of olive oil before serving."
    ],
    ratings: [5, 5, 4]
  },
  {
    id: 2,
    title: "Chana Masala",
    cuisine: "Indian",
    diet: "Vegan",
    author: "Chaitanya",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Chickpeas", "Onion", "Tomato puree", "Garlic", "Ginger", "Garam masala", "Coriander"],
    instructions: [
      "Finely chop onions, garlic, and ginger; sauté in olive oil until golden.",
      "Add ground spices and cook for 1 minute until aromatic.",
      "Stir in tomato puree and simmer until the oil starts separating.",
      "Add drained chickpeas and a splash of water; simmer for 15 minutes.",
      "Garnish with fresh chopped coriander and serve hot with basmati rice."
    ],
    ratings: [5, 4]
  },
  {
    id: 3,
    title: "Fresh Guacamole & Tacos",
    cuisine: "Mexican",
    diet: "Gluten-Free",
    author: "Maria",
    image: "https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Avocados", "Lime juice", "Cilantro", "Red onion", "Jalapeño", "Corn tortillas", "Salt"],
    instructions: [
      "Cut and scoop avocado flesh into a shallow bowl.",
      "Mash with a fork leaving slight texture.",
      "Stir in diced red onion, jalapeño, lime juice, and salt to taste.",
      "Warm corn tortillas on a skillet.",
      "Serve fresh guacamole with warm tacos and lime wedges."
    ],
    ratings: [4, 5, 5]
  }
];

// LocalStorage Persistent State
let recipes = JSON.parse(localStorage.getItem("app_recipes")) || defaultRecipes;
let savedIds = JSON.parse(localStorage.getItem("app_saved_recipes")) || [];

// App strictly starts at the login screen
let currentUser = null;
let currentView = "all"; // 'all', 'myposts', or 'saved'
let activeRecipeId = null;

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const authScreen = document.getElementById("auth-screen");
const appDashboard = document.getElementById("app-dashboard");
const signinForm = document.getElementById("signin-form");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const authErrorMsg = document.getElementById("auth-error-msg");

const authBtn = document.getElementById("auth-btn");
const badgeUsername = document.getElementById("badge-username");
const badgeRole = document.getElementById("badge-role");

const recipeListEl = document.getElementById("recipe-list");
const searchInput = document.getElementById("search-input");
const cuisineFilter = document.getElementById("cuisine-filter");
const dietFilter = document.getElementById("diet-filter");

const savedCountEl = document.getElementById("saved-count");
const myPostsCountEl = document.getElementById("my-posts-count");

const viewAllBtn = document.getElementById("view-all-btn");
const viewMyPostsBtn = document.getElementById("view-my-posts-btn");
const viewSavedBtn = document.getElementById("view-saved-btn");

const addRecipeBtn = document.getElementById("add-recipe-btn");
const exportBtn = document.getElementById("export-btn");

const recipeForm = document.getElementById("recipe-form");
const closeRecipeModalBtn = document.getElementById("close-recipe-modal");
const closeFormModalBtn = document.getElementById("close-form-modal");
const starContainer = document.getElementById("modal-star-rating");
const stars = starContainer.querySelectorAll("span");

// ==========================================
// 3. HELPERS
// ==========================================

// Extracts username from email (e.g., "chaitanya@gmail.com" -> "chaitanya")
function extractUsername(email) {
  const atIndex = email.indexOf("@");
  if (atIndex > 0) {
    return email.substring(0, atIndex).trim().toLowerCase();
  }
  return email.trim().toLowerCase();
}

// Clear any error messages when user types
loginEmailInput.addEventListener("input", () => {
  authErrorMsg.style.display = "none";
});
loginPasswordInput.addEventListener("input", () => {
  authErrorMsg.style.display = "none";
});

// ==========================================
// 4. SCREEN SWITCHING (LOGIN <-> DASHBOARD)
// ==========================================
function enterDashboard(user) {
  currentUser = user;
  
  // Transition views
  authScreen.style.display = "none";
  appDashboard.style.display = "block";

  // Update UI Header
  badgeUsername.textContent = currentUser.displayName;
  badgeRole.textContent = currentUser.role;
  badgeRole.style.background = currentUser.role === "Admin" ? "#d32f2f" : "#e65100";

  saveState();
  renderRecipes();
}

function exitToLoginScreen() {
  currentUser = null;
  appDashboard.style.display = "none";
  authScreen.style.display = "flex";

  // Clear input fields so user must type manually
  loginEmailInput.value = "";
  loginPasswordInput.value = "";
  authErrorMsg.style.display = "none";
}

function saveState() {
  localStorage.setItem("app_recipes", JSON.stringify(recipes));
  localStorage.setItem("app_saved_recipes", JSON.stringify(savedIds));

  savedCountEl.textContent = savedIds.length;
  
  if (currentUser) {
    const myCount = recipes.filter(r => r.author && r.author.toLowerCase() === currentUser.displayName.toLowerCase()).length;
    if (myPostsCountEl) myPostsCountEl.textContent = myCount;
  }
}

function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return { avg: 0, count: 0 };
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  return { avg: (sum / ratings.length).toFixed(1), count: ratings.length };
}

// ==========================================
// 5. VALIDATION & LOGIN SUBMIT HANDLER
// ==========================================
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const rawEmail = loginEmailInput.value.trim().toLowerCase();
  const rawPassword = loginPasswordInput.value.trim();

  // Rule 1: Email must be @gmail.com
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(rawEmail)) {
    showError("Please enter a valid Gmail address ending with @gmail.com");
    return;
  }

  // Extract username from email
  const uName = extractUsername(rawEmail);
  const expectedPassword = `tastecraft_${uName}`;

  // Rule 2: Password must match tastecraft_<username>
  if (rawPassword !== expectedPassword) {
    showError(`Incorrect password! For this account, the password must be: tastecraft_${uName}`);
    return;
  }

  // Proper capitalization for user badge
  const displayName = uName.charAt(0).toUpperCase() + uName.slice(1);
  const role = uName === "admin" ? "Admin" : "User";

  authErrorMsg.style.display = "none";
  enterDashboard({
    email: rawEmail,
    username: uName,
    displayName: displayName,
    role: role
  });
});

function showError(msg) {
  authErrorMsg.textContent = msg;
  authErrorMsg.style.display = "block";
}

// Sign Out
authBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to sign out?")) {
    exitToLoginScreen();
  }
});

// ==========================================
// 6. RECIPE RENDERING & ACTIONS
// ==========================================
function renderRecipes() {
  if (!currentUser) return;

  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCuisine = cuisineFilter.value;
  const selectedDiet = dietFilter.value;
  const currentDisplayName = currentUser.displayName.toLowerCase();

  const filtered = recipes.filter(recipe => {
    if (currentView === "saved" && !savedIds.includes(recipe.id)) return false;
    if (currentView === "myposts") {
      if (!recipe.author || recipe.author.toLowerCase() !== currentDisplayName) {
        return false;
      }
    }

    const matchTitle = recipe.title.toLowerCase().includes(searchTerm);
    const matchIngredients = recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
    if (searchTerm && !matchTitle && !matchIngredients) return false;

    if (selectedCuisine && recipe.cuisine !== selectedCuisine) return false;
    if (selectedDiet && recipe.diet !== selectedDiet) return false;

    return true;
  });

  recipeListEl.innerHTML = "";

  if (filtered.length === 0) {
    recipeListEl.innerHTML = `
      <div class="empty-state">
        <h3>No recipes found</h3>
        <p>${currentView === 'myposts' ? "You haven't posted any recipes yet! Click '+ Submit Recipe' to share one." : "Try adjusting your search criteria or clear your filters."}</p>
      </div>
    `;
    return;
  }

  filtered.forEach(recipe => {
    const isSaved = savedIds.includes(recipe.id);
    const { avg, count } = calculateAverageRating(recipe.ratings);
    
    // Check if user can delete: Admin or Author
    const isOwner = recipe.author && (recipe.author.toLowerCase() === currentDisplayName);
    const canDelete = currentUser.role === "Admin" || isOwner;

    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <div class="card-img-container">
        <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&auto=format&fit=crop&q=80'" />
        ${canDelete ? `<button class="delete-btn" data-action="delete" data-id="${recipe.id}" title="Delete Recipe">🗑️</button>` : ""}
      </div>
      <div class="recipe-body">
        <div class="tags">
          <span class="tag">${recipe.cuisine}</span>
          ${recipe.diet !== "None" ? `<span class="tag">${recipe.diet}</span>` : ""}
          ${isOwner ? `<span class="tag" style="background:#ffe0b2; color:#bf360c;">You</span>` : ""}
        </div>
        <h3 class="recipe-title">${recipe.title}</h3>
        <div class="author-pill">By: <strong>${recipe.author || "Community"}</strong></div>
        <div class="recipe-rating">
          ★ <strong>${avg > 0 ? avg : "New"}</strong>
          <span class="rating-count">(${count})</span>
        </div>
        <div class="recipe-actions">
          <button class="btn btn-outline" data-action="view" data-id="${recipe.id}">View Instructions</button>
          <button class="save-btn ${isSaved ? "saved" : ""}" data-action="save" data-id="${recipe.id}" title="Save to Collection">
            ${isSaved ? "♥" : "♡"}
          </button>
        </div>
      </div>
    `;
    recipeListEl.appendChild(card);
  });
}

function deleteRecipe(id) {
  const targetRecipe = recipes.find(r => r.id === id);
  if (!targetRecipe) return;

  const confirmDelete = confirm(`Are you sure you want to delete "${targetRecipe.title}"?`);
  if (confirmDelete) {
    recipes = recipes.filter(r => r.id !== id);
    savedIds = savedIds.filter(savedId => savedId !== id);
    saveState();
    renderRecipes();
  }
}

function toggleSaveRecipe(id) {
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(item => item !== id);
  } else {
    savedIds.push(id);
  }
  saveState();
  renderRecipes();
}

function openRecipeModal(id) {
  activeRecipeId = id;
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  document.getElementById("modal-title").textContent = recipe.title;
  document.getElementById("modal-author").textContent = `Posted by: ${recipe.author || "Community Member"}`;
  document.getElementById("modal-tags").innerHTML = `
    <span class="tag">${recipe.cuisine}</span>
    ${recipe.diet !== "None" ? `<span class="tag">${recipe.diet}</span>` : ""}
  `;

  const ingredientsList = document.getElementById("modal-ingredients");
  ingredientsList.innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join("");

  const instructionsList = document.getElementById("modal-instructions");
  instructionsList.innerHTML = recipe.instructions.map(step => `<li>${step}</li>`).join("");

  highlightModalStars(0);
  document.getElementById("recipe-modal").classList.add("active");
}

function highlightModalStars(rating) {
  stars.forEach(star => {
    star.classList.toggle("active", parseInt(star.dataset.val) <= rating);
  });
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
  activeRecipeId = null;
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================

recipeListEl.addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;

  const id = parseInt(target.getAttribute("data-id"));
  const action = target.getAttribute("data-action");

  if (action === "view") openRecipeModal(id);
  if (action === "save") toggleSaveRecipe(id);
  if (action === "delete") deleteRecipe(id);
});

// Interactive star ratings
stars.forEach(star => {
  star.addEventListener("click", () => {
    const rating = parseInt(star.dataset.val);
    if (activeRecipeId) {
      const recipe = recipes.find(r => r.id === activeRecipeId);
      if (recipe) {
        recipe.ratings.push(rating);
        saveState();
        highlightModalStars(rating);
        renderRecipes();
      }
    }
  });
});

// Submit a new recipe
recipeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newRecipe = {
    id: Date.now(),
    title: document.getElementById("f-title").value.trim(),
    cuisine: document.getElementById("f-cuisine").value,
    diet: document.getElementById("f-diet").value,
    author: currentUser.displayName,
    image: document.getElementById("f-image").value.trim(),
    ingredients: document.getElementById("f-ingredients").value.split(",").map(i => i.trim()).filter(Boolean),
    instructions: document.getElementById("f-instructions").value.split("\n").map(s => s.trim()).filter(Boolean),
    ratings: []
  };

  recipes.unshift(newRecipe);
  saveState();
  recipeForm.reset();
  closeModal("form-modal");
  renderRecipes();
  
  alert(`Recipe "${newRecipe.title}" added! You can view it under "My Posts" or "All Recipes".`);
});

// Search and filter listeners
searchInput.addEventListener("input", renderRecipes);
cuisineFilter.addEventListener("change", renderRecipes);
dietFilter.addEventListener("change", renderRecipes);

// Tabs
function updateActiveTab(activeBtn) {
  [viewAllBtn, viewMyPostsBtn, viewSavedBtn].forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

viewAllBtn.addEventListener("click", () => {
  currentView = "all";
  updateActiveTab(viewAllBtn);
  renderRecipes();
});

viewMyPostsBtn.addEventListener("click", () => {
  currentView = "myposts";
  updateActiveTab(viewMyPostsBtn);
  renderRecipes();
});

viewSavedBtn.addEventListener("click", () => {
  currentView = "saved";
  updateActiveTab(viewSavedBtn);
  renderRecipes();
});

// Modal triggers
addRecipeBtn.addEventListener("click", () => document.getElementById("form-modal").classList.add("active"));
closeRecipeModalBtn.addEventListener("click", () => closeModal("recipe-modal"));
closeFormModalBtn.addEventListener("click", () => closeModal("form-modal"));

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
    activeRecipeId = null;
  }
});

// Clipboard export helper
exportBtn.addEventListener("click", () => {
  const codeSnippet = `const defaultRecipes = ${JSON.stringify(recipes, null, 2)};`;
  navigator.clipboard.writeText(codeSnippet).then(() => {
    alert("Copied defaultRecipes array to clipboard! You can paste it into script.js.");
  });
});

// ==========================================
// 8. INITIAL BOOT
// ==========================================
exitToLoginScreen();
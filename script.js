/* =====================================================
   TASTECRAFT JAVASCRIPT
===================================================== */


/* =====================================================
   1. ADMIN CREDENTIALS
===================================================== */

const ADMIN_EMAIL = "chaitanyasri@tastecraft.com";

const ADMIN_PASSWORD = "chaitanyasri@123";


/* =====================================================
   2. DEFAULT RECIPES
===================================================== */

const defaultRecipes = [

    {
        id: 1,

        title: "Classic Margherita Pizza",

        cuisine: "Italian",

        diet: "Vegetarian",

        author: "System Chef",

        image:
            "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",

        ingredients: [
            "Pizza dough",
            "San Marzano tomatoes",
            "Fresh mozzarella",
            "Fresh basil",
            "Olive oil",
            "Salt"
        ],

        instructions: [
            "Preheat oven to maximum heat.",
            "Stretch the pizza dough on a floured surface.",
            "Spread crushed tomatoes over the dough.",
            "Add mozzarella evenly.",
            "Bake for 8-10 minutes.",
            "Garnish with basil and olive oil."
        ],

        ratings: [5, 5, 4]
    },


    {
        id: 2,

        title: "Chana Masala",

        cuisine: "Indian",

        diet: "Vegan",

        author: "Chaitanya",

        image:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",

        ingredients: [
            "Chickpeas",
            "Onion",
            "Tomato puree",
            "Garlic",
            "Ginger",
            "Garam masala",
            "Coriander"
        ],

        instructions: [
            "Chop onions, garlic and ginger.",
            "Saute them until golden.",
            "Add spices and cook for one minute.",
            "Add tomato puree and simmer.",
            "Add chickpeas and water.",
            "Simmer for 15 minutes and garnish."
        ],

        ratings: [5, 4]
    },


    {
        id: 3,

        title: "Fresh Guacamole & Tacos",

        cuisine: "Mexican",

        diet: "Gluten-Free",

        author: "Maria",

        image:
            "https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?w=600&auto=format&fit=crop&q=80",

        ingredients: [
            "Avocados",
            "Lime juice",
            "Cilantro",
            "Red onion",
            "Jalapeño",
            "Corn tortillas",
            "Salt"
        ],

        instructions: [
            "Cut and scoop avocado into a bowl.",
            "Mash the avocado.",
            "Add onion, jalapeño, lime juice and salt.",
            "Warm the corn tortillas.",
            "Serve with lime wedges."
        ],

        ratings: [4, 5, 5]
    }

];


/* =====================================================
   3. LOCAL STORAGE
===================================================== */

let recipes =
    JSON.parse(
        localStorage.getItem("app_recipes")
    ) || defaultRecipes;


let savedIds =
    JSON.parse(
        localStorage.getItem("app_saved_recipes")
    ) || [];


let registeredUsers =
    JSON.parse(
        localStorage.getItem("tastecraft_users")
    ) || [];


/* =====================================================
   4. APP VARIABLES
===================================================== */

let currentUser = null;

let currentView = "all";

let activeRecipeId = null;


/* =====================================================
   5. DOM ELEMENTS
===================================================== */

const authScreen =
    document.getElementById("auth-screen");

const appDashboard =
    document.getElementById("app-dashboard");


/* Authentication panels */

const authChoice =
    document.getElementById("auth-choice");

const userRegisterContainer =
    document.getElementById(
        "user-register-container"
    );

const userSigninContainer =
    document.getElementById(
        "user-signin-container"
    );

const adminSigninContainer =
    document.getElementById(
        "admin-signin-container"
    );


/* Buttons */

const userChoiceBtn =
    document.getElementById(
        "user-choice-btn"
    );

const adminChoiceBtn =
    document.getElementById(
        "admin-choice-btn"
    );

const showUserSignin =
    document.getElementById(
        "show-user-signin"
    );

const showUserRegister =
    document.getElementById(
        "show-user-register"
    );

const backToChoiceRegister =
    document.getElementById(
        "back-to-choice-register"
    );

const backToChoiceUser =
    document.getElementById(
        "back-to-choice-user"
    );

const backToChoiceAdmin =
    document.getElementById(
        "back-to-choice-admin"
    );


/* Registration */

const registerForm =
    document.getElementById(
        "register-form"
    );

const registerErrorMsg =
    document.getElementById(
        "register-error-msg"
    );

const registerSuccessMsg =
    document.getElementById(
        "register-success-msg"
    );


/* User Login */

const userSigninForm =
    document.getElementById(
        "user-signin-form"
    );

const userErrorMsg =
    document.getElementById(
        "user-error-msg"
    );


/* Admin Login */

const adminSigninForm =
    document.getElementById(
        "admin-signin-form"
    );

const adminErrorMsg =
    document.getElementById(
        "admin-error-msg"
    );


/* Dashboard */

const authBtn =
    document.getElementById(
        "auth-btn"
    );

const badgeUsername =
    document.getElementById(
        "badge-username"
    );

const badgeRole =
    document.getElementById(
        "badge-role"
    );


/* Recipe elements */

const recipeListEl =
    document.getElementById(
        "recipe-list"
    );

const searchInput =
    document.getElementById(
        "search-input"
    );

const cuisineFilter =
    document.getElementById(
        "cuisine-filter"
    );

const dietFilter =
    document.getElementById(
        "diet-filter"
    );

const savedCountEl =
    document.getElementById(
        "saved-count"
    );

const myPostsCountEl =
    document.getElementById(
        "my-posts-count"
    );


/* Tabs */

const viewAllBtn =
    document.getElementById(
        "view-all-btn"
    );

const viewMyPostsBtn =
    document.getElementById(
        "view-my-posts-btn"
    );

const viewSavedBtn =
    document.getElementById(
        "view-saved-btn"
    );


/* Recipe actions */

const addRecipeBtn =
    document.getElementById(
        "add-recipe-btn"
    );

const exportBtn =
    document.getElementById(
        "export-btn"
    );

const recipeForm =
    document.getElementById(
        "recipe-form"
    );


/* Modals */

const closeRecipeModalBtn =
    document.getElementById(
        "close-recipe-modal"
    );

const closeFormModalBtn =
    document.getElementById(
        "close-form-modal"
    );


/* Rating */

const starContainer =
    document.getElementById(
        "modal-star-rating"
    );

const stars =
    starContainer.querySelectorAll(
        "span"
    );


/* =====================================================
   6. AUTHENTICATION PANEL FUNCTION
===================================================== */

function showAuthPanel(panel) {

    authChoice.classList.add("hidden");

    userRegisterContainer.classList.add("hidden");

    userSigninContainer.classList.add("hidden");

    adminSigninContainer.classList.add("hidden");


    panel.classList.remove("hidden");


    clearAuthMessages();
}


/* =====================================================
   7. CLEAR AUTH MESSAGES
===================================================== */

function clearAuthMessages() {

    registerErrorMsg.classList.add("hidden");

    registerErrorMsg.textContent = "";


    registerSuccessMsg.classList.add("hidden");

    registerSuccessMsg.textContent = "";


    userErrorMsg.classList.add("hidden");

    userErrorMsg.textContent = "";


    adminErrorMsg.classList.add("hidden");

    adminErrorMsg.textContent = "";
}


/* =====================================================
   8. USER / ADMIN CHOICE
===================================================== */

userChoiceBtn.addEventListener(
    "click",
    () => {

        showAuthPanel(
            userRegisterContainer
        );

    }
);


adminChoiceBtn.addEventListener(
    "click",
    () => {

        showAuthPanel(
            adminSigninContainer
        );

    }
);


/* =====================================================
   9. USER REGISTRATION
===================================================== */

registerForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();


        const name =
            document.getElementById(
                "register-name"
            ).value.trim();


        const email =
            document.getElementById(
                "register-email"
            ).value.trim().toLowerCase();


        const password =
            document.getElementById(
                "register-password"
            ).value;


        const confirmPassword =
            document.getElementById(
                "register-confirm-password"
            ).value;


        /* Clear old messages */

        registerErrorMsg.classList.add(
            "hidden"
        );

        registerSuccessMsg.classList.add(
            "hidden"
        );


        /* Name validation */

        if (name.length < 2) {

            registerErrorMsg.textContent =
                "Please enter your full name.";

            registerErrorMsg.classList.remove(
                "hidden"
            );

            return;
        }


        /* Gmail validation */

        if (!email.endsWith("@gmail.com")) {

            registerErrorMsg.textContent =
                "Please use a valid Gmail address.";

            registerErrorMsg.classList.remove(
                "hidden"
            );

            return;
        }


        /* Password validation */

        if (password.length < 6) {

            registerErrorMsg.textContent =
                "Password must contain at least 6 characters.";

            registerErrorMsg.classList.remove(
                "hidden"
            );

            return;
        }


        /* Confirm password */

        if (password !== confirmPassword) {

            registerErrorMsg.textContent =
                "Passwords do not match.";

            registerErrorMsg.classList.remove(
                "hidden"
            );

            return;
        }


        /* Duplicate user */

        const existingUser =
            registeredUsers.find(
                user =>
                    user.email === email
            );


        if (existingUser) {

            registerErrorMsg.textContent =
                "This Gmail is already registered.";

            registerErrorMsg.classList.remove(
                "hidden"
            );

            return;
        }


        /* Create user */

        const newUser = {

            id: Date.now(),

            name: name,

            email: email,

            password: password,

            role: "User"

        };


        registeredUsers.push(newUser);


        localStorage.setItem(
            "tastecraft_users",
            JSON.stringify(
                registeredUsers
            )
        );


        /* Success */

        registerSuccessMsg.textContent =
            "Registration successful! You can now sign in.";

        registerSuccessMsg.classList.remove(
            "hidden"
        );


        registerForm.reset();


        setTimeout(
            () => {

                showAuthPanel(
                    userSigninContainer
                );

                document.getElementById(
                    "user-login-email"
                ).value = email;

            },
            1000
        );

    }
);


/* =====================================================
   10. USER LOGIN
===================================================== */

userSigninForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();


        const email =
            document.getElementById(
                "user-login-email"
            ).value.trim().toLowerCase();


        const password =
            document.getElementById(
                "user-login-password"
            ).value;


        const user =
            registeredUsers.find(
                item =>
                    item.email === email &&
                    item.password === password
            );


        if (!user) {

            userErrorMsg.textContent =
                "Invalid Gmail or password.";

            userErrorMsg.classList.remove(
                "hidden"
            );

            return;
        }


        currentUser = {

            email: user.email,

            username: user.name,

            displayName: user.name,

            role: "User"

        };


        enterDashboard();

    }
);


/* =====================================================
   11. ADMIN LOGIN
===================================================== */

adminSigninForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();


        const email =
            document.getElementById(
                "admin-email"
            ).value.trim().toLowerCase();


        const password =
            document.getElementById(
                "admin-password"
            ).value;


        /* Only ONE admin */

        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {

            currentUser = {

                email: ADMIN_EMAIL,

                username: "chaitanyasri",

                displayName: "Chaitanya Sri",

                role: "Admin"

            };


            enterDashboard();

        } else {

            adminErrorMsg.textContent =
                "Invalid admin email or password.";

            adminErrorMsg.classList.remove(
                "hidden"
            );

        }

    }
);


/* =====================================================
   12. AUTH NAVIGATION
===================================================== */

showUserSignin.addEventListener(
    "click",
    () => {

        showAuthPanel(
            userSigninContainer
        );

    }
);


showUserRegister.addEventListener(
    "click",
    () => {

        showAuthPanel(
            userRegisterContainer
        );

    }
);


backToChoiceRegister.addEventListener(
    "click",
    () => {

        showAuthPanel(
            authChoice
        );

    }
);


backToChoiceUser.addEventListener(
    "click",
    () => {

        showAuthPanel(
            authChoice
        );

    }
);


backToChoiceAdmin.addEventListener(
    "click",
    () => {

        showAuthPanel(
            authChoice
        );

    }
);


/* =====================================================
   13. ENTER DASHBOARD
===================================================== */

function enterDashboard() {

    authScreen.classList.add(
        "hidden"
    );

    appDashboard.classList.remove(
        "hidden"
    );


    badgeUsername.textContent =
        currentUser.displayName;


    badgeRole.textContent =
        currentUser.role;


    currentView = "all";


    updateActiveTab(
        viewAllBtn
    );


    renderRecipes();

}


/* =====================================================
   14. SIGN OUT
===================================================== */

authBtn.addEventListener(
    "click",
    () => {

        currentUser = null;

        appDashboard.classList.add(
            "hidden"
        );

        authScreen.classList.remove(
            "hidden"
        );

        showAuthPanel(
            authChoice
        );

    }
);


/* =====================================================
   15. SAVE STATE
===================================================== */

function saveState() {

    localStorage.setItem(
        "app_recipes",
        JSON.stringify(recipes)
    );


    localStorage.setItem(
        "app_saved_recipes",
        JSON.stringify(savedIds)
    );

}


/* =====================================================
   16. AVERAGE RATING
===================================================== */

function calculateAverageRating(
    ratings
) {

    if (
        !ratings ||
        ratings.length === 0
    ) {

        return 0;

    }


    const total =
        ratings.reduce(
            (sum, rating) =>
                sum + rating,
            0
        );


    return (
        total / ratings.length
    ).toFixed(1);

}


/* =====================================================
   17. RENDER RECIPES
===================================================== */

function renderRecipes() {

    recipeListEl.innerHTML = "";


    let filteredRecipes =
        [...recipes];


    /* View filter */

    if (
        currentView ===
        "myposts"
    ) {

        filteredRecipes =
            filteredRecipes.filter(
                recipe =>
                    recipe.author ===
                    currentUser.displayName
            );

    }


    if (
        currentView ===
        "saved"
    ) {

        filteredRecipes =
            filteredRecipes.filter(
                recipe =>
                    savedIds.includes(
                        recipe.id
                    )
            );

    }


    /* Search */

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    if (searchText) {

        filteredRecipes =
            filteredRecipes.filter(
                recipe =>

                    recipe.title
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    recipe.cuisine
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    recipe.ingredients
                        .join(" ")
                        .toLowerCase()
                        .includes(searchText)

            );

    }


    /* Cuisine */

    const cuisine =
        cuisineFilter.value;


    if (cuisine) {

        filteredRecipes =
            filteredRecipes.filter(
                recipe =>
                    recipe.cuisine ===
                    cuisine
            );

    }


    /* Diet */

    const diet =
        dietFilter.value;


    if (diet) {

        filteredRecipes =
            filteredRecipes.filter(
                recipe =>
                    recipe.diet ===
                    diet
            );

    }


    /* Counts */

    const myPosts =
        currentUser.role === "Admin"
            ? recipes.filter(
                recipe =>
                    recipe.author ===
                    currentUser.displayName
            ).length
            : recipes.filter(
                recipe =>
                    recipe.author ===
                    currentUser.displayName
            ).length;


    myPostsCountEl.textContent =
        myPosts;


    savedCountEl.textContent =
        savedIds.length;


    /* Empty state */

    if (
        filteredRecipes.length === 0
    ) {

        recipeListEl.innerHTML = `

            <div class="empty-state">

                <h2>No recipes found</h2>

                <p>
                    Try another search or filter.
                </p>

            </div>

        `;

        return;
    }


    /* Create cards */

    filteredRecipes.forEach(
        recipe => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "recipe-card";


            const avg =
                calculateAverageRating(
                    recipe.ratings
                );


            const count =
                recipe.ratings
                    ? recipe.ratings.length
                    : 0;


            const isSaved =
                savedIds.includes(
                    recipe.id
                );


            const isOwner =
                currentUser.role ===
                    "Admin"
                ||
                recipe.author ===
                    currentUser.displayName;


            card.innerHTML = `

                <img
                    class="recipe-image"
                    src="${recipe.image}"
                    alt="${recipe.title}"
                    onerror="this.src='https://via.placeholder.com/600x400?text=TasteCraft+Recipe';"
                >


                <div class="recipe-body">

                    <div class="recipe-tags">

                        <span class="tag">
                            ${recipe.cuisine}
                        </span>

                        ${
                            recipe.diet !== "None"
                            ?
                            `<span class="tag">
                                ${recipe.diet}
                            </span>`
                            :
                            ""
                        }

                    </div>


                    <h3 class="recipe-title">
                        ${recipe.title}
                    </h3>


                    <div class="author-pill">
                        By:
                        <strong>
                            ${recipe.author || "Community"}
                        </strong>
                    </div>


                    <div class="recipe-rating">

                        ★

                        <strong>
                            ${
                                avg > 0
                                ? avg
                                : "New"
                            }
                        </strong>

                        <span class="rating-count">
                            (${count})
                        </span>

                    </div>


                    <div class="recipe-actions">

                        <button
                            class="btn btn-outline"
                            data-action="view"
                            data-id="${recipe.id}">

                            View Instructions

                        </button>


                        <button
                            class="save-btn ${
                                isSaved
                                    ? "saved"
                                    : ""
                            }"
                            data-action="save"
                            data-id="${recipe.id}"
                            title="Save">

                            ${
                                isSaved
                                    ? "♥"
                                    : "♡"
                            }

                        </button>

                        ${
                            isOwner
                            ?
                            `<button
                                class="save-btn"
                                data-action="delete"
                                data-id="${recipe.id}"
                                title="Delete">

                                🗑️

                            </button>`
                            :
                            ""
                        }

                    </div>

                </div>

            `;


            recipeListEl.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   18. DELETE RECIPE
===================================================== */

function deleteRecipe(id) {

    const targetRecipe =
        recipes.find(
            recipe =>
                recipe.id === id
        );


    if (!targetRecipe) {
        return;
    }


    const isAllowed =
        currentUser.role === "Admin"
        ||
        targetRecipe.author ===
            currentUser.displayName;


    if (!isAllowed) {

        alert(
            "You can only delete your own recipes."
        );

        return;
    }


    const confirmDelete =
        confirm(
            `Are you sure you want to delete "${targetRecipe.title}"?`
        );


    if (confirmDelete) {

        recipes =
            recipes.filter(
                recipe =>
                    recipe.id !== id
            );


        savedIds =
            savedIds.filter(
                savedId =>
                    savedId !== id
            );


        saveState();

        renderRecipes();

    }

}


/* =====================================================
   19. SAVE RECIPE
===================================================== */

function toggleSaveRecipe(id) {

    if (
        savedIds.includes(id)
    ) {

        savedIds =
            savedIds.filter(
                item =>
                    item !== id
            );

    } else {

        savedIds.push(id);

    }


    saveState();

    renderRecipes();

}


/* =====================================================
   20. OPEN RECIPE MODAL
===================================================== */

function openRecipeModal(id) {

    activeRecipeId = id;


    const recipe =
        recipes.find(
            r => r.id === id
        );


    if (!recipe) {
        return;
    }


    document.getElementById(
        "modal-title"
    ).textContent =
        recipe.title;


    document.getElementById(
        "modal-author"
    ).textContent =
        `Posted by: ${
            recipe.author ||
            "Community Member"
        }`;


    document.getElementById(
        "modal-tags"
    ).innerHTML = `

        <span class="tag">
            ${recipe.cuisine}
        </span>

        ${
            recipe.diet !== "None"
            ?
            `<span class="tag">
                ${recipe.diet}
            </span>`
            :
            ""
        }

    `;


    document.getElementById(
        "modal-ingredients"
    ).innerHTML =

        recipe.ingredients
            .map(
                ingredient =>
                    `<li>${ingredient}</li>`
            )
            .join("");


    document.getElementById(
        "modal-instructions"
    ).innerHTML =

        recipe.instructions
            .map(
                step =>
                    `<li>${step}</li>`
            )
            .join("");


    highlightModalStars(0);


    document
        .getElementById(
            "recipe-modal"
        )
        .classList.add(
            "active"
        );

}


/* =====================================================
   21. STAR RATING
===================================================== */

function highlightModalStars(
    rating
) {

    stars.forEach(
        star => {

            star.classList.toggle(
                "active",

                parseInt(
                    star.dataset.val
                ) <= rating

            );

        }
    );

}


/* =====================================================
   22. CLOSE MODAL
===================================================== */

function closeModal(modalId) {

    document
        .getElementById(modalId)
        .classList.remove(
            "active"
        );


    activeRecipeId = null;

}


/* =====================================================
   23. RECIPE CARD EVENTS
===================================================== */

recipeListEl.addEventListener(
    "click",
    (e) => {

        const target =
            e.target.closest(
                "button"
            );


        if (!target) {
            return;
        }


        const id =
            parseInt(
                target.getAttribute(
                    "data-id"
                )
            );


        const action =
            target.getAttribute(
                "data-action"
            );


        if (
            action === "view"
        ) {

            openRecipeModal(id);

        }


        if (
            action === "save"
        ) {

            toggleSaveRecipe(id);

        }


        if (
            action === "delete"
        ) {

            deleteRecipe(id);

        }

    }
);


/* =====================================================
   24. STAR CLICK
===================================================== */

stars.forEach(
    star => {

        star.addEventListener(
            "click",
            () => {

                const rating =
                    parseInt(
                        star.dataset.val
                    );


                if (
                    activeRecipeId
                ) {

                    const recipe =
                        recipes.find(
                            r =>
                                r.id ===
                                activeRecipeId
                        );


                    if (recipe) {

                        recipe.ratings =
                            recipe.ratings ||
                            [];


                        recipe.ratings.push(
                            rating
                        );


                        saveState();


                        highlightModalStars(
                            rating
                        );


                        renderRecipes();

                    }

                }

            }
        );

    }
);


/* =====================================================
   25. SUBMIT RECIPE
===================================================== */

recipeForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();


        if (!currentUser) {

            alert(
                "Please login first."
            );

            return;
        }


        const newRecipe = {

            id: Date.now(),

            title:
                document.getElementById(
                    "f-title"
                ).value.trim(),

            cuisine:
                document.getElementById(
                    "f-cuisine"
                ).value,

            diet:
                document.getElementById(
                    "f-diet"
                ).value,

            author:
                currentUser.displayName,

            image:
                document.getElementById(
                    "f-image"
                ).value.trim(),

            ingredients:
                document.getElementById(
                    "f-ingredients"
                ).value
                    .split(",")
                    .map(
                        item =>
                            item.trim()
                    )
                    .filter(Boolean),

            instructions:
                document.getElementById(
                    "f-instructions"
                ).value
                    .split("\n")
                    .map(
                        item =>
                            item.trim()
                    )
                    .filter(Boolean),

            ratings: []

        };


        recipes.unshift(
            newRecipe
        );


        saveState();


        recipeForm.reset();


        closeModal(
            "form-modal"
        );


        currentView =
            "all";


        updateActiveTab(
            viewAllBtn
        );


        renderRecipes();


        alert(
            `Recipe "${newRecipe.title}" added successfully!`
        );

    }
);


/* =====================================================
   26. SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    renderRecipes
);


cuisineFilter.addEventListener(
    "change",
    renderRecipes
);


dietFilter.addEventListener(
    "change",
    renderRecipes
);


/* =====================================================
   27. TABS
===================================================== */

function updateActiveTab(
    activeBtn
) {

    [
        viewAllBtn,
        viewMyPostsBtn,
        viewSavedBtn
    ].forEach(
        btn =>
            btn.classList.remove(
                "active"
            )
    );


    activeBtn.classList.add(
        "active"
    );

}


/* All Recipes */

viewAllBtn.addEventListener(
    "click",
    () => {

        currentView =
            "all";

        updateActiveTab(
            viewAllBtn
        );

        renderRecipes();

    }
);


/* My Posts */

viewMyPostsBtn.addEventListener(
    "click",
    () => {

        currentView =
            "myposts";

        updateActiveTab(
            viewMyPostsBtn
        );

        renderRecipes();

    }
);


/* Saved */

viewSavedBtn.addEventListener(
    "click",
    () => {

        currentView =
            "saved";

        updateActiveTab(
            viewSavedBtn
        );

        renderRecipes();

    }
);


/* =====================================================
   28. MODAL BUTTONS
===================================================== */

addRecipeBtn.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "form-modal"
            )
            .classList.add(
                "active"
            );

    }
);


closeRecipeModalBtn.addEventListener(
    "click",
    () => {

        closeModal(
            "recipe-modal"
        );

    }
);


closeFormModalBtn.addEventListener(
    "click",
    () => {

        closeModal(
            "form-modal"
        );

    }
);


/* Close modal by clicking outside */

window.addEventListener(
    "click",
    (e) => {

        if (
            e.target.classList.contains(
                "modal-overlay"
            )
        ) {

            e.target.classList.remove(
                "active"
            );

            activeRecipeId = null;

        }

    }
);


/* =====================================================
   29. EXPORT
===================================================== */

exportBtn.addEventListener(
    "click",
    () => {

        const data =
            JSON.stringify(
                recipes,
                null,
                2
            );


        navigator.clipboard
            .writeText(data)
            .then(
                () => {

                    alert(
                        "Recipe data copied to clipboard!"
                    );

                }
            )
            .catch(
                () => {

                    alert(
                        "Unable to copy recipe data."
                    );

                }
            );

    }
);


/* =====================================================
   30. INITIAL START
===================================================== */

authScreen.classList.remove(
    "hidden"
);

appDashboard.classList.add(
    "hidden"
);

showAuthPanel(
    authChoice
);
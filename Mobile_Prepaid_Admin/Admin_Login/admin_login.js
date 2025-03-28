
  // Profile-DropDown-JS

  // Profile-DropDown-JS

  document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.querySelector(".user-dropdown");
    const userIcon = document.querySelector(".user-dropdown i");
    const dropdownContent = document.querySelector(".dropdown-content");
    const signOutBtn = document.getElementById("signOutBtn");
    const myAccountBtn = document.getElementById("myAccountBtn");

    // Logout function
    async function handleLogout(event) {
        event.preventDefault();
        
        const accessToken = sessionStorage.getItem("accessToken");
        const currentCustomer = sessionStorage.getItem("currentCustomer");

        try {
            // Parse customer data safely
            const storedCustomer = currentCustomer ? JSON.parse(currentCustomer) : null;
            
            // Logout API Request
            const logoutResponse = await fetch("http://localhost:8083/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({ 
                    refreshToken: storedCustomer?.refreshToken || null 
                })
            });

            // Clear session storage
            sessionStorage.removeItem("currentCustomer");
            sessionStorage.removeItem("accessToken");
            localStorage.removeItem("accessToken");
            
            // Redirect to login page
            window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
        } catch (error) {
            console.error("Logout error:", error);
            // Fallback: Clear session storage
            sessionStorage.removeItem("currentCustomer");
            sessionStorage.removeItem("accessToken");
            localStorage.removeItem("accessToken");
            window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
        }
    }

    // Function to check authentication and set up dropdown
    function setupDropdown() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");
        const accessToken = sessionStorage.getItem("accessToken");

        if (currentCustomer && accessToken) {
            // User is authenticated
            userIcon.onclick = function(event) {
                event.stopPropagation();
                userDropdown.classList.toggle("active");
            };

            // Set up sign out button
            if (signOutBtn) {
                signOutBtn.onclick = handleLogout;
            }

            // Set up my account button
            if (myAccountBtn) {
                myAccountBtn.onclick = function() {
                    window.location.href = "/Mobile_Prepaid_Customer/My_Account/My_Account.html";
                };
            }
        } else {
            // User is not authenticated
            userIcon.onclick = function() {
                window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
            };
        }
    }

    // Initialize dropdown
    setupDropdown();

    // Close dropdown when clicking outside
    document.addEventListener("click", function(event) {
        if (userDropdown && !userDropdown.contains(event.target)) {
            userDropdown.classList.remove("active");
        }
    });

    // Handle storage changes across tabs/windows
    window.addEventListener("storage", function (event) {
        if (event.key === "currentCustomer" || event.key === "accessToken") {
            if (!sessionStorage.getItem("currentCustomer") || !sessionStorage.getItem("accessToken")) {
                window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
            }
            
            // Reinitialize dropdown on storage change
            setupDropdown();
        }
    });
});





// Validate-Admin-Login-Js

// Patterns for Validation
var userNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
var adminCodePattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W]).{8,}$/;

// Error span elements (to show validation errors)
var usernameSpanError = document.getElementById("usernameSpanError");
var adminCodeSpanError = document.getElementById("adminCodeSpanError");

// Input fields
var username = document.getElementById("username");
var adminCode = document.getElementById("adminCode");

// Form reference
var form = document.querySelector("form");

// Event Listener for Form Submission
form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    var usernameValue = username.value.trim();
    var adminCodeValue = adminCode.value.trim();

    if (!validateForm(usernameValue, adminCodeValue)) {
        return; // Stop if validation fails
    }

    try {
        // 1️⃣ Send login request
        const loginResponse = await fetch("http://localhost:8083/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameValue,
                password: adminCodeValue
            })
        });

        if (!loginResponse.ok) {
            throw new Error("Invalid credentials or server error.");
        }

        const loginData = await loginResponse.json();
        const adminAccessToken = loginData.accessToken;

        // Store admin access token separately in session storage
        sessionStorage.setItem("adminAccessToken", adminAccessToken);

        // 2️⃣ Fetch user profile
        const profileResponse = await fetch("http://localhost:8083/auth/profile", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + adminAccessToken
            }
        });

        if (!profileResponse.ok) {
            throw new Error("Failed to fetch user profile.");
        }

        const profileData = await profileResponse.json();

        // Store user details in session storage as 'currentCustomer'
        sessionStorage.setItem("currentCustomer", JSON.stringify(profileData));

        // Redirect to admin dashboard on success
        window.location.href = "/Mobile_Prepaid_Admin/admin_dashboard/Summary_View/admin_dashboard.html";

    } catch (error) {
        alert("Login failed: " + error.message);
    }
});

// On-Input Change (Clear Errors on Typing)
username.addEventListener("input", function () {
    usernameSpanError.innerHTML = "";
});

adminCode.addEventListener("input", function () {
    adminCodeSpanError.innerHTML = "";
});

// Validation Function
function validateForm(usernameValue, adminCodeValue) {
    var isValid = true;

    // Username Validation
    if (usernameValue === "") {
        usernameSpanError.innerHTML = "Username is required.";
        isValid = false;
    } else if (!userNamePattern.test(usernameValue)) {
        usernameSpanError.innerHTML = "Invalid username format.";
        isValid = false;
    }

    // Admin Code Validation
    if (adminCodeValue === "") {
        adminCodeSpanError.innerHTML = "Admin Special Code is required.";
        isValid = false;
    } else if (!adminCodePattern.test(adminCodeValue)) {
        adminCodeSpanError.innerHTML = "Invalid admin code format.";
        isValid = false;
    }

    return isValid;
}
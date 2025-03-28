document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide('#image-carousel', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        interval: 3000,
        pauseOnHover: true,
        arrows: true, // Navigation arrows enabled
        pagination: false,
    });

    var bar = document.querySelector('.my-slider-progress-bar');

    splide.on('mounted move', function () {
        var end = splide.Components.Controller.getEnd() + 1;
        var rate = Math.min((splide.index + 1) / end, 1);
        bar.style.width = String(100 * rate) + '%';
    });

    splide.mount();
});



// <!-- Initialize Splide.js -->

  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#why-choose-slider', {
      type: 'slide',
      perPage: 3,
      perMove: 1,
      gap: '20px',
      pagination: false,
      arrows: true,
      breakpoints: {
        1024: { perPage: 2 },
        768: { perPage: 1 }
      }
    }).mount();
  });





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







// Mobile-Validation-Js with Backend Authentication

var phonePattern = /^\d{10}$/;
var rechargePhoneError = document.getElementById("rechargePhoneError-quick");
var rechargePhone = document.getElementById("rechargePhone-quick");
var rechargeForm = document.getElementById("rechargeForm-quick");

// API Endpoints
const LOGIN_URL = "http://localhost:8083/auth/login";
const PROFILE_URL = "http://localhost:8083/auth/profile";

// Event Listener for Form Submission
rechargeForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, "");
    
    if (!validateRechargeForm(phoneNumberValue)) return;
    
    try {
        // Login API Request
        let loginResponse = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile: phoneNumberValue })
        });

        if (!loginResponse.ok) {
            throw new Error("Login failed. Invalid credentials.");
        }

        let loginData = await loginResponse.json();
        sessionStorage.setItem("accessToken", loginData.accessToken);

        // Fetch User Profile
        let profileResponse = await fetch(PROFILE_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${loginData.accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!profileResponse.ok) {
            throw new Error("Failed to fetch user profile.");
        }

        let userProfile = await profileResponse.json();
        sessionStorage.setItem("currentCustomer", JSON.stringify(userProfile));

        // Redirect after successful login & profile retrieval
        window.location.href = "/Mobile_Prepaid_Customer/Prepaid_plans_Page/Popular_plans/prepaid.html";
    } catch (error) {
        rechargePhoneError.innerHTML = `🚫 ${error.message}`;
    }
});

// Dynamic Error Display on Input Change
rechargePhone.addEventListener("input", function () {
    var phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, "");
    validateRechargeForm(phoneNumberValue);
});

// Validation Function
function validateRechargeForm(phoneNumberValue) {
    rechargePhoneError.innerHTML = "";
    if (phoneNumberValue === "") {
        rechargePhoneError.innerHTML = "📢 Phone Number is required.";
        return false;
    }
    if (!/^\d*$/.test(phoneNumberValue)) {
        rechargePhoneError.innerHTML = "⚠️ Enter only digits (0-9).";
        return false;
    }
    if (phoneNumberValue.length < 10) {
        rechargePhoneError.innerHTML = "⚠️ Enter a valid 10-digit phone number.";
        return false;
    }
    if (phoneNumberValue.length > 10) {
        rechargePhoneError.innerHTML = "❌ Phone number should be 10 digits long.";
        return false;
    }
    return true;
}





// Most preferred prepaid plans



// Most preferred prepaid plans with Popup functionality

document.addEventListener("DOMContentLoaded", async function () {
    const container = document.querySelector(".best_plans_div");

    // OTT Logo Mapping
    const logoMap = {
        "Netflix": "./assets/best_popular_plans/Netflix_Logo.svg",
        "Amazon Prime": "./assets/best_popular_plans/Prime_Logo.svg",
        "Sony LIV": "./assets/best_popular_plans/Sony_Logo.svg",
        "Sun NXT": "./assets/best_popular_plans/Sun_nxt_Logo.svg",
        "Zee5": "./assets/best_popular_plans/Zee5_Logo.svg"
    };

    // Fetch transactions and determine the most preferred plans
    async function fetchMostPreferredPlans() {
        try {
            const response = await fetch("http://localhost:8083/api/transactions");
            const transactions = await response.json();

            // Count occurrences of each plan based on transactions
            const planFrequency = {};
            transactions.forEach(transaction => {
                const planName = transaction.plan.planName;
                planFrequency[planName] = (planFrequency[planName] || 0) + 1;
            });

            // Sort plans by popularity (descending order) and get top 3
            return Object.entries(planFrequency)
                .sort((a, b) => b[1] - a[1]) // Sort by frequency
                .slice(0, 3) // Get top 3
                .map(entry => entry[0]); // Extract plan names
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return [];
        }
    }

    // Fetch plan details for the selected plans
    async function fetchPlanDetails(planNames) {
        try {
            const response = await fetch("http://localhost:8083/api/prepaid-plans");
            const allPlans = await response.json();
            return allPlans.filter(plan => planNames.includes(plan.planName));
        } catch (error) {
            console.error("Error fetching plans:", error);
            return [];
        }
    }

    // Generate and display plan cards dynamically
    function displayPlans(plans) {
        container.innerHTML = ""; // Clear previous content

        plans.forEach(plan => {
            const card = document.createElement("div");
            card.classList.add("best_card");

            let benefitsHTML = "";
            if (plan.validity) {
                benefitsHTML += `<div class="benefit">📆 ${plan.validity} Days</div>`;
            }
            if (plan.dailyData) {
                benefitsHTML += `<div class="benefit">📶 ${plan.dailyData}</div>`;
            }
            if (plan.voice) {
                benefitsHTML += `<div class="benefit">📞 ${plan.voice}</div>`;
            }
            if (plan.totalData) {
                benefitsHTML += `<div class="benefit">🌐 ${plan.totalData}</div>`;
            }
            if (plan.sms) {
                benefitsHTML += `<div class="benefit">✉️ ${plan.sms}</div>`;
            }

            // OTT Icons with Correct Size & Styling
            let ottHTML = "";
            if (plan.ott && plan.ott.length > 0) {
                ottHTML = `
                    <div class="ott-container">
                        <h4>OTT Benefits</h4>
                        <div class="ott-icons">
                            ${plan.ott.map(ott => {
                                const logoSrc = logoMap[ott] || "";
                                return logoSrc ? `<img src="${logoSrc}" alt="${ott}" class="ott-logo">` : "";
                            }).join("")}
                        </div>
                    </div>
                `;
            }

            let termsHTML = "";
            if (plan.terms && plan.terms.length > 0) {
                termsHTML = `
                    <div class="terms-container">
                        <h4>Terms & Conditions</h4>
                        ${plan.terms.map(term => `<p>✔️ ${term}</p>`).join("")}
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="card-header">
                    <div class="plan-name">${plan.planName}</div>
                </div>
                <div class="price">₹${plan.price}/month</div>
                <div class="card-content">
                    <div class="plan_basic_details">
                        ${benefitsHTML}
                    </div>
                    <div class="plan_benefit_details">
                        ${ottHTML}
                        ${termsHTML}
                    </div>
                </div>
                <div class="card-footer">
                  <button class="buy-button" data-plan='${JSON.stringify(plan)}'>Buy Now</button>
                </div>
            `;

            container.appendChild(card);
        });

        // Add event listeners to Buy Now buttons after cards are created
        attachBuyButtonListeners();
    }

    // Attach event listeners to Buy Now buttons
   // Attach event listeners to Buy Now buttons
function attachBuyButtonListeners() {
    const buyButtons = document.querySelectorAll(".buy-button");
    buyButtons.forEach(button => {
        button.addEventListener("click", function() {
            const planData = JSON.parse(this.getAttribute("data-plan"));
            
            // Store the selected plan in session storage
            sessionStorage.setItem('currentPlan', JSON.stringify(planData));
            console.log('Plan stored in session storage:', planData);
            
            // Then open the popup as in the original code
            openPopup(planData);
        });
    });
}

    // Function to open popup with plan details
    function openPopup(planData) {
        // Set plan title and cost in popup header
        document.querySelector(".plan-title-custom").textContent = planData.planName;
        document.querySelector(".plan-cost-custom").textContent = `₹${planData.price}/month`;

        // Populate plan details table
        const tableBody = document.getElementById("plan-details-body");
        tableBody.innerHTML = "";

        // Add rows for each plan detail
        if (planData.validity) {
            addTableRow(tableBody, "Validity", `${planData.validity} Days`);
        }
        if (planData.dailyData) {
            addTableRow(tableBody, "Daily Data", planData.dailyData);
        }
        if (planData.totalData) {
            addTableRow(tableBody, "Total Data", planData.totalData);
        }
        if (planData.voice) {
            addTableRow(tableBody, "Voice", planData.voice);
        }
        if (planData.sms) {
            addTableRow(tableBody, "SMS", planData.sms);
        }

        // Handle OTT benefits section
        const extraPerksSection = document.querySelector(".extra-perks-custom");
        const perksList = document.querySelector(".perk-list-custom");
        perksList.innerHTML = "";

        if (planData.ott && planData.ott.length > 0) {
            extraPerksSection.style.display = "block";
            planData.ott.forEach(ottName => {
                const perkItem = document.createElement("div");
                perkItem.classList.add("perk-item-custom");

                const logoSrc = logoMap[ottName] || "";
                let iconHTML = "";
                
                if (logoSrc) {
                    iconHTML = `<img src="${logoSrc}" alt="${ottName}">`;
                } else {
                    // Fallback icon if image not available
                    const firstLetter = ottName.charAt(0);
                    const className = ottName.toLowerCase().replace(/\s+/g, "");
                    iconHTML = `<div class="fallback-icon ${className}">${firstLetter}</div>`;
                }

                perkItem.innerHTML = `
                    ${iconHTML}
                    <div class="perk-title-custom">${ottName}</div>
                `;
                perksList.appendChild(perkItem);
            });
        } else {
            extraPerksSection.style.display = "none";
        }

        // Handle Terms & Conditions
        const termsSection = document.querySelector(".popup-terms-custom");
        const termsContent = document.getElementById("terms-content");
        termsContent.innerHTML = "";

        if (planData.terms && planData.terms.length > 0) {
            termsSection.style.display = "block";
            planData.terms.forEach(term => {
                const termItem = document.createElement("p");
                termItem.innerHTML = `✔️ ${term}`;
                termsContent.appendChild(termItem);
            });
        } else {
            termsSection.style.display = "none";
        }

        // Show the popup
        document.getElementById("unique-popup-overlay").classList.add("active");
    }

    // Helper function to add table rows
    function addTableRow(tableBody, feature, detail) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${feature}</td>
            <td class="separator"></td>
            <td>${detail}</td>
        `;
        tableBody.appendChild(row);
    }

    // Main function to fetch data and generate UI
    async function loadPreferredPlans() {
        const topPlans = await fetchMostPreferredPlans();
        if (topPlans.length > 0) {
            const planDetails = await fetchPlanDetails(topPlans);
            displayPlans(planDetails);
        }
    }

    // Initialize popup close button event listener
    document.getElementById("close-unique-popup").addEventListener("click", function() {
        document.getElementById("unique-popup-overlay").classList.remove("active");
    });

    // Mobile Validation JS with Backend Authentication
    const rechargePhoneError = document.getElementById("rechargePhoneError");
    const rechargePhone = document.getElementById("rechargePhone");
    const rechargeButton = document.querySelector(".purchase-button-custom");

    // API Endpoints
    const LOGIN_URL = "http://localhost:8083/auth/login";
    const PROFILE_URL = "http://localhost:8083/auth/profile";

    // Check if currentCustomer exists in session storage
    const currentCustomer = sessionStorage.getItem("currentCustomer");

    if (currentCustomer) {
        // Hide input field if currentCustomer exists
        rechargePhone.style.display = "none";
        rechargePhoneError.style.display = "none";

        // Directly redirect to the payment page on recharge button click
        rechargeButton.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/payment.html";
        });
    } else {
        // Event Listener for Recharge Button Click
        rechargeButton.addEventListener("click", async function(event) {
            event.preventDefault();
            const phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, "");

            // Frontend Validation
            if (!validateRechargeForm(phoneNumberValue)) return;

            try {
                // Backend Validation: Check if the number exists
                let loginResponse = await fetch(LOGIN_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mobile: phoneNumberValue })
                });

                if (!loginResponse.ok) {
                    throw new Error("🚫 Invalid phone number. Please enter a valid registered number.");
                }

                let loginData = await loginResponse.json();
                sessionStorage.setItem("accessToken", loginData.accessToken);

                // Fetch User Profile
                let profileResponse = await fetch(PROFILE_URL, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${loginData.accessToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!profileResponse.ok) {
                    throw new Error("🚫 Failed to fetch user profile. Please try again.");
                }

                let userProfile = await profileResponse.json();
                sessionStorage.setItem("currentCustomer", JSON.stringify(userProfile));

                // ✅ Redirect to Payment Page on Success
                window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/payment.html";
            } catch (error) {
                rechargePhoneError.innerHTML = error.message;
            }
        });

        // Dynamic Error Display on Input Change
        rechargePhone.addEventListener("input", function() {
            const phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, "");
            validateRechargeForm(phoneNumberValue);
        });
    }

    // Validation Function
    function validateRechargeForm(phoneNumberValue) {
        rechargePhoneError.innerHTML = ""; // Clear previous errors

        if (phoneNumberValue === "") {
            rechargePhoneError.innerHTML = "📢 Phone Number is required.";
            return false;
        }
        if (!/^\d*$/.test(phoneNumberValue)) {
            rechargePhoneError.innerHTML = "⚠️ Enter only digits (0-9).";
            return false;
        }
        if (phoneNumberValue.length < 10) {
            rechargePhoneError.innerHTML = "⚠️ Enter a valid 10-digit phone number.";
            return false;
        }
        if (phoneNumberValue.length > 10) {
            rechargePhoneError.innerHTML = "❌ Phone number should be exactly 10 digits.";
            return false;
        }
        return true;
    }

    // Start loading plans
    loadPreferredPlans();
});
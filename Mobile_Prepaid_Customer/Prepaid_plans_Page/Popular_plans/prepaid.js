
    // Profile-DropDown-JS

    document.addEventListener("DOMContentLoaded", function () {
        const userDropdown = document.querySelector(".user-dropdown");
        const dropdownContent = document.querySelector(".dropdown-content");
        const userIcon = document.getElementById("userIcon"); // User icon
        const signOutBtn = document.getElementById("signOutBtn"); // Sign-out button
    
        function updateDropdown() {
            const currentCustomer = sessionStorage.getItem("currentCustomer");
    
            if (currentCustomer) {
                // Show dropdown when user icon is clicked
                userIcon.onclick = function (event) {
                    event.stopPropagation();
                    dropdownContent.classList.toggle("active");
                };
    
                // Ensure dropdown is visible
                dropdownContent.style.display = "block";
    
                // Sign-out functionality
                signOutBtn.onclick = function (event) {
                    event.preventDefault();
                    sessionStorage.removeItem("currentCustomer"); // Remove session storage
    
                    // Ensure the storage is cleared before redirecting
                    setTimeout(() => {
                        window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html"; 
                    }, 100);
                };
            } else {
                // If not logged in, clicking the user icon redirects to the recharge page
                userIcon.onclick = function () {
                    window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
                };
    
                // Ensure dropdown is hidden
                dropdownContent.style.display = "none";
            }
        }
    
        // Initialize dropdown behavior
        updateDropdown();
    
        // Close dropdown when clicking outside
        document.addEventListener("click", function (event) {
            if (!userDropdown.contains(event.target)) {
                dropdownContent.classList.remove("active");
            }
        });
    
        // Handle case where user manually navigates away after signing out
        window.addEventListener("storage", function () {
            if (!sessionStorage.getItem("currentCustomer")) {
                window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
            }
        });
    
        // Listen for login event from the recharge form
        window.addEventListener("storage", function () {
            if (sessionStorage.getItem("currentCustomer")) {
                updateDropdown(); // Update dropdown dynamically after login
            }
        });
    
    });
    









// Inside-Search-Js

// Dynamic Search Functionality for Prepaid Plans

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".tool_search input"); // Search input field
    const cardContainer = document.querySelector(".plan_card-container"); // Parent container for dynamically added cards

    // Function to filter dynamically generated cards
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        const viCards = document.querySelectorAll(".vi_card"); // Fetch all currently available cards

        viCards.forEach((card) => {
            const planName = card.querySelector(".plan-name")?.textContent.toLowerCase() || "";
            const price = card.querySelector(".price")?.textContent.toLowerCase() || "";
            const ottText = card.querySelector(".ott-text-data")?.textContent.toLowerCase() || "";
            const benefits = Array.from(card.querySelectorAll(".benefit"))
                .map(b => b.textContent.toLowerCase())
                .join(" "); // Combine all benefits

            // Check if search term matches any relevant text
            if (planName.includes(searchTerm) || price.includes(searchTerm) || benefits.includes(searchTerm) || ottText.includes(searchTerm)) {
                card.style.display = "block"; // Show matching cards
            } else {
                card.style.display = "none"; // Hide non-matching cards
            }
        });
    }

    // Trigger search when typing
    searchInput.addEventListener("input", performSearch);

    // Trigger search when pressing Enter
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent unintended form submission
            performSearch();
        }
    });

    // Observe dynamically added cards and reapply search when new plans are loaded
    const observer = new MutationObserver(() => {
        performSearch();
    });

    if (cardContainer) {
        observer.observe(cardContainer, { childList: true, subtree: true });
    }

    // Reapply search when new cards are added
    document.addEventListener("cardsUpdated", performSearch);
});






//Filter-Dynamic-Change-Design-JS

//Filter-Dynamic-Change-Design-JS
document.addEventListener("DOMContentLoaded", function () {
    const filterCategories = document.querySelectorAll(".filter-category");
    const filterOptionsDiv = document.getElementById("filterOptions");
    const filterHeader = document.getElementById("filterHeader");
    const filterModal = document.getElementById("filterModal");
    const openFilterBtn = document.querySelector(".filter_button button");
    const resetFiltersBtn = document.getElementById("resetFilters");
    const confirmFiltersBtn = document.getElementById("confirmFilters");
    const closeFilterBtn = document.getElementById("closeFilter");

    let filters = {
        ott: new Set(),
        totalData: new Set(),
        validity: new Set(),
        dataSpeed: new Set(),
        price: new Set()
    };

    let selectedFilters = {
        ott: new Set(),
        totalData: new Set(),
        validity: new Set(),
        dataSpeed: new Set(),
        price: new Set()
    };

    // Hide modal initially
    filterModal.style.display = "none";

    // Open filter modal
    openFilterBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        filterModal.style.display = "flex";
    });

    // Close filter modal when clicking outside or clicking X button
    document.addEventListener("click", function (event) {
        if (!filterModal.contains(event.target) && !openFilterBtn.contains(event.target)) {
            filterModal.style.display = "none";
        }
    });

    filterModal.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    closeFilterBtn.addEventListener("click", function () {
        filterModal.style.display = "none";
    });

    // Extract unique filter values from dynamically generated cards
    function extractFilters() {
        filters = {
            ott: new Set(),
            totalData: new Set(),
            validity: new Set(),
            dataSpeed: new Set(),
            price: new Set()
        };

        document.querySelectorAll(".vi_card").forEach(card => {
            const extractText = (selector) => {
                const element = card.querySelector(selector);
                return element ? element.parentElement.innerText.trim() : null;
            };

            const totalData = extractText(".benefit i.fa-wifi");
            if (totalData) filters.totalData.add(totalData);

            const validity = extractText(".benefit i.fa-calendar-alt");
            if (validity) filters.validity.add(validity);

            const dataSpeed = extractText(".benefit i.fa-tachometer-alt");
            if (dataSpeed) filters.dataSpeed.add(dataSpeed);

            const priceMatch = card.querySelector(".price")?.innerText.match(/₹(\d+)/);
            if (priceMatch) filters.price.add(`₹${priceMatch[1]}`);

            const ottElement = card.querySelector(".ott-text-data");
            if (ottElement) {
                ottElement.innerText.split(", ").forEach(ott => filters.ott.add(ott.trim()));
            }
        });

        updateFilterUI();
    }

    // Update filter UI dynamically
    function updateFilterUI() {
        const activeCategory = document.querySelector(".filter-category.active")?.getAttribute("data-filter");
        filterOptionsDiv.innerHTML = generateFilterOptions(activeCategory);
        addCheckboxEventListeners();

        // Hide empty categories
        filterCategories.forEach(category => {
            const key = category.getAttribute("data-filter");
            category.style.display = filters[key]?.size ? "block" : "none";
        });
    }

    // Generate checkboxes dynamically, keeping previous selections
    function generateFilterOptions(filterKey) {
        if (!filters[filterKey] || filters[filterKey].size === 0) return "<p>No options available</p>";

        return Array.from(filters[filterKey])
            .map(value => `
                <label>
                    <input type="checkbox" class="filter-checkbox" value="${value}" ${selectedFilters[filterKey].has(value) ? "checked" : ""}>
                    <span class="checkmark"></span> ${value}
                </label>`)
            .join("");
    }

    // Handle category selection
    filterCategories.forEach(category => {
        category.addEventListener("click", function () {
            filterHeader.textContent = this.textContent;
            filterOptionsDiv.innerHTML = generateFilterOptions(this.getAttribute("data-filter"));
            filterOptionsDiv.style.display = "block";

            filterCategories.forEach(cat => cat.classList.remove("active"));
            this.classList.add("active");

            addCheckboxEventListeners();
        });
    });

    // Filtering function with cross-filtering support
    function filterCards() {
        document.querySelectorAll(".vi_card").forEach(card => {
            let matchesAll = true;

            Object.keys(selectedFilters).forEach(category => {
                if (selectedFilters[category].size > 0) {
                    let cardFilters = new Set();

                    const extractText = (selector) => {
                        const element = card.querySelector(selector);
                        return element ? element.parentElement.innerText.trim() : null;
                    };

                    if (category === "totalData") cardFilters.add(extractText(".benefit i.fa-wifi"));
                    if (category === "validity") cardFilters.add(extractText(".benefit i.fa-calendar-alt"));
                    if (category === "dataSpeed") cardFilters.add(extractText(".benefit i.fa-tachometer-alt"));

                    if (category === "price") {
                        const priceMatch = card.querySelector(".price")?.innerText.match(/₹(\d+)/);
                        if (priceMatch) cardFilters.add(`₹${priceMatch[1]}`);
                    }

                    if (category === "ott") {
                        const ottElement = card.querySelector(".ott-text-data");
                        if (ottElement) {
                            ottElement.innerText.split(", ").forEach(ott => cardFilters.add(ott.trim()));
                        }
                    }

                    if (![...selectedFilters[category]].some(filter => cardFilters.has(filter))) {
                        matchesAll = false;
                    }
                }
            });

            card.style.display = matchesAll ? "block" : "none";
        });
    }

    // Add event listeners for checkboxes
    function addCheckboxEventListeners() {
        document.querySelectorAll(".filter-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", function () {
                const category = document.querySelector(".filter-category.active")?.getAttribute("data-filter");
                if (!category) return;

                if (this.checked) {
                    selectedFilters[category].add(this.value);
                } else {
                    selectedFilters[category].delete(this.value);
                }

                filterCards();
            });
        });
    }

    // Reset filters
    resetFiltersBtn.addEventListener("click", function () {
        Object.keys(selectedFilters).forEach(category => selectedFilters[category].clear());
        document.querySelectorAll(".filter-checkbox:checked").forEach(cb => cb.checked = false);
        filterCards();
    });

    // Apply filters and close modal
    confirmFiltersBtn.addEventListener("click", function () {
        filterModal.style.display = "none";
    });

    // Update filters when new cards are added
    document.addEventListener("cardsUpdated", extractFilters);

    // Initial filter extraction
    extractFilters();
});











// Dynamic-OTT-JS for Multiple Cards
document.addEventListener("DOMContentLoaded", function() {
    function updateOTTIcons() {
        document.querySelectorAll(".vi_card").forEach(card => {
            const ottTextElement = card.querySelector(".ott-text-data");
            const ottIconsContainer = card.querySelector(".ott-icons");
            const moreOtt = card.querySelector(".more-ott");

            if (ottTextElement && ottIconsContainer && moreOtt) {
                const ottServices = ottTextElement.innerText.split(", ").map(ott => ott.trim());
                
                const ottLogos = {
                    "Netflix": "./assets/Netflix_Logo.svg",
                    "Amazon Prime": "./assets/Prime_Logo.svg",
                    "Sony LIV": "./assets/Sony_Logo.svg",
                    "Sun NXT": "./assets/Sun_nxt_Logo.svg",
                    "Zee5": "./assets/Zee5_Logo.svg"
                };

                ottIconsContainer.innerHTML = "";
                moreOtt.innerText = "";

                let loadedIcons = 0;

                ottServices.forEach(ott => {
                    if (ottLogos[ott] && loadedIcons < 3) {
                        let icon = document.createElement("div");
                        icon.classList.add("icon");

                        let img = document.createElement("img");
                        img.src = ottLogos[ott];
                        img.alt = ott;

                        // Handle image load errors
                        img.onerror = function() {
                            icon.innerText = ott.charAt(0);  // Show first letter if image fails
                            img.remove(); // Remove broken image
                        };

                        icon.appendChild(img);
                        ottIconsContainer.appendChild(icon);
                        loadedIcons++;
                    }
                });

                // Show "+ more" if there are extra OTT services
                if (ottServices.length > 3) {
                    moreOtt.innerText = `+${ottServices.length - 3} more OTT`;
                }
            }
        });
    }

    // Run initially
    updateOTTIcons();

    // Run after dynamically generated cards are added
    document.addEventListener("cardsUpdated", updateOTTIcons);
});




// Dynamic-Pop-up-Content-JS 
// Dynamic OTT Icons with Fallback Handling (Now Fully Dynamic)
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".vi_card").forEach(card => {
        const ottTextElement = card.querySelector(".ott-text-data");
        const ottIconsContainer = card.querySelector(".ott-icons");
        const moreOtt = card.querySelector(".more-ott");

        if (ottTextElement) {
            const ottServices = ottTextElement.innerText.split(", ").map(ott => ott.trim());
            const ottClassMap = {
                "Netflix": "netflix",
                "Amazon Prime": "prime",
                "Sony LIV": "sony",
                "Sun NXT": "sun",
                "Zee5": "zee5"
            };

            const ottLogos = {
                "Netflix": "./assets/Netflix_Logo.svg",
                "Amazon Prime": "./assets/Prime_Logo.svg",
                "Sony LIV": "./assets/Sony_Logo.svg",
                "Sun NXT": "./assets/Sun_nxt_Logo.svg",
                "Zee5": "./assets/Zee5_Logo.svg"
            };

            ottIconsContainer.innerHTML = "";
            moreOtt.innerText = "";

            let loadedIcons = 0;

            ottServices.forEach(ott => {
                if (loadedIcons < 3) {
                    let icon = document.createElement("div");
                    icon.classList.add("icon");

                    // Apply background color class
                    if (ottClassMap[ott]) {
                        icon.classList.add(ottClassMap[ott]);
                    }

                    let img = document.createElement("img");
                    img.src = ottLogos[ott] || "";
                    img.alt = ott;

                    let fallbackText = document.createElement("span");
                    fallbackText.classList.add("fallback-icon");
                    fallbackText.innerText = ott.charAt(0).toUpperCase(); // First letter as fallback

                    img.onerror = function () {
                        img.remove(); // Remove broken image
                        icon.appendChild(fallbackText);
                    };

                    if (ottLogos[ott]) {
                        icon.appendChild(img);
                    } else {
                        icon.appendChild(fallbackText);
                    }

                    ottIconsContainer.appendChild(icon);
                    loadedIcons++;
                }
            });

            // Show "+ more" if there are extra OTT services
            if (ottServices.length > 3) {
                moreOtt.innerText = `+${ottServices.length - 3} more OTT`;
            }
        }
    });
});







// Dynamic Pop-up Content JS
// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    fetch("./Prepaid_plans_json/popular_plans.json")
        .then(response => response.json())
        .then(plans => generatePopularPlans(plans))
        .catch(error => console.error("Error loading plans:", error));

    // Attach event listener to the container to handle dynamically added elements
    document.querySelector(".plan_card-container").addEventListener("click", function (e) {
        if (e.target.classList.contains("open-popup") || e.target.closest(".open-popup")) {
            e.preventDefault();
            openPopup(e.target.closest(".vi_card"));
        }
    });

    // Close popup event
    document.getElementById("close-unique-popup").addEventListener("click", function () {
        document.getElementById("unique-popup-overlay").classList.remove("active");
    });
});

// Function to open the popup dynamically
function openPopup(card) {
    if (!card) return;

    // Set Plan Name & Cost
    document.querySelector(".plan-title-custom").textContent = card.querySelector(".plan-name").textContent;
    document.querySelector(".plan-cost-custom").textContent = card.querySelector(".price").textContent;

    // Map icons to their respective features
    const featureMap = {
        "fas fa-clock": "Expires on",
        "fas fa-calendar-alt": "Pack validity",
        "fas fa-tachometer-alt": "Data at high speed*",
        "fas fa-phone-alt": "Voice",
        "fas fa-wifi": "Total data",
        "fas fa-envelope": "SMS"
    };

    // Populate Plan Details Table
    const planDetailsBody = document.getElementById("plan-details-body");
    planDetailsBody.innerHTML = "";

    card.querySelectorAll(".benefit").forEach(benefit => {
        const iconClass = benefit.querySelector("i")?.className.trim();
        const textValue = benefit.textContent.trim();

        if (iconClass && textValue) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="feature-name">${featureMap[iconClass] || "Unknown"}</td>
                <td class="feature-separator"></td>
                <td class="feature-value">${textValue}</td>
            `;
            planDetailsBody.appendChild(row);
        }
    });

    // Populate OTT Benefits
    const perkList = document.querySelector(".perk-list-custom");
    perkList.innerHTML = "";

    const ottTextElement = card.querySelector(".ott-text-data");
    if (ottTextElement) {
        const ottNames = ottTextElement.textContent.split(", ").map(ott => ott.trim());
        const ottDescriptions = card.querySelectorAll(".ott-description-data div");

        const logoMap = {
            "Netflix": "./assets/Netflix_Logo.svg",
            "Amazon Prime": "./assets/Prime_Logo.svg",
            "Sony LIV": "./assets/Sony_Logo.svg",
            "Sun NXT": "./assets/Sun_nxt_Logo.svg",
            "Zee5": "./assets/Zee5_Logo.svg"
        };

        const classMap = {
            "Netflix": "netflix",
            "Amazon Prime": "prime",
            "Sony LIV": "sony",
            "Sun NXT": "sun",
            "Zee5": "zee5"
        };

        function createFallbackIcon(name) {
            const fallbackDiv = document.createElement("div");
            fallbackDiv.classList.add("fallback-icon", classMap[name] || "default-fallback");
            fallbackDiv.innerText = name.charAt(0).toUpperCase();
            return fallbackDiv;
        }

        ottNames.forEach(name => {
            const desc = [...ottDescriptions].find(div => div.getAttribute("data-ott") === name)?.textContent || "";
            const imgSrc = logoMap[name] || "";

            const perkItem = document.createElement("div");
            perkItem.classList.add("perk-item-custom");

            let imgElement = document.createElement("img");
            imgElement.src = imgSrc;
            imgElement.alt = `${name} Logo`;

            imgElement.onerror = function () {
                imgElement.remove();
                perkItem.insertBefore(createFallbackIcon(name), perkItem.firstChild);
            };

            if (imgSrc) {
                perkItem.appendChild(imgElement);
            } else {
                perkItem.appendChild(createFallbackIcon(name));
            }

            const perkInfo = document.createElement("div");
            perkInfo.classList.add("perk-info-custom");
            perkInfo.innerHTML = `<span class="perk-title-custom">${name}</span><p>${desc}</p>`;

            perkItem.appendChild(perkInfo);
            perkList.appendChild(perkItem);
        });
    }

    // Set Terms & Conditions
    const termsContainer = document.getElementById("terms-content");
    termsContainer.innerHTML = "";

    card.querySelectorAll(".terms-conditions p").forEach(p => {
        const paragraph = document.createElement("p");
        paragraph.textContent = p.textContent;
        termsContainer.appendChild(paragraph);
    });

    // Show Popup
    document.getElementById("unique-popup-overlay").classList.add("active");
}








// Popular-Plans-Dynamically-Generate-cards

document.addEventListener("DOMContentLoaded", function () {
    const planCategories = document.querySelectorAll(".sidebar nav a");
    const container = document.querySelector(".plan_card-container");

    // Function to Load JSON Data Dynamically
    function loadPlans(category) {
        fetch(`./Prepaid_plans_json/${category}.json`) // ✅ Corrected Fetch Path
            .then(response => response.json())
            .then(plans => {
                generatePlans(plans); // Generate cards dynamically for all categories
            })
            .catch(error => console.error(`Error loading ${category}.json:`, error));
    }

    // Function to Generate Plan Cards (Handles Missing Data)
    function generatePlans(plans) {
        container.innerHTML = ""; // Clear previous content

        plans.forEach(plan => {
            const card = document.createElement("div");
            card.classList.add("vi_card");

            let benefitsHTML = "";

            if (plan.validity) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-calendar-alt"></i> ${plan.validity} Days</div>`;
            }
            if (plan.dailyData) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-tachometer-alt"></i> ${plan.dailyData}</div>`;
            }
            if (plan.voice) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-phone-alt"></i> ${plan.voice}</div>`;
            }
            if (plan.totalData) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-wifi"></i> ${plan.totalData}</div>`;
            }
            if (plan.sms) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-envelope"></i> ${plan.sms}</div>`;
            }
            

            // Handle OTT benefits if available
            let ottHTML = "";
            if (plan.ott && plan.ott.length > 0) {
                ottHTML = `
                    <div class="ott-text-data" style="display: none;">
                        ${plan.ott.join(", ")}
                    </div>

                    <div class="ott-description-data" style="display: none;">
                        ${plan.ott.map(ott => `
                            <div data-ott="${ott}">Enjoy ${ott}'s premium content.</div>
                        `).join("")}
                    </div>

                    <!-- OTT Icons -->
                    <div class="ott-icons"></div>
                    <div class="more-ott"></div>
                `;
            }

            // Handle Terms & Conditions
            let termsHTML = "";
            if (plan.terms && plan.terms.length > 0) {
                termsHTML = `
                    <div class="terms-conditions" style="display: none;">
                        ${plan.terms.map(term => `<p>${term}</p>`).join("")}
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="card-header">
                    <div class="card-title-price">
                        <div class="plan-name">${plan.planName}</div>
                        <div class="price">₹${plan.price}/month</div>
                    </div>
                    <div class="card-view-details">
                        <i class="fa-solid fa-arrow-right open-popup"></i>
                    </div>
                </div>

                <div class="card-content">
                    ${benefitsHTML}  <!-- Only display available benefits -->
                    ${ottHTML}        <!-- OTT Section Added Here ✅ -->
                    ${termsHTML}      <!-- Show Terms & Conditions if available -->
                </div>

                <div class="card-footer">
                    <a href="/Mobile_Prepaid_Customer/Payment_Page/payment.html" class="buy-link">
                        <button class="buy-button">Buy Now</button>
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

        // Dispatch event to notify that new cards are added
        document.dispatchEvent(new Event("cardsUpdated"));
    }

    // Handle Category Clicks
    planCategories.forEach(category => {
        category.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove active class from all links and add to the clicked one
            planCategories.forEach(cat => cat.classList.remove("active"));
            this.classList.add("active");

            // Load corresponding JSON file
            const selectedCategory = this.getAttribute("data-category");
            loadPlans(selectedCategory);
        });
    });

    // Load Default Category (Popular Plans)
    loadPlans("popular_plans");
});










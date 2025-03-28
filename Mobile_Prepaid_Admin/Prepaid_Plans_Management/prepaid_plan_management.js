// Admin Profile Dropdown JS

// Admin Profile Dropdown JS
// Admin Profile Dropdown JS
document.addEventListener("DOMContentLoaded", function () {
    const adminUserDropdown = document.querySelector(".admin_user_dropdown");
    const adminUserIcon = document.getElementById("adminUserIcon");
    const adminDropdownContent = document.getElementById("adminDropdownContent");
    const adminSignOutBtn = document.getElementById("adminSignOutBtn");

    function handleAdminLogout(event) {
        event.preventDefault();

        const adminAccessToken = sessionStorage.getItem("adminAccessToken");
        const currentCustomer = sessionStorage.getItem("currentCustomer");

        try {
            // Parse customer data safely
            const storedCustomer = currentCustomer ? JSON.parse(currentCustomer) : null;
            
            // Logout API Request
            fetch("http://localhost:8083/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminAccessToken}`
                },
                body: JSON.stringify({ 
                    refreshToken: storedCustomer?.refreshToken || null 
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Logout failed');
                }
                return response.json();
            })
            .then(() => {
                // Clear session storage
                sessionStorage.removeItem("currentCustomer");
                sessionStorage.removeItem("adminAccessToken");

                // Redirect to admin login page
                window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            })
            .catch(error => {
                console.error("Logout error:", error);
                
                // Fallback: Clear session storage
                sessionStorage.removeItem("currentCustomer");
                sessionStorage.removeItem("adminAccessToken");
                window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            });
        } catch (error) {
            console.error("Logout error:", error);
            // Fallback: Clear session storage
            sessionStorage.removeItem("currentCustomer");
            sessionStorage.removeItem("adminAccessToken");
            window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
        }
    }

    function checkAdminAccess() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");
        const adminAccessToken = sessionStorage.getItem("adminAccessToken");

        // Redirect to Admin Login if not logged in
        if (!currentCustomer || !adminAccessToken) {
            window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            return;
        }
    }

    function updateAdminDropdown() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");
        const adminAccessToken = sessionStorage.getItem("adminAccessToken");

        // If logged in, allow dropdown functionality
        if (currentCustomer && adminAccessToken) {
            adminUserIcon.onclick = function (event) {
                event.stopPropagation();
                adminUserDropdown.classList.toggle("active"); // Toggle dropdown visibility
            };

            // Sign-out functionality
            if (adminSignOutBtn) {
                adminSignOutBtn.onclick = handleAdminLogout;
            }
        } else {
            // If not logged in, clicking the user icon redirects to Admin Login
            adminUserIcon.onclick = function () {
                window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            };

            // Ensure dropdown is hidden
            adminUserDropdown.classList.remove("active");
        }
    }

    // Check if admin is logged in (Access Control)
    checkAdminAccess();

    // Initialize dropdown behavior
    updateAdminDropdown();

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!adminUserDropdown.contains(event.target)) {
            adminUserDropdown.classList.remove("active");
        }
    });

    // Redirect if session storage is cleared (security measure)
    window.addEventListener("storage", function () {
        if (!sessionStorage.getItem("currentCustomer") || !sessionStorage.getItem("adminAccessToken")) {
            window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
        }
    });

    // Listen for login event and update dropdown dynamically
    window.addEventListener("storage", function () {
        if (sessionStorage.getItem("currentCustomer") && sessionStorage.getItem("adminAccessToken")) {
            updateAdminDropdown();
        }
    });
});





// Plan Deletion Functionality (Soft Delete & Hard Delete)

document.addEventListener("DOMContentLoaded", function () {
    const deletePopup = document.getElementById("delete-popup");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const popupTitle = deletePopup.querySelector("h3");
    const popupMessage = deletePopup.querySelector("p");

    // Check if all required elements exist before proceeding
    if (!deletePopup || !confirmDeleteBtn || !cancelDeleteBtn) {
        console.error("Delete popup elements not found!");
        return;
    }

    let currentCard = null;
    let currentPlanId = null;
    let isHardDelete = false;

    deletePopup.style.display = "none"; // Hide delete popup initially

    function openDeletePopup(cardElement) {
        currentCard = cardElement;
        let planIdElement = cardElement.querySelector(".plan-id-hidden");
        currentPlanId = planIdElement ? planIdElement.value : null;

        if (!currentPlanId) {
            alert("Error: Plan ID is missing.");
            return;
        }

        const planName = cardElement.querySelector(".plan-name")?.textContent || "N/A";
        const price = cardElement.querySelector(".price")?.textContent || "N/A";
        const validity = cardElement.querySelector(".fa-calendar-alt")?.parentElement?.textContent.trim() || "N/A";

        document.querySelector("#delete-popup .detail:nth-child(1)").innerHTML = `<strong>Plan Name:</strong> ${planName}`;
        document.querySelector("#delete-popup .detail:nth-child(2)").innerHTML = `<strong>Price:</strong> ${price}`;
        document.querySelector("#delete-popup .detail:nth-child(3)").innerHTML = `<strong>Validity:</strong> ${validity}`;

        // Determine if this is a hard delete or soft delete based on which tab is active
        const activeTab = document.querySelector(".plan-tab-button.active").getAttribute("data-tab");
        isHardDelete = (activeTab === "deleted-plans");

        // Update popup title and message based on deletion type
        if (isHardDelete) {
            popupTitle.textContent = "Permanently Delete Plan";
            popupMessage.innerHTML = "You are about to <strong>permanently delete</strong> this prepaid recharge plan. This action <strong>cannot be undone</strong>.";
        } else {
            popupTitle.textContent = "Deactivate Prepaid Plan";
            popupMessage.innerHTML = "You are about to <strong>deactivate</strong> this prepaid recharge plan. The plan will be moved to the deleted plans tab and can be restored later.";
        }

        deletePopup.style.display = "flex";
    }

    // Event listener for opening delete popup
    document.addEventListener("click", function (event) {
        if (event.target.closest(".delete-icon")) {
            const card = event.target.closest(".vi_card");
            if (card) {
                openDeletePopup(card);
            }
        }
    });

    // Confirm delete action
    confirmDeleteBtn.addEventListener("click", async function () {
        if (!currentPlanId) {
            alert("Error: Plan ID is missing.");
            return;
        }

        try {
            let response;
            let confirmMessage = isHardDelete ? 
                "Are you sure you want to permanently delete this plan? This cannot be undone." : 
                "Are you sure you want to deactivate this plan? It will be moved to the deleted plans tab.";
            
            // Ask for confirmation before proceeding
            if (!confirm(confirmMessage)) return;

            if (isHardDelete) {
                // Hard delete (complete removal)
                console.log("Hard Deleting Plan ID:", currentPlanId);
                response = await fetch(`http://localhost:8083/api/prepaid-plans/${currentPlanId}`, { 
                    method: "DELETE" 
                });
            } else {
                // Soft delete (deactivate)
                console.log("Soft Deleting Plan ID:", currentPlanId);
                response = await fetch(`http://localhost:8083/api/prepaid-plans/soft-delete/${currentPlanId}`, { 
                    method: "PATCH" 
                });
            }

            if (!response.ok) {
                let errorMessage = isHardDelete ? 
                    "Failed to permanently delete the plan." : 
                    "Failed to deactivate the plan.";
                
                try {
                    let data = await response.json();
                    errorMessage += ` ${data.message || "Unknown error"}`;
                } catch (err) {
                    errorMessage += " Unable to parse error details.";
                }
                alert(errorMessage);
                return;
            }

            // Remove the deleted plan from UI
            currentCard.remove();
            deletePopup.style.display = "none";

            // Reload the plans to reflect changes
            const activeTab = document.querySelector(".plan-tab-button.active").getAttribute("data-tab");
            const currentCategory = document.querySelector(".sidebar nav a.active")?.textContent.trim() || "Popular Plans";
            
            if (activeTab === "active-plans") {
                loadActivePlans(currentCategory);
            } else if (activeTab === "deleted-plans") {
                loadInactivePlans(currentCategory);
            }

        } catch (error) {
            alert(`Network error while ${isHardDelete ? 'permanently deleting' : 'deactivating'}: ${error.message}`);
        }
    });

    // Cancel delete action
    cancelDeleteBtn.addEventListener("click", function () {
        deletePopup.style.display = "none";
    });
});




// Reactivating 


// Plan Reactivation Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Event delegation for reactivate button clicks
    document.addEventListener("click", async function (event) {
        const reactivateIcon = event.target.closest(".reactivate-icon");
        if (!reactivateIcon) return;

        const card = reactivateIcon.closest(".vi_card");
        if (!card) return;

        const planIdElement = card.querySelector(".plan-id-hidden");
        if (!planIdElement) {
            alert("Error: Plan ID is missing.");
            return;
        }

        const planId = planIdElement.value;
        const planName = card.querySelector(".plan-name")?.textContent || "Unknown Plan";

        // Ask for confirmation
        if (!confirm(`Are you sure you want to reactivate "${planName}"? It will be moved back to active plans.`)) {
            return;
        }

        try {
            // Call the reactivation endpoint
            const response = await fetch(`http://localhost:8083/api/prepaid-plans/reactivate/${planId}`, {
                method: "PATCH"
            });

            if (!response.ok) {
                // Handle error response
                let errorMessage = "Failed to reactivate the plan.";
                try {
                    const data = await response.json();
                    errorMessage += ` ${data.message || "Unknown error"}`;
                } catch (err) {
                    errorMessage += " Unable to parse error details.";
                }
                alert(errorMessage);
                return;
            }

            // On success, remove the card from deleted plans
            card.remove();

            // Refresh the plans to reflect changes
            const currentCategory = document.querySelector(".sidebar nav a.active")?.textContent.trim() || "Popular Plans";
            
            // Reload the active and deleted plans with the current category
            if (typeof loadActivePlans === "function") {
                loadActivePlans(currentCategory);
            }
            
            if (typeof loadInactivePlans === "function") {
                loadInactivePlans(currentCategory);
            }

            // Show success message
            alert(`Plan "${planName}" has been successfully reactivated.`);

        } catch (error) {
            alert(`Network error while reactivating: ${error.message}`);
        }
    });

    // Listen for cardsUpdated event to ensure reactivate icons are properly initialized
    document.addEventListener("cardsUpdated", function() {
        // Any additional initialization for reactivate icons can be done here
        console.log("Cards updated, reactivation handlers ready");
    });
});





// update-pop-up

document.addEventListener("DOMContentLoaded", function () {
    const updatePopup = document.getElementById("prepaid-update-popup");
    const updatePlanBtn = document.getElementById("prepaid-update-btn");
    const cancelUpdateBtn = document.getElementById("prepaid-cancel-update-btn");

    if (!updatePopup || !updatePlanBtn || !cancelUpdateBtn) {
        console.error("Update pop-up elements not found!");
        return;
    }

    const inputs = {
        planName: document.getElementById("prepaid-update-plan-name"),
        price: document.getElementById("prepaid-update-plan-price"),
        validity: document.getElementById("prepaid-update-plan-validity"),
        voice: document.getElementById("prepaid-update-plan-calls"),
        dailyData: document.getElementById("prepaid-update-plan-data"),
        totalData: document.getElementById("prepaid-update-plan-total-data"),
        sms: document.getElementById("prepaid-update-plan-sms"),
        terms: document.getElementById("prepaid-update-plan-terms"),
        category: document.getElementById("prepaid-update-plan-category"),
        ottCheckboxes: document.querySelectorAll(".ott-checkbox"),
    };

    let currentPlanId = null;

    async function openUpdatePopup(planId) {
        try {
            const response = await fetch(`http://localhost:8083/api/prepaid-plans/${planId}`);
            if (!response.ok) throw new Error(`Failed to fetch plan details. Status: ${response.status}`);

            const plan = await response.json();
            inputs.planName.value = plan.planName || "";
            inputs.price.value = plan.price || "";
            inputs.validity.value = plan.validity || "";
            inputs.voice.value = plan.voice || "";
            inputs.dailyData.value = plan.dailyData || null;
            inputs.totalData.value = plan.totalData || "";
            inputs.sms.value = plan.sms || "";
            inputs.terms.value = plan.terms ? plan.terms.join(", ") : "";

            const categoryResponse = await fetch("http://localhost:8083/api/categories");
            if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
            const categories = await categoryResponse.json();

            inputs.category.innerHTML = '<option value="" disabled>Select a Category</option>';
            categories.forEach(category => {
                let option = document.createElement("option");
                option.value = category.categoryId;
                option.textContent = category.categoryName;
                if (plan.categories.some(cat => cat.categoryId === category.categoryId)) {
                    option.selected = true;
                }
                inputs.category.appendChild(option);
            });

            // 🛠 **Fixing OTT Selection**
            let preselectedOTTs = new Set(plan.ott || []);

            inputs.ottCheckboxes.forEach(checkbox => {
                checkbox.checked = preselectedOTTs.has(checkbox.value);
            });

            currentPlanId = planId;
            updatePopup.style.display = "flex";
        } catch (error) {
            console.error("Error fetching plan details:", error);
            alert("Failed to load plan details. Please try again.");
        }
    }

    document.addEventListener("click", function (event) {
        const editIcon = event.target.closest(".edit-icon");
        if (editIcon) {
            const card = editIcon.closest(".vi_card");
            if (!card) return;
            const planIdElement = card.querySelector(".plan-id-hidden");
            if (!planIdElement) return;
            openUpdatePopup(planIdElement.value);
        }
    });

    cancelUpdateBtn.addEventListener("click", function () {
        updatePopup.style.display = "none";
        currentPlanId = null;
    });

    updatePlanBtn.addEventListener("click", async function () {
        if (!currentPlanId) {
            console.error("No plan selected for update.");
            return;
        }
    
        const selectedCategoryId = inputs.category.value;
        const selectedCategory = selectedCategoryId ? [{ categoryId: parseInt(selectedCategoryId) }] : [];
    
        // Clear approach to handle OTT selection
        const updatedOTT = [];
        inputs.ottCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                updatedOTT.push(checkbox.value);
            }
        });
    
        // Ensure other fields are properly formatted
        const validityValue = parseInt(inputs.validity.value.trim());
        const priceValue = parseFloat(inputs.price.value.trim());
    
        const updatedPlan = {
            planId: parseInt(currentPlanId),
            planName: inputs.planName.value.trim(),
            price: priceValue,
            validity: validityValue,
            voice: inputs.voice.value.trim(),
            dailyData: inputs.dailyData.value.trim() || null,
            totalData: inputs.totalData.value.trim(),
            sms: inputs.sms.value.trim(),
            terms: inputs.terms.value.split(",").map(term => term.trim()).filter(term => term),
            categories: selectedCategory,
            ott: updatedOTT
        };
    
        console.log("🚀 Sending updated plan:", JSON.stringify(updatedPlan, null, 2));
    
        if (!updatedPlan.planName || isNaN(updatedPlan.price) || updatedPlan.price <= 0) {
            alert("Please enter a valid plan name and price.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8083/api/prepaid-plans/${currentPlanId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPlan)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Update failed. Status: ${response.status}. Details: ${errorText}`);
            }
    
            alert("Plan updated successfully!");
            updatePopup.style.display = "none";
    
            console.log("✅ Update successful. Refreshing the page...");
            location.reload();
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Failed to update plan. Please try again. Error: " + error.message);
        }
    });
});








// Add-Js

document.addEventListener("DOMContentLoaded", function () {
    const prepaidAddPopup = document.getElementById("prepaid-add-popup");
    const prepaidCancelBtn = document.getElementById("prepaid-cancel-btn");
    const prepaidAddBtn = document.getElementById("prepaid-add-btn");
    const categoryDropdown = document.getElementById("prepaid-plan-category");

    const inputs = {
        planName: document.getElementById("prepaid-plan-name"),
        price: document.getElementById("prepaid-plan-price"),
        validity: document.getElementById("prepaid-plan-validity"),
        voice: document.getElementById("prepaid-plan-calls"),
        dailyData: document.getElementById("prepaid-plan-data"),
        totalData: document.getElementById("prepaid-plan-total-data"),
        sms: document.getElementById("prepaid-plan-sms"),
        terms: document.getElementById("prepaid-plan-terms"),
        category: categoryDropdown
    };

    const errorSpans = {
        planName: document.getElementById("error-name"),
        price: document.getElementById("error-price"),
        validity: document.getElementById("error-validity"),
        voice: document.getElementById("error-calls"),
        dailyData: document.getElementById("error-data"),
        totalData: document.getElementById("error-total-data"),
        sms: document.getElementById("error-sms"),
        terms: document.getElementById("error-terms"),
        category: document.getElementById("error-category")
    };

    // Validation patterns
    const patterns = {
        price: /^[1-9]\d*(\.\d{1,2})?$/, // Positive number
        validity: /^[1-9]\d*$/, // Positive integer
        voice: /^(Unlimited Calls(?:\s*\([\w\s,]+\))?|[1-9]\d*\s*Calls\/Day)$/, // "Unlimited Calls (Local, STD, Roaming)" or "1000 Calls/Day"
        dailyData: /^\d+(\.\d+)?\s*GB\/Day$/, // "3 GB/Day"
        totalData: /^\d+(\.\d+)?\s*GB$/, // "100 GB"
        sms: /^\d+\s*SMS\/Day$/ // "1000 SMS/Day"
    };

    const placeholders = {
        planName: "Eg: Enter plan name",
        price: "Eg: 3999.00",
        validity: "Eg: 365 (Days)",
        voice: "Eg: Unlimited Calls (Local, STD, Roaming) or 1000 Calls/Day",
        dailyData: "Eg: 3 GB/Day",
        totalData: "Eg: 100 GB",
        sms: "Eg: 1000 SMS/Day",
        terms: "Eg: Terms separated by commas or new lines (Optional)",
        category: "Select a category"
    };

    // Apply placeholders
    Object.keys(inputs).forEach(inputName => {
        if (inputs[inputName].tagName === "INPUT" || inputs[inputName].tagName === "TEXTAREA") {
            inputs[inputName].placeholder = placeholders[inputName];
        }
    });

    // Function to show error
    function showError(inputName, message) {
        errorSpans[inputName].textContent = message;
        errorSpans[inputName].style.color = "red";
    }

    // Function to clear error
    function clearError(inputName) {
        errorSpans[inputName].textContent = "";
    }

    // Real-time validation
    Object.keys(inputs).forEach(inputName => {
        inputs[inputName].addEventListener("input", () => {
            let value = inputs[inputName].value.trim();

            if (!value) {
                if (["dailyData", "totalData", "sms", "voice", "terms"].includes(inputName)) {
                    clearError(inputName); // Allow these fields to be empty
                } else {
                    showError(inputName, `This field is required. Expected format: ${placeholders[inputName]}`);
                }
                return;
            }

            if (patterns[inputName] && !patterns[inputName].test(value)) {
                showError(inputName, `Invalid format. Expected: ${placeholders[inputName]}`);
                return;
            }

            clearError(inputName);
        });
    });

    // Open the pop-up and fetch categories
    document.addEventListener("click", async (event) => {
        if (event.target.classList.contains("add-action")) {
            prepaidAddPopup.style.display = "flex";

            try {
                const response = await fetch("http://localhost:8083/api/categories");
                const categories = await response.json();
                categoryDropdown.innerHTML = '<option value="" disabled selected>Select a Category</option>';

                categories.forEach(category => {
                    let option = document.createElement("option");
                    option.value = category.categoryId;
                    option.textContent = category.categoryName;
                    categoryDropdown.appendChild(option);
                });
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
    });

    // Hide pop-up when cancel button is clicked
    prepaidCancelBtn.addEventListener("click", () => {
        prepaidAddPopup.style.display = "none";
    });

    // Validate and Add Prepaid Plan
    prepaidAddBtn.addEventListener("click", async function () {
        let isValid = true;

        Object.keys(inputs).forEach(inputName => {
            let value = inputs[inputName].value.trim();

            if (!value) {
                if (["dailyData", "totalData", "sms", "voice", "terms"].includes(inputName)) {
                    clearError(inputName); // Allow these fields to be empty
                } else {
                    showError(inputName, `This field is required. Expected format: ${placeholders[inputName]}`);
                    isValid = false;
                }
            } else if (patterns[inputName] && !patterns[inputName].test(value)) {
                showError(inputName, `Invalid format. Expected: ${placeholders[inputName]}`);
                isValid = false;
            }
        });

        if (!isValid) return;

        const selectedOTTs = Array.from(document.querySelectorAll(".ott-checkbox:checked")).map(cb => cb.value);

        const newPlan = {
            planName: inputs.planName.value.trim(),
            price: parseFloat(inputs.price.value.trim()),
            validity: parseInt(inputs.validity.value.trim()),
            dailyData: inputs.dailyData.value.trim() || null,
            totalData: inputs.totalData.value.trim() || null,
            voice: inputs.voice.value.trim() || null,
            sms: inputs.sms.value.trim() || null,
            ott: selectedOTTs.length ? selectedOTTs : [],
            terms: inputs.terms.value.trim() ? inputs.terms.value.trim().split(/,|\n/).map(item => item.trim()) : [],
            categories: inputs.category.value ? [{ categoryId: parseInt(inputs.category.value) }] : []
        };

        try {
            const response = await fetch("http://localhost:8083/api/prepaid-plans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPlan)
            });

            if (response.ok) {
                alert("Plan added successfully!");
                prepaidAddPopup.style.display = "none";
            } else {
                alert("Error adding plan!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});







// Bulk-Delete-JS

document.addEventListener("DOMContentLoaded", function () {
    let activeMode = null; // Tracks if delete mode is active
    let currentTab = "active-plans"; // Track the current tab

    /* ---------------- BULK DELETE ---------------- */
    const deleteButton = document.querySelector(".delete-action");
    const bulkDeletePanel = document.querySelector(".bulk-delete-panel");
    const deleteSelectedButton = document.querySelector(".delete-selected");
    const cancelDeleteButton = document.querySelector(".cancel-action");

    // Track tab changes
    document.querySelectorAll(".plan-tab-button").forEach(button => {
        button.addEventListener("click", function() {
            currentTab = this.getAttribute("data-tab");
            
            // If delete mode is active, show checkboxes in the newly selected tab
            if (activeMode === "delete") {
                showDeleteCheckboxes();
            }
        });
    });

    // Track category changes
    document.querySelector(".sidebar nav").addEventListener("click", function(event) {
        if (event.target.tagName === "A") {
            // If delete mode is active, ensure checkboxes remain visible after category change
            if (activeMode === "delete") {
                // Wait for DOM to update with new cards
                setTimeout(showDeleteCheckboxes, 100);
            }
        }
    });

    deleteButton.addEventListener("click", function () {
        if (activeMode !== null) return; // Prevent multiple activations
        activeMode = "delete"; // Set delete mode active
        showDeleteCheckboxes();
    });

    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("bulk-delete-checkbox")) {
            toggleActionPanel();
        }
    });

    // Watch for card updates and reapply checkboxes if needed
    document.addEventListener("cardsUpdated", function() {
        if (activeMode === "delete") {
            showDeleteCheckboxes();
        }
    });

    deleteSelectedButton.addEventListener("click", function () {
        const selectedPlanIds = getSelectedPlanIds();
        if (selectedPlanIds.length === 0) {
            alert("No plans selected for deletion.");
            return;
        }

        // Determine which endpoint to use based on current tab
        const endpoint = currentTab === "active-plans" 
            ? "http://localhost:8083/api/prepaid-plans/bulk-soft-delete" // Soft delete for active plans
            : "http://localhost:8083/api/prepaid-plans/bulk-delete"; // Hard delete for already deleted plans
        
        const method = currentTab === "active-plans" ? "PATCH" : "DELETE";

        fetch(endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planIds: selectedPlanIds })
        })
        .then(response => {
            if (!response.ok) {
                // Parse the error response to get more details
                return response.json().then(errorData => {
                    throw new Error(errorData.message || `Failed to ${currentTab === "active-plans" ? "soft delete" : "hard delete"} plans`);
                });
            }
            return response.text(); // Read response as text instead of JSON
        })
        .then(() => {
            removeDeletedCards(selectedPlanIds);
            resetBulkActions();
            
            // Show appropriate success message
            if (currentTab === "active-plans") {
                alert("Plans moved to deleted plans successfully.");
                
                // Optionally refresh the deleted plans tab to show newly soft-deleted items
                const categoryName = document.querySelector(".sidebar nav a.active")?.textContent.trim() || "Popular Plans";
                
                // If we're on the active tab, refresh the active plans list
                loadActivePlans(categoryName);
            } else {
                alert("Plans permanently deleted successfully.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            
            // Check if the error message indicates transaction association
            if (error.message && (
                error.message.includes("transaction") || 
                error.message.includes("associated") || 
                error.message.includes("in use")
            )) {
                alert("Some plans cannot be deleted as they are associated with active transactions. Please remove the transaction associations before deleting.");
            } else {
                alert(`Error: ${error.message || "Failed to process the delete operation."}`);
            }
            
            // Even if there's an error, reset the UI
            resetBulkActions();
        });
    });

    cancelDeleteButton.addEventListener("click", function () {
        resetBulkActions();
    });

    function showDeleteCheckboxes() {
        // Only show checkboxes in the currently visible tab
        const visibleContainer = document.querySelector(`#${currentTab}`);
        if (visibleContainer) {
            visibleContainer.querySelectorAll(".bulk-delete-checkbox").forEach(checkbox => {
                checkbox.style.display = "inline-block";
            });
        }
    }

    function toggleActionPanel() {
        // Only check boxes in the currently visible tab
        const visibleContainer = document.querySelector(`#${currentTab}`);
        const anyChecked = visibleContainer?.querySelector(".bulk-delete-checkbox:checked");
        bulkDeletePanel.style.bottom = anyChecked ? "0" : "-60px";
    }

    function getSelectedPlanIds() {
        // Only get selected plans from the currently visible tab
        const visibleContainer = document.querySelector(`#${currentTab}`);
        return Array.from(visibleContainer?.querySelectorAll(".bulk-delete-checkbox:checked") || [])
            .map(checkbox => parseInt(checkbox.closest(".vi_card").querySelector(".plan-id-hidden").value));
    }

    function removeDeletedCards(planIds) {
        // Only remove cards from the currently visible tab
        const visibleContainer = document.querySelector(`#${currentTab}`);
        visibleContainer?.querySelectorAll(".vi_card").forEach(card => {
            const planId = parseInt(card.querySelector(".plan-id-hidden").value);
            if (planIds.includes(planId)) {
                card.remove();
            }
        });
    }

    function resetBulkActions() {
        activeMode = null; // Reset active mode
        
        // Hide checkboxes in both tabs to ensure clean state
        document.querySelectorAll(".bulk-delete-checkbox").forEach(checkbox => {
            checkbox.style.display = "none";
            checkbox.checked = false;
        });
        
        bulkDeletePanel.style.bottom = "-60px"; // Hide the action panel
    }
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




// Full-card-view-Js

document.addEventListener("DOMContentLoaded", function () {
    const fullCardPopup = document.getElementById("full-card-popup");
    const editIcons = document.querySelectorAll(".view-icon"); // Select all edit icons
    const closePopupBtn = document.getElementById("close-full-card-popup");

    // Open Popup when any edit icon is clicked
    editIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            fullCardPopup.style.display = "flex";
        });
    });

    // Close Popup Function
    function closePopup() {
        fullCardPopup.style.display = "none";
    }

    // Close Popup on clicking "X"
    closePopupBtn.addEventListener("click", closePopup);

    // Close when clicking outside the popup
    fullCardPopup.addEventListener("click", function (e) {
        if (e.target === fullCardPopup) {
            closePopup();
        }
    });
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






// Dynamic Pop-up Content JS

document.addEventListener("DOMContentLoaded", () => {
    fetch("./Prepaid_plans_json/popular_plans.json")
        .then(response => response.json())
        .then(plans => generatePopularPlans(plans))
        .catch(error => console.error("Error loading plans:", error));

    // Attach event listener to the container to handle dynamically added elements
    document.querySelector(".plan_card-container").addEventListener("click", function (e) {
        // Ensure only the view icon triggers the pop-up
        if (e.target.classList.contains("view-icon") || e.target.closest(".view-icon")) {
            e.preventDefault();
            openPopup(e.target.closest(".vi_card"));
        }
    });
    

    // Close popup event
    document.getElementById("close-unique-popup").addEventListener("click", function () {
        document.getElementById("unique-popup-overlay").classList.remove("active");
    });

    // Fetch customer details from JSON and store them in an object
    let customerData = {};

    fetch("/Mobile_Prepaid_Customer/Discover_Page/customer_details_json/customers.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(customer => {
                customerData[customer.mobile.trim()] = customer; // Store customer details indexed by mobile number
            });
        })
        .catch(error => console.error("Error loading customer data:", error));

    // Select elements
    const phoneInput = document.querySelector(".custom-phone-input");
    const purchaseButton = document.querySelector(".purchase-button-custom");

    // Create error message span and insert it below the input field and above the button
    const errorSpan = document.createElement("span");
    errorSpan.classList.add("phone-error-message");
    errorSpan.style.color = "red"; // ✅ Error message color set to red
    errorSpan.style.display = "block";
    errorSpan.style.marginTop = "5px";
    
    // Insert error message below input field
    phoneInput.parentNode.insertBefore(errorSpan, purchaseButton);

    // Check session storage and hide phone input field if currentCustomer exists
    const currentCustomer = sessionStorage.getItem("currentCustomer");

    if (currentCustomer) {
        phoneInput.style.display = "none";
        errorSpan.style.display = "none"; // Hide error message if the phone input is hidden
    }

    // Event Listener for Recharge Button Click
    purchaseButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default action

        // If currentCustomer exists, redirect immediately without validation
        if (currentCustomer) {
            window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/payment.html";
            return;
        }

        // If currentCustomer does not exist, validate phone number
        const phoneNumber = phoneInput.value.trim().replace(/\s+/g, ""); // Remove spaces

        if (validatePhoneNumber(phoneNumber)) {
            // Store user details in sessionStorage
            sessionStorage.setItem("currentCustomer", JSON.stringify(customerData[phoneNumber]));

            // Redirect to payment page
            window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/payment.html";
        }
    });

    // On input change, show error message dynamically
    phoneInput.addEventListener("input", function () {
        const phoneNumber = phoneInput.value.trim().replace(/\s+/g, ""); // Remove spaces
        validatePhoneNumber(phoneNumber);
    });

    // Function to validate phone number
    function validatePhoneNumber(phoneNumber) {
        let isValid = true;
        errorSpan.innerHTML = ""; // Clear previous errors

        // If empty
        if (phoneNumber === "") {
            errorSpan.innerHTML = "📢 Phone Number is required.";
            isValid = false;
        }
        // If non-numeric characters are included
        else if (!/^\d*$/.test(phoneNumber)) {
            errorSpan.innerHTML = "⚠️ Enter only digits (0-9).";
            isValid = false;
        }
        // If less than 10 digits
        else if (phoneNumber.length < 10) {
            errorSpan.innerHTML = "⚠️ Enter a valid 10-digit phone number.";
            isValid = false;
        }
        // If exactly 10 digits, check registration
        else if (phoneNumber.length === 10) {
            if (!(phoneNumber in customerData)) {
                errorSpan.innerHTML = "🚫 You are not a registered user of Mobi-Comm.";
                isValid = false;
            }
        }
        // If more than 10 digits
        else if (phoneNumber.length > 10) {
            errorSpan.innerHTML = "❌ Phone number should be 10 digits long.";
            isValid = false;
        }

        return isValid;
    }
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
    const extraPerksSection = document.querySelector(".extra-perks-custom");
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

        extraPerksSection.style.display = ottNames.length > 0 ? "block" : "none";
    } else {
        extraPerksSection.style.display = "none";
    }

    document.getElementById("unique-popup-overlay").classList.add("active");
}






// dynamically card generaing js

document.addEventListener("DOMContentLoaded", function () {
    const categoryNav = document.querySelector(".sidebar nav");
    const activeContainer = document.querySelector("#active-plans-container");
    const deletedContainer = document.querySelector("#deleted-plans-container");
    let currentCategory = "Popular Plans"; // Track the current category

    // Tab switching functionality
    const tabButtons = document.querySelectorAll(".plan-tab-button");
    const tabContents = document.querySelectorAll(".plan-tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active class from all buttons and hide all content
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.style.display = "none");

            // Add active class to clicked button and show corresponding content
            button.classList.add("active");
            const tabId = button.getAttribute("data-tab");
            document.getElementById(tabId).style.display = "block";

            // Load appropriate data based on the active tab
            if (tabId === "active-plans") {
                loadActivePlans(currentCategory);
            } else if (tabId === "deleted-plans") {
                loadInactivePlans(currentCategory);
            }
        });
    });

    // Function to Load Active Plans
    function loadActivePlans(categoryName) {
        fetch("http://localhost:8083/api/prepaid-plans/active")
            .then(response => response.json())
            .then(plans => {
                // Filter plans based on selected category
                const filteredPlans = plans.filter(plan => 
                    plan.categories.some(category => category.categoryName === categoryName)
                );
                generatePlans(filteredPlans, activeContainer); // Generate cards dynamically
            })
            .catch(error => console.error(`Error fetching active plans:`, error));
    }

    // Function to Load Inactive (Deleted) Plans
    function loadInactivePlans(categoryName) {
        fetch("http://localhost:8083/api/prepaid-plans/inactive")
            .then(response => response.json())
            .then(plans => {
                // Filter plans based on selected category
                const filteredPlans = plans.filter(plan => 
                    plan.categories.some(category => category.categoryName === categoryName)
                );
                generatePlans(filteredPlans, deletedContainer); // Generate cards dynamically
            })
            .catch(error => console.error(`Error fetching inactive plans:`, error));
    }

    // Function to Generate Plan Cards
    // Function to Generate Plan Cards
function generatePlans(plans, container) {
    container.innerHTML = ""; // Clear previous content
    
    // Check if this is the deleted plans container
    const isDeletedPlansContainer = container.id === "deleted-plans-container";

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
                <div class="ott-icons"></div>
                <div class="more-ott"></div>
            `;
        }

        let termsHTML = "";
        if (plan.terms && plan.terms.length > 0) {
            termsHTML = `
                <div class="terms-conditions" style="display: none;">
                    ${plan.terms.map(term => `<p>${term}</p>`).join("")}
                </div>
            `;
        }

        // Add reactivate icon if this is in the deleted plans container
        let reactivateIconHTML = "";
        if (isDeletedPlansContainer) {
            reactivateIconHTML = `
                <!-- REACTIVATE ICON -->
                <div class="reactivate-icon">
                    <i class="fas fa-undo-alt"></i>
                </div>
            `;
        }

        card.innerHTML = `
            <!-- Hidden Plan ID -->
            <input type="hidden" class="plan-id-hidden" value="${plan.planId}">

            <!-- Checkbox for Bulk Delete -->
            <input type="checkbox" class="bulk-delete-checkbox">
            
            <!-- Checkbox for Bulk Update -->
            <input type="checkbox" class="bulk-update-checkbox">

            <!-- DELETE ICON (Top-Right Corner) -->
            <div class="delete-icon">
                <i class="fas fa-times"></i>
            </div>

            ${reactivateIconHTML}

            <div class="card-header">
                <div class="card-title-price">
                    <div class="plan-name">${plan.planName}</div>
                    <div class="price">₹${plan.price}/month</div>
                </div>
            </div>
            <div class="card-content">
                ${benefitsHTML}
                ${ottHTML}
                ${termsHTML}
            </div>
            <div class="card-footer">
                <!-- Eye Icon (Bottom Right, Before Edit Icon) -->
                <div class="view-icon">
                    <i class="fas fa-eye"></i>
                </div>

                <!-- EDIT ICON (Bottom Right Corner) -->
                <div class="edit-icon">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>

                <!-- Buy Button (Shifted Up) -->
                <a class="buy-link">
                    <button class="buy-button">Buy Now</button>
                </a>
            </div>
        `;

        container.appendChild(card);
    });

    document.dispatchEvent(new Event("cardsUpdated"));
}

    // Handle category click using event delegation
    categoryNav.addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
            event.preventDefault();

            // Remove 'active' class from all links and set the clicked one as active
            document.querySelectorAll(".sidebar nav a").forEach(cat => cat.classList.remove("active"));
            event.target.classList.add("active");

            // Get selected category name and update current category
            currentCategory = event.target.innerText.trim();
            
            // Load plans based on active tab
            const activeTab = document.querySelector(".plan-tab-button.active").getAttribute("data-tab");
            if (activeTab === "active-plans") {
                loadActivePlans(currentCategory);
            } else if (activeTab === "deleted-plans") {
                loadInactivePlans(currentCategory);
            }
        }
    });

    // Search functionality for active plans
    const activeSearchInput = document.querySelector("#active-plans .tool_search input");
    activeSearchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        filterPlans(activeContainer, searchTerm);
    });

    // Search functionality for deleted plans
    const deletedSearchInput = document.querySelector("#deleted-plans .tool_search input");
    deletedSearchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        filterPlans(deletedContainer, searchTerm);
    });

    // Filter plans by search term
    function filterPlans(container, searchTerm) {
        const cards = container.querySelectorAll(".vi_card");
        cards.forEach(card => {
            const planName = card.querySelector(".plan-name").textContent.toLowerCase();
            if (planName.includes(searchTerm)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Fetch categories dynamically
    async function fetchCategories() {
        try {
            const response = await fetch("http://localhost:8083/api/categories");
            const categories = await response.json();
            categoryNav.innerHTML = ""; // Clear existing categories
    
            categories.forEach(category => {
                const categoryId = category.categoryId;  // Get category ID
                const categoryName = category.categoryName;
    
                // Create the anchor element
                const categoryLink = document.createElement("a");
                categoryLink.textContent = categoryName;
                categoryLink.setAttribute("data-category-id", categoryId); // Embed category ID
                categoryLink.classList.add("category-item");
    
                // Create the icon container
                const iconContainer = document.createElement("span");
                iconContainer.classList.add("icon-container");
                iconContainer.innerHTML = `<i class="fa-solid fa-ellipsis-vertical"></i>`;
    
                // Create the dropdown menu
                const dropdownMenu = document.createElement("div");
                dropdownMenu.classList.add("dropdown-menu");
                dropdownMenu.innerHTML = `
                    <button class="update-btn" data-category-id="${categoryId}" data-category-name="${categoryName}">Update</button>
                    <button class="delete-btn" data-category-id="${categoryId}" data-category-name="${categoryName}">Delete</button>
                `;
                dropdownMenu.style.display = "none"; // Initially hidden
    
                // Append the icon and dropdown menu
                categoryLink.appendChild(iconContainer);
                categoryNav.appendChild(categoryLink);
                document.body.appendChild(dropdownMenu); // Append dropdown to body to prevent cutoff
    
                let isDropdownOpen = false;
    
                // Show/Hide dropdown on icon click
                iconContainer.addEventListener("click", (event) => {
                    event.stopPropagation(); // Prevent document click from closing immediately
    
                    if (isDropdownOpen) {
                        dropdownMenu.style.display = "none";
                        isDropdownOpen = false;
                    } else {
                        closeAllDropdowns(); // Close other open dropdowns
                        dropdownMenu.style.display = "block";
                        isDropdownOpen = true;
    
                        // Position dropdown below the clicked icon
                        const rect = iconContainer.getBoundingClientRect();
                        dropdownMenu.style.top = `${rect.bottom + window.scrollY}px`;
                        dropdownMenu.style.left = `${rect.left + window.scrollX - 50}px`;
    
                        // Ensure dropdown is within viewport
                        adjustDropdownPosition(dropdownMenu);
                    }
                });
    
                // Close dropdown when clicking outside
                document.addEventListener("click", () => {
                    dropdownMenu.style.display = "none";
                    isDropdownOpen = false;
                });
    
                // Stop closing when clicking inside the dropdown
                dropdownMenu.addEventListener("click", (event) => {
                    event.stopPropagation();
                });
    
                // Attach delete event listener
                dropdownMenu.querySelector(".delete-btn").addEventListener("click", (event) => {
                    event.stopPropagation();
                    const categoryId = event.target.getAttribute("data-category-id");
                    const categoryName = event.target.getAttribute("data-category-name");
                    showDeletePopup(categoryId, categoryName);
                });
    
                // Attach update event listener
                dropdownMenu.querySelector(".update-btn").addEventListener("click", (event) => {
                    event.stopPropagation();
                    const categoryId = event.target.getAttribute("data-category-id");
                    const categoryName = event.target.getAttribute("data-category-name");
                    showUpdatePopup(categoryId, categoryName);
                });
                
    
                // Set "Popular Plans" as active by default
                if (categoryName.toLowerCase() === "popular plans") {
                    categoryLink.classList.add("active");
                }
            });
    
            // Load default category after categories are inserted
            // Set first tab as active by default
            document.querySelector(".plan-tab-button[data-tab='active-plans']").classList.add("active");
            document.getElementById("active-plans").style.display = "block";
            loadActivePlans("Popular Plans");
    
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }
    
    // Show update pop-up
    function showUpdatePopup(categoryId, categoryName) {
        const popup = document.getElementById("update-category-popup");
        if (!popup) {
            console.error("Update category pop-up not found!");
            return;
        }
        document.getElementById("update-category-name").value = categoryName; // Pre-fill category name
        document.getElementById("update-category-btn").setAttribute("data-category-id", categoryId);
    
        popup.style.display = "flex"; // Show the pop-up
    }
    
    
    
    // Close update pop-up
    document.getElementById("cancel-update-category-btn").addEventListener("click", function () {
        document.getElementById("update-category-popup").style.display = "none";
    });
    
    
    // Update category when "Update" button is clicked
    document.getElementById("update-category-btn").addEventListener("click", async function () {
        const categoryId = this.getAttribute("data-category-id"); // Get category ID
        const updatedCategoryName = document.getElementById("update-category-name").value.trim();
    
        // Validate input
        if (!updatedCategoryName) {
            document.getElementById("update-error-category").textContent = "Category name cannot be empty!";
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8083/api/categories/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoryName: updatedCategoryName }) // Send new category name
            });
    
            if (response.ok) {
                console.log("Category updated successfully.");
                document.getElementById("update-category-popup").style.display = "none";
                fetchCategories(); // Refresh the category list after update
            } else {
                console.error("Failed to update category.");
            }
        } catch (error) {
            console.error("Error updating category:", error);
        }
    });
    
    
    // Show delete confirmation pop-up
    async function showDeletePopup(categoryId, categoryName) {
        try {
            const response = await fetch("http://localhost:8083/api/prepaid-plans");
            const plans = await response.json();
    
            // Count plans associated with this category
            const categoryPlans = plans.filter(plan =>
                plan.categories.some(cat => cat.categoryId == categoryId)
            );
            const planCount = categoryPlans.length;
    
            // Update pop-up details
            document.getElementById("category-name").textContent = categoryName;
            document.getElementById("category-plan-count").textContent = planCount;
            document.getElementById("confirm-category-delete").setAttribute("data-category-id", categoryId);
    
            const popup = document.getElementById("delete-category-popup");
            popup.style.display = "flex"; // Show pop-up
    
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    }
    
    // Delete category when "Yes, Delete" is clicked
    document.getElementById("confirm-category-delete").addEventListener("click", async function () {
        const categoryId = this.getAttribute("data-category-id");
    
        try {
            const response = await fetch(`http://localhost:8083/api/categories/${categoryId}`, {
                method: "DELETE"
            });
    
            if (response.ok) {
                console.log("Category deleted successfully.");
                document.getElementById("delete-category-popup").style.display = "none";
                fetchCategories(); // Refresh categories
            } else {
                console.error("Failed to delete category.");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    });
    
    // Close delete pop-up
    document.getElementById("cancel-category-delete").addEventListener("click", function () {
        document.getElementById("delete-category-popup").style.display = "none";
    });
    

    // Function to close all open dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.style.display = "none";
        });
    }
    
    // Function to adjust dropdown position if it's being cut off
    function adjustDropdownPosition(dropdown) {
        const rect = dropdown.getBoundingClientRect();
    
        // Ensure dropdown is fully visible within the viewport
        if (rect.right > window.innerWidth) {
            dropdown.style.left = `${window.innerWidth - rect.width - 10}px`;
        }
        if (rect.bottom > window.innerHeight) {
            dropdown.style.top = `${window.innerHeight - rect.height - 10}px`;
        }
    }
    
    fetchCategories(); // Load categories on page load
});




// Add-category-js

document.addEventListener("DOMContentLoaded", function () {
    const addCategoryPopup = document.getElementById("add-category-popup");
    const addCategoryButton = document.querySelector(".outline-button"); // Button that opens the pop-up
    const addCategoryInput = document.getElementById("add-category-name");
    const addCategorySubmit = document.getElementById("add-category-btn");
    const cancelAddCategory = document.getElementById("cancel-add-category-btn");
    const errorMessage = document.getElementById("add-error-category");

    // Open the "Add Category" pop-up
    addCategoryButton.addEventListener("click", function () {
        addCategoryPopup.style.display = "block";
        addCategoryInput.value = "";
        errorMessage.textContent = "";
    });

    // Close the pop-up when "Cancel" is clicked
    cancelAddCategory.addEventListener("click", function () {
        addCategoryPopup.style.display = "none";
    });

    // Handle "Add" button click
    addCategorySubmit.addEventListener("click", function () {
        const newCategoryName = addCategoryInput.value.trim();

        // Validation: Ensure input is not empty
        if (newCategoryName === "") {
            errorMessage.textContent = "Category name cannot be empty.";
            return;
        }

        // API request to add the new category
        fetch("http://localhost:8083/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryName: newCategoryName })
        })
        .then(response => response.json())
        .then(() => {
            // Close the pop-up after successful addition
            addCategoryPopup.style.display = "none";
        })
        .catch(error => {
            console.error("Error adding category:", error);
            errorMessage.textContent = "Failed to add category. Please try again.";
        });
    });
});

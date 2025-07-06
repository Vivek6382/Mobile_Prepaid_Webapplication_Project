// Profile Dropdown JS (Standalone)
document.addEventListener("DOMContentLoaded", function() {
    // Elements
    const adminUserDropdown = document.querySelector(".admin_user_dropdown");
    const adminUserIcon = document.getElementById("adminUserIcon");
    const adminSignOutBtn = document.getElementById("adminSignOutBtn");

    // Only initialize if required elements exist
    if (adminUserIcon && adminUserDropdown) {
        // Logout handler
        function handleAdminLogout(event) {
            event.preventDefault();
            const adminAccessToken = sessionStorage.getItem("adminAccessToken");
            const currentCustomer = sessionStorage.getItem("currentCustomer");

            try {
                const storedCustomer = currentCustomer ? JSON.parse(currentCustomer) : null;
                
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
                    if (!response.ok) throw new Error('Logout failed');
                    return response.json();
                })
                .then(() => {
                    sessionStorage.removeItem("currentCustomer");
                    sessionStorage.removeItem("adminAccessToken");
                    window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
                })
                .catch(error => {
                    console.error("Logout error:", error);
                    sessionStorage.removeItem("currentCustomer");
                    sessionStorage.removeItem("adminAccessToken");
                    window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
                });
            } catch (error) {
                console.error("Logout error:", error);
                sessionStorage.removeItem("currentCustomer");
                sessionStorage.removeItem("adminAccessToken");
                window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            }
        }

        // Access control
        function checkAdminAccess() {
            const currentCustomer = sessionStorage.getItem("currentCustomer");
            const adminAccessToken = sessionStorage.getItem("adminAccessToken");

            if (!currentCustomer || !adminAccessToken) {
                window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            }
        }

        // Update dropdown state
        function updateAdminDropdown() {
            const currentCustomer = sessionStorage.getItem("currentCustomer");
            const adminAccessToken = sessionStorage.getItem("adminAccessToken");

            if (currentCustomer && adminAccessToken) {
                adminUserIcon.onclick = function(event) {
                    event.stopPropagation();
                    adminUserDropdown.classList.toggle("active");
                };

                if (adminSignOutBtn) {
                    adminSignOutBtn.onclick = handleAdminLogout;
                }
            } else {
                adminUserIcon.onclick = function() {
                    window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
                };
                adminUserDropdown.classList.remove("active");
            }
        }

        // Initialize
        checkAdminAccess();
        updateAdminDropdown();

        // Close when clicking outside
        document.addEventListener("click", function(event) {
            if (adminUserDropdown && !adminUserDropdown.contains(event.target) && 
               event.target !== adminUserIcon && !adminUserIcon.contains(event.target)) {
                adminUserDropdown.classList.remove("active");
            }
        });

        // Session storage listeners
        window.addEventListener("storage", function() {
            if (!sessionStorage.getItem("currentCustomer") || !sessionStorage.getItem("adminAccessToken")) {
                window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            }
            updateAdminDropdown();
        });
    }
});


// Hamburger Menu JS (Standalone)
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburger = document.querySelector('.admin_hamburger_menu');
    const navLinks = document.querySelector('.admin_nav_links');
    
    // Only initialize if required elements exist
    if (hamburger && navLinks) {
        // Toggle menu
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Animation delay for menu items
            document.querySelectorAll('.admin_nav_links li').forEach((item, index) => {
                item.style.setProperty('--i', index);
            });
        });
        
        // Close when clicking links
        const navItems = document.querySelectorAll('.admin_navigation a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Optional: Close on resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Fetch transactions
    const transactionsRes = await fetch("http://localhost:8083/api/transactions");
    const transactions = await transactionsRes.json();

    // Initialize monthly user count
    const monthlyUsers = {};
    months.forEach(month => (monthlyUsers[month] = 0));

    // Count users per month based on transaction start dates
    transactions.forEach(txn => {
        const month = new Date(txn.planStart).toLocaleString('en-US', { month: 'short' });
        if (monthlyUsers[month] !== undefined) {
            monthlyUsers[month]++;
        }
    });

    // Convert monthlyUsers object into an array for the chart
    const userGrowthData = months.map(month => monthlyUsers[month]);

    // Register the chart and update it dynamically
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: months, // Months as labels
            datasets: [{
                label: 'User Growth Trend (Last 12 Months)',
                data: userGrowthData, // Dynamic data
                borderColor: 'orangered',
                backgroundColor: 'rgba(255, 69, 0, 0.2)',
                fill: true,
                tension: 0.3 // Smooth curve effect
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Users'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Months'
                    }
                }
            }
        }
    });
});





// Download-Csv-Js

document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.querySelector(".download_csv button");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            let allData = [
                ["Customer Name", "Mobile Number", "Customer Status", "Plan Selected", "Subscription Start", "Subscription End", "Billing Amount", "Last Payment"]
            ];
            let expiredData = [...allData];
            let expiresSoonData = [...allData];
            let activeData = [...allData];

            let customerCards = document.querySelectorAll(".cust_manage_card");

            customerCards.forEach(card => {
                let customerName = card.querySelector(".customer_name")?.textContent.trim() || "N/A";
                let mobileNumber = card.querySelector(".customer_mobile")?.textContent.trim() || "N/A";
                let planSelected = card.querySelector(".customer_plan")?.textContent.trim() || "N/A";
                let subscriptionStart = card.querySelector(".subscription_start")?.textContent.replace("Start: ", "").trim() || "N/A";
                let subscriptionEnd = card.querySelector(".subscription_end")?.textContent.replace("End: ", "").trim() || "N/A";
                let billingAmount = card.querySelector(".billing_amount")?.textContent.trim() || "N/A";
                let lastPayment = card.querySelector(".last_payment")?.textContent.replace("Last Payment: ", "").trim() || "N/A";

                let customerStatus = "Active"; // Default Status
                if (card.classList.contains("expired")) {
                    customerStatus = "Expired";
                } else if (card.classList.contains("expires-soon")) {
                    customerStatus = "Expires Soon";
                }

                let rowData = [customerName, mobileNumber, customerStatus, planSelected, subscriptionStart, subscriptionEnd, billingAmount, lastPayment];
                allData.push(rowData);

                if (customerStatus === "Expired") {
                    expiredData.push(rowData);
                } else if (customerStatus === "Expires Soon") {
                    expiresSoonData.push(rowData);
                } else {
                    activeData.push(rowData);
                }
            });

            if (allData.length === 1) {
                alert("No customer data available for download!");
                return;
            }

            let workbook = XLSX.utils.book_new();

            function createSheet(data, sheetName) {
                if (data.length > 1) {
                    let sheet = XLSX.utils.aoa_to_sheet(data);
                    formatSheet(sheet);
                    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
                }
            }

            function formatSheet(sheet) {
                if (!sheet["!ref"]) return;
                const range = XLSX.utils.decode_range(sheet["!ref"]);

                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                    if (sheet[cellAddress]) {
                        sheet[cellAddress].s = {
                            font: { bold: true },
                            alignment: { horizontal: "center", vertical: "center" }
                        };
                    }
                }

                sheet["!cols"] = Array.from({ length: range.e.c + 1 }, () => ({ wch: 20 }));
            }

            createSheet(allData, "All Customers");
            createSheet(expiredData, "Expired Customers");
            createSheet(expiresSoonData, "Expires-Soon Customers");
            createSheet(activeData, "Active Customers");

            XLSX.writeFile(workbook, "Customer_Details.xlsx");
        });
    } else {
        console.error("Download button not found!");
    }
});




// Status-dot

document.querySelectorAll(".status-dot").forEach(dot => {
    dot.addEventListener("mouseenter", function () {
        let tooltip = document.createElement("div");
        tooltip.classList.add("dynamic-tooltip");
        tooltip.innerText = this.getAttribute("data-tooltip");

        document.body.appendChild(tooltip);

        let rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 30}px`; // Position above the dot
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    });

    dot.addEventListener("mouseleave", function () {
        document.querySelectorAll(".dynamic-tooltip").forEach(tip => tip.remove());
    });
});






// Filter-Button-Js


document.addEventListener("DOMContentLoaded", function () {
    const filterPopup = document.getElementById("filter-popup");
    const filterButton = document.getElementById("filterBtn");
    const closeButton = document.getElementById("close-popup");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const clearFiltersBtn = document.getElementById("clear-filters");
    const checkboxes = document.querySelectorAll(".filter-checkbox");
    const allNavTab = document.querySelector(".all_list"); // Selecting "All" tab correctly
    const customerCards = document.querySelectorAll(".cust_manage_card");

    // Open Filter Pop-up
    filterButton.addEventListener("click", function () {
        filterPopup.style.display = "flex";
    });

    // Close Pop-up Function
    function closePopup() {
        filterPopup.style.display = "none";
    }

    // Close Pop-up on clicking "X"
    closeButton.addEventListener("click", closePopup);

    // Clear All Filters
    clearFiltersBtn.addEventListener("click", function () {
        checkboxes.forEach(checkbox => checkbox.checked = false);
        customerCards.forEach(card => card.style.display = "block"); // Show all customers
        allNavTab.click(); // Select "All" navigation automatically
        closePopup();
    });

    // Apply Filters
    applyFiltersBtn.addEventListener("click", function () {
        let selectedFilters = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFilters.push(checkbox.value);
            }
        });

        if (selectedFilters.length === 0) {
            customerCards.forEach(card => card.style.display = "block"); // Show all if no filter
        } else {
            customerCards.forEach(card => {
                let matches = selectedFilters.some(filter => card.classList.contains(filter));
                card.style.display = matches ? "block" : "none";
            });
        }

        allNavTab.click(); // Ensure "All" navigation is selected
        closePopup(); // Close pop-up but filtering remains
    });
});




// Inside-Search-Js

// Inside-Search-Js

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".tool_search input");
    const allNav = document.querySelector(".all_list a");
    const navLinks = document.querySelectorAll(".expires_list a"); // All category links

    // Function to reset category to "All"
    function resetToAllCategory() {
        navLinks.forEach((link) => link.classList.remove("active-nav"));
        allNav.classList.add("active-nav"); // Select "All" category
    }

    // Function to filter customer cards based on search term
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const customerCards = document.querySelectorAll(".cust_manage_card"); // Fetch dynamically

        if (searchTerm === "") {
            // If search is cleared, reset to "All" category and show all cards
            resetToAllCategory();
            customerCards.forEach((card) => (card.style.display = "flex"));
            return;
        }

        let anyMatch = false;
        customerCards.forEach((card) => {
            const name = card.querySelector(".customer_name").textContent.toLowerCase();
            const mobile = card.querySelector(".customer_mobile").textContent.toLowerCase();
            const plan = card.querySelector(".customer_plan")
                ? card.querySelector(".customer_plan").textContent.toLowerCase()
                : "";

            if (name.includes(searchTerm) || mobile.includes(searchTerm) || plan.includes(searchTerm)) {
                card.style.display = "flex"; // Show matching cards
                anyMatch = true;
            } else {
                card.style.display = "none"; // Hide others
            }
        });

        if (anyMatch) {
            resetToAllCategory(); // Select "All" category when searching
        }
    }

    // Trigger search when typing
    searchInput.addEventListener("input", performSearch);

    // Trigger search when pressing Enter (prevent default form submission if inside a form)
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent any unintended form submission
            performSearch();
        }
    });

    // Monitor for newly added cards
    const observer = new MutationObserver(() => {
        performSearch(); // Reapply search when a new card is added
    });

    // Observe the parent container of customer cards
    const customerListContainer = document.querySelector(".customer_list"); // Adjust selector as needed
    if (customerListContainer) {
        observer.observe(customerListContainer, { childList: true });
    }
});






// Dynamically - card generation


document.addEventListener("DOMContentLoaded", async () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Fetch transactions
    const transactionsRes = await fetch("http://localhost:8083/api/transactions");
    const transactions = await transactionsRes.json();
    
    // Fetch users (currently unused but can be utilized if needed)
    const usersRes = await fetch("http://localhost:8083/api/users");
    const users = await usersRes.json();

    // Initialize monthly data
    const monthlyData = {};
    months.forEach(month => monthlyData[month] = { usersCount: 0, growthRate: "0%" });

    // Count users per month based on transactions
    transactions.forEach(txn => {
        const month = new Date(txn.planStart).toLocaleString('en-US', { month: 'short' });
        if (monthlyData[month]) {
            monthlyData[month].usersCount++;
        }
    });

    // Calculate growth rate
    let previousUsers = 0;
    months.forEach((month, index) => {
        const currentUsers = monthlyData[month].usersCount;

        if (index === 0) {
            // First month: No previous data, so keep it at 0%
            monthlyData[month].growthRate = "0%";
        } else {
            // Avoid division by zero and negative growth beyond 100%
            if (previousUsers > 0) {
                monthlyData[month].growthRate = ((currentUsers - previousUsers) / previousUsers * 100).toFixed(2) + "%";
            } else {
                monthlyData[month].growthRate = "0%"; // No previous users, assume neutral growth
            }
        }

        previousUsers = currentUsers;
    });

    // Populate UI with cards
    const cardsContainer = document.getElementById("cardsContainer");
    months.forEach(month => {
        const card = document.createElement("div");
        card.className = "cust_manage_card suspended";
        card.innerHTML = `
            <div class="dot_div">
                <span class="status-dot" data-tooltip="Data Available"></span>
            </div>
            <div class="bulk-actions">
                <input type="checkbox" class="bulk-delete-checkbox">
                <input type="checkbox" class="bulk-update-checkbox">
            </div>
           <!-- <i class="fa-solid fa-xmark delete-icon"></i> -->
            <div class="customer_info">
                <div class="customer_info_row">
                    <div class="customer_mobile_div">
                        <span class="customer_mobile">Month: <span class="plan-category">${month}</span></span>
                    </div>
                    <div class="customer_name_div">
                        <span class="customer_name">Number of Users: <span class="total-plans">${monthlyData[month].usersCount}</span></span>
                    </div>
                </div>
                <div class="customer_info_row">
                    <div class="customer_plan_div">
                        <span class="customer_plan">Growth Rate: <span class="subscribed-users">${monthlyData[month].growthRate}</span></span>
                    </div>
                </div>
            </div>
            <div class="cust_card_footer">
               <!-- <a href="#"><i class="fa-solid fa-eye view-details"></i></a> -->
                <!-- <i class="fa-solid fa-pen-to-square edit-icon"></i> -->
            </div>
            <!-- <div class="chevron-icon"> -->
                <!-- <i class="fa fa-chevron-right"></i> -->
            <!-- </div> -->

        `;
        cardsContainer.appendChild(card);
    });
});

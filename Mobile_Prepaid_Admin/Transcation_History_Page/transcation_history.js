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




//Recharge-history-page

//Recharge-history-page

function filterResults() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let transactionCards = document.querySelectorAll(".cust_manage_card");
  
    transactionCards.forEach(card => {
        let cardText = card.textContent.toLowerCase();
        if (cardText.includes(input)) {
            card.style.display = "flex"; // Show matching cards
        } else {
            card.style.display = "none"; // Hide non-matching cards
        }
    });
  }
  


//Filter-navigation






//Dynamic tool-tip 

//Dynamic tool-tip 
document.addEventListener("DOMContentLoaded", function () {
    const tooltip = document.createElement("div");
    tooltip.className = "dynamic-tooltip";
    document.body.appendChild(tooltip);

    document.addEventListener("mouseover", function (event) {
        const dot = event.target.closest(".status-dot");
        if (dot) {
            const card = dot.closest(".cust_manage_card");
            const status = card.classList.contains("successful") 
                ? "Successful Transaction" 
                : "Failed Transaction";

            tooltip.textContent = status;
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
        }
    });

    document.addEventListener("mousemove", function (event) {
        if (tooltip.style.visibility === "visible") {
            tooltip.style.left = event.pageX + "px";
            tooltip.style.top = (event.pageY + 15) + "px"; // Slightly below the cursor
        }
    });

    document.addEventListener("mouseout", function (event) {
        if (event.target.closest(".status-dot")) {
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
        }
    });
});




//Inside-Search-Js


//Inside-Search-Js

// Search Functionality for Transaction Cards
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
  
    function searchTransactions() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const transactionCards = document.querySelectorAll(".cust_manage_card");
  
        transactionCards.forEach((card) => {
            const transactionID = card.querySelector(".recharge_plan-category")?.textContent.toLowerCase() || "";
            const paymentMode = card.querySelector(".recharge-total-plans")?.textContent.toLowerCase() || "";
            const purchaseDate = card.querySelector(".recharge-purchase-date")?.textContent.toLowerCase() || "";
            const planDetails = card.querySelector(".recharge-subscribed-users")?.textContent.toLowerCase() || "";
  
            if (
                transactionID.includes(searchTerm) ||
                paymentMode.includes(searchTerm) ||
                purchaseDate.includes(searchTerm) ||
                planDetails.includes(searchTerm)
            ) {
                card.style.display = "flex"; // Show matching cards
            } else {
                card.style.display = "none"; // Hide non-matching cards
            }
        });
    }
  
    // Trigger search on input change
    searchInput.addEventListener("input", searchTransactions);
  
    // Prevent form submission on Enter key
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchTransactions();
        }
    });
  });
  






//Recharge-History-Card-Dynamic-Details_Display-JS 

document.addEventListener("DOMContentLoaded", function () {
    // Fetch values from hidden transaction details
    const transactionRef = document.querySelector(".transaction-ref")?.innerText || "";
    const transactionMode = document.querySelector(".transaction-mode")?.innerText || "";
    const transactionDate = document.querySelector(".transaction-date")?.innerText || "";
    const planName = document.querySelector(".plan-name")?.innerText || "";
    const planPrice = document.querySelector(".price")?.innerText || "";

    // Assign values dynamically
    document.querySelector(".recharge_plan-category").innerText = transactionRef;
    document.querySelector(".recharge-total-plans").innerText = transactionMode;
    document.querySelector(".recharge-purchase-date").innerText = transactionDate;
    document.querySelector(".recharge-subscribed-users").innerText = `${planName} - ${planPrice}`;
});





//Recharge-Plan-Pop-up-Details 

//Recharge-Plan-Pop-up-Details 

// Dynamic Pop-up Content for Recharge History
// Dynamic Pop-up Content for Recharge History (Using Event Delegation)
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("view-icon")) {
        const card = e.target.closest(".cust_manage_card");
        const planDetails = card.querySelector(".recharge_plan_details");

        // Set Plan Name & Cost
        document.querySelector(".plan-title-custom").textContent = planDetails.querySelector(".plan-name").textContent;
        document.querySelector(".plan-cost-custom").textContent = planDetails.querySelector(".price").textContent;

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

        planDetails.querySelectorAll(".benefit").forEach(benefit => {
            const iconClass = benefit.querySelector("i")?.className.trim();
            const textValue = benefit.textContent.trim();

            if (iconClass && textValue) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${featureMap[iconClass] || "Unknown"}</td>
                    <td class="separator"></td>
                    <td>${textValue}</td>
                `;
                planDetailsBody.appendChild(row);
            }
        });

        // Populate OTT Benefits
        const perkList = document.querySelector(".perk-list-custom");
        perkList.innerHTML = "";

        const ottTextElement = planDetails.querySelector(".ott-text-data");
        if (ottTextElement) {
            const ottNames = ottTextElement.textContent.split(", ").map(ott => ott.trim());
            const ottDescriptions = planDetails.querySelectorAll(".ott-description-data div");

            const logoMap = {
                "Netflix": "./assets/Netflix_Logo.svg",
                "Amazon Prime": "./assets/Prime_Logo.svg",
                "Sony LIV": "./assets/Sony_Logo.svg",
                "Sun NXT": "./assets/Sun_nxt_Logo.svg",
                "Zee5": "./assets/Zee5_Logo.svg"
            };

            ottNames.forEach(name => {
                const desc = [...ottDescriptions].find(div => div.getAttribute("data-ott") === name)?.textContent || "";

                const perkItem = document.createElement("div");
                perkItem.classList.add("perk-item-custom");

                let imgElement = document.createElement("img");
                imgElement.src = logoMap[name] || "";
                imgElement.alt = `${name} Logo`;

                imgElement.onerror = function () {
                    imgElement.remove();
                };

                perkItem.appendChild(imgElement);
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

        planDetails.querySelectorAll(".terms-conditions p").forEach(p => {
            const paragraph = document.createElement("p");
            paragraph.textContent = p.textContent;
            termsContainer.appendChild(paragraph);
        });

        document.getElementById("unique-popup-overlay").classList.add("active");
    }
});

// Close Popup
document.getElementById("close-unique-popup").addEventListener("click", function () {
    document.getElementById("unique-popup-overlay").classList.remove("active");
});





// Recharge history - dynamic population from backend

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".cust_manage_cards_container");
    const popup = document.getElementById("transaction-popup");
    const doneBtn = document.getElementById("transaction-done-btn");

    // Function to get transaction details from the clicked recharge card
    function getTransactionValues(card) {
        return {
            amount: card.querySelector(".transaction-amount").textContent.trim(),
            status: card.querySelector(".transaction-status").textContent.trim(),
            date: card.querySelector(".transaction-date").textContent.trim(),
            mode: card.querySelector(".transaction-mode").textContent.trim(),
            ref: card.querySelector(".transaction-ref").textContent.trim(),
            start: card.querySelector(".transaction-start").textContent.trim(),
            end: card.querySelector(".transaction-end").textContent.trim(),
        };
    }

    // Function to populate the pop-up with transaction details
    function populatePopup(data) {
        document.getElementById("popup-amount").textContent = data.amount;
        document.getElementById("popup-status").textContent = data.status;
        document.getElementById("popup-date").textContent = data.date;
        document.getElementById("popup-mode").textContent = data.mode;
        document.getElementById("popup-ref").textContent = data.ref;
        document.getElementById("popup-start").textContent = data.start;
        document.getElementById("popup-end").textContent = data.end;
    }

    // Event delegation: Listen for clicks on chevron icons inside dynamically created cards
    container.addEventListener("click", function (event) {
        if (event.target.closest(".chevron-icon")) {
            const card = event.target.closest(".cust_manage_card"); // Get the closest card
            if (card) {
                const transactionData = getTransactionValues(card); // Extract data
                populatePopup(transactionData); // Populate pop-up
                popup.style.display = "flex"; // Show pop-up
            }
        }
    });

    // Hide pop-up when "Done" button is clicked
    doneBtn.addEventListener("click", function () {
        popup.style.display = "none"; // Hide pop-up
    });

    // Close pop-up if clicked outside the content box
    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none"; // Hide pop-up
        }
    });
});




// Invoice-Recharge-History-Card

// Ensure DOM is loaded before executing
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".cust_manage_cards_container").addEventListener("click", function (event) {
        if (event.target.classList.contains("download-icon")) {
            generateRechargeInvoice(event.target);
        }
    });
});


function generateRechargeInvoice(iconElement) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Locate the closest recharge history card
    const rechargeCard = iconElement.closest(".cust_manage_card");

    // Fetch transaction details from the card
    const planAmount = rechargeCard.querySelector(".transaction-amount")?.textContent.trim() || "N/A";
    const transactionDate = rechargeCard.querySelector(".transaction-date")?.textContent.trim() || "N/A";
    const paymentMode = rechargeCard.querySelector(".transaction-mode")?.textContent.trim() || "N/A";
    const refNumber = rechargeCard.querySelector(".transaction-ref")?.textContent.trim() || "N/A";
    const transactionStatus = rechargeCard.querySelector(".transaction-status")?.textContent.trim() || "N/A";
    const planStartDate = rechargeCard.querySelector(".transaction-start")?.textContent.trim() || "N/A";
    const planEndDate = rechargeCard.querySelector(".transaction-end")?.textContent.trim() || "N/A";

    // Fetch plan details from the card
    const planName = "Mobi-Comm Plan";
    const planDuration = rechargeCard.querySelector(".benefit:nth-child(2)")?.textContent.trim() || "N/A";
    const planData = rechargeCard.querySelector(".benefit:nth-child(3)")?.textContent.trim() || "N/A";
    const planCalls = rechargeCard.querySelector(".benefit:nth-child(4)")?.textContent.trim() || "N/A";
    const planTotalData = rechargeCard.querySelector(".benefit:nth-child(5)")?.textContent.trim() || "N/A";
    const planSms = rechargeCard.querySelector(".benefit:nth-child(6)")?.textContent.trim() || "N/A";

    // Fetch user details from the main details container
    const userName = document.querySelector(".user-name")?.textContent.trim() || "N/A";
    const userMobile = document.querySelector(".user-mobile")?.textContent.trim() || "N/A";
    const userEmail = document.querySelector(".fa-envelope + span")?.textContent.trim() || "N/A";

    // Invoice details
    const invoiceNo = "INV" + Math.floor(Math.random() * 1000000);
    const companyName = "Mobi-Comm Services";
    const companyAddress = "123, Tech Street, City, India - 600001";
    const rupeeSymbol = String.fromCharCode(8377); // ₹ symbol
    const formattedPlanAmount = rupeeSymbol + " " + planAmount; // Ensure ₹ is explicitly added

    // Add a border for the page
    doc.setDrawColor(0);
    doc.rect(5, 5, 200, 287); // Border rectangle

    // Set up header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(companyName, 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(companyAddress, 105, 30, { align: "center" });
    doc.line(20, 35, 190, 35); // Horizontal line

    // Invoice title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 45, { align: "center" });
    doc.line(20, 50, 190, 50); // Horizontal line

    let startY = 60;

    // Table Formatting
    const tableOptions = {
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] }, // Black text color
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }, // Light gray background, black text
        columnStyles: { 0: { fontStyle: "bold", halign: "left" }, 1: { halign: "left" } }
    };

    // Invoice and transaction details table
    doc.autoTable({
        startY: startY,
        head: [["Invoice Details", ""]],
        body: [
            ["Invoice No:", invoiceNo],
            ["Transaction Date:", transactionDate],
            ["Status:", transactionStatus],
            ["Plan Start Date:", planStartDate],
            ["Plan End Date:", planEndDate]
        ],
        ...tableOptions
    });

    startY = doc.lastAutoTable.finalY + 10; // Move below the previous table

    // Customer details table
    doc.autoTable({
        startY: startY,
        head: [["Customer Details", ""]],
        body: [
            ["Name", userName],
            ["Mobile", userMobile],
            ["Email", userEmail]
        ],
        ...tableOptions
    });

    startY = doc.lastAutoTable.finalY + 10;

    // Payment details table
    doc.autoTable({
        startY: startY,
        head: [["Payment Details", ""]],
        body: [
            ["Payment Mode", paymentMode],
            ["Reference No", refNumber]
        ],
        ...tableOptions
    });

    startY = doc.lastAutoTable.finalY + 10;

    // Plan details table
    doc.autoTable({
        startY: startY,
        head: [["Plan Details", ""]],
        body: [
            ["Plan Name", planName],
            ["Amount", formattedPlanAmount],
            ["Duration", planDuration],
            ["Data at High Speed", planData],
            ["Voice", planCalls],
            ["Total Data", planTotalData],
            ["SMS", planSms]
        ],
        ...tableOptions
    });

    startY = doc.lastAutoTable.finalY + 8; // Adjust spacing

    // Total amount section (aligned to the right)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total Amount: ${rupeeSymbol} ${planAmount}`, 180, startY, { align: "right" });

    // Footer (Ensure correct spacing)
    startY += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing Mobi-Comm Services!", 105, startY, { align: "center" });

    // Save the PDF
    doc.save(invoiceNo + ".pdf");
}



document.addEventListener("DOMContentLoaded", function () {
    // Function to get URL query parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Fetch mobile number from URL
    const mobileNumber = getQueryParam("mobile");

    // Pre-fill the input field if mobile number exists
    if (mobileNumber) {
        document.getElementById("mobile-input").value = mobileNumber;

        fetchTransactions(mobileNumber);
    }
});





//Pagination Logic :

//Filter-navigation with backend integration

document.addEventListener("DOMContentLoaded", function () {
    // Selecting navigation elements
    const navLinks = document.querySelectorAll(".expires_list");
    const container = document.querySelector(".cust_manage_cards_container");
    const paginationContainer = document.querySelector(".pagination");
    const entriesInfo = document.querySelector(".entries-info");
    const title = document.getElementById("recharge-title");
    const mobileInput = document.getElementById("mobile-input");
    
    // Set these values based on your needs
    const itemsPerPage = 3;
    let currentPage = 0; // Backend pagination is 0-based
    let totalPages = 0;
    let totalElements = 0;
    let currentStatus = "all"; // Track current filter status
    let currentMobile = ""; // Track current mobile filter

    function updatePagination() {
        paginationContainer.innerHTML = "";

        let prevLi = document.createElement("li");
        prevLi.className = `page-item ${currentPage === 0 ? "disabled" : ""}`;
        prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        prevLi.addEventListener("click", function () {
            if (currentPage > 0) fetchTransactionsPage(currentPage - 1, currentMobile, currentStatus);
        });
        paginationContainer.appendChild(prevLi);

        for (let i = 0; i < totalPages; i++) {
            let li = document.createElement("li");
            li.className = `page-item ${i === currentPage ? "active" : ""}`;
            li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
            li.addEventListener("click", function () {
                fetchTransactionsPage(i, currentMobile, currentStatus);
            });
            paginationContainer.appendChild(li);
        }

        let nextLi = document.createElement("li");
        nextLi.className = `page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`;
        nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
        nextLi.addEventListener("click", function () {
            if (currentPage < totalPages - 1) fetchTransactionsPage(currentPage + 1, currentMobile, currentStatus);
        });
        paginationContainer.appendChild(nextLi);

        // Update entries info
        entriesInfo.textContent = `Showing ${itemsPerPage} out of ${totalElements} entries`;
    }

    function fetchTransactionsPage(page, mobile = "", status = "all") {
        // Set the base URL for transactions based on whether a mobile number is provided
        let url = mobile && mobile.length === 10
            ? `http://localhost:8083/api/transactions/user/${mobile}/paginated`
            : "http://localhost:8083/api/transactions/paginated";

        // Add query parameters for pagination and filter
        url += `?page=${page}&status=${status}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = "";
                
                // Extract pagination metadata from the response
                totalPages = data.totalPages;
                totalElements = data.totalElements;
                currentPage = data.number; // Current page number

                // Update current status and mobile for pagination tracking
                currentStatus = status;
                currentMobile = mobile;

                // Update the title based on filter
                let titleText = mobile ? `Transaction History for ${mobile}` : "Transaction History";
                if (status !== "all") {
                    titleText += ` (${status.charAt(0).toUpperCase() + status.slice(1)})`;
                }
                title.innerText = titleText;

                // Update active navigation
                navLinks.forEach(link => link.classList.remove("active-nav"));
                document.querySelector(`.${status}_list`)?.classList.add("active-nav");

                // Process the transactions from the 'content' array in the response
                data.content.forEach(transaction => {
                    const card = document.createElement("div");
                    card.classList.add("cust_manage_card", transaction.transactionStatus.toLowerCase());

                    card.innerHTML = `
                    <!-- Batch Label (Month & Year) -->
                    <span class="batch-label badge badge-secondary">${new Date(transaction.planStart).toLocaleString('en-US', { month: 'short', year: 'numeric' })}</span>

                    <div class="dot_div">
                        <span class="status-dot"></span>
                    </div>

                    <div class="recharge_history_info">
                        <div class="recharge_history_row">
                            <div class="recharge_mobile_div">
                                <span class="recharge_mobile">Transaction ID: <span class="recharge_plan-category">${transaction.transactionId}</span></span>
                            </div>
                            <div class="recharge_name_div">
                                <span class="recharge_name">Payment Mode: <span class="recharge-total-plans">${transaction.paymentMode}</span></span>
                            </div>
                        </div>
                        <div class="recharge_history_row">
                            <div class="recharge_plan_div">
                                <span class="recharge_plan">Purchased on: <span class="recharge-purchase-date">${new Date(transaction.purchasedOn).toLocaleDateString()}</span></span>
                            </div>
                            <div class="recharge_plan_div">
                                <span class="recharge_plan">Plan: <span class="recharge-subscribed-users">${transaction.plan.planName}</span></span>
                            </div>
                        </div>

                        <!-- Hidden Plan Details -->
                        <div class="recharge_plan_details" style="display: none;">
                            <div class="card-title-price">
                                <div class="plan-name">ACTIVE PLAN</div>
                                <div class="price">₹${transaction.amount}</div>
                            </div>

                            <div class="card-content">
                                <div class="benefit"><i class="fas fa-clock"></i> <span class="expiry-badge">${new Date(transaction.planEnd).toLocaleDateString()}</span></div>
                                <div class="benefit"><i class="fas fa-calendar-alt"></i> ${transaction.plan.validity} Days</div>
                                <div class="benefit"><i class="fas fa-tachometer-alt"></i> ${transaction.plan.dailyData}</div>
                                <div class="benefit"><i class="fas fa-phone-alt"></i> ${transaction.plan.voice}</div>
                                <div class="benefit"><i class="fas fa-wifi"></i> ${transaction.plan.additionalData || "N/A"}</div>
                                <div class="benefit"><i class="fas fa-envelope"></i> ${transaction.plan.sms}</div>

                                <!-- OTT Platforms -->
                                <div class="ott-text-data" style="display: none;">${transaction.plan.ott.join(", ")}</div>
                                <div class="ott-icons">
                                    ${transaction.plan.ott.map(platform => `<i class="ott-icon ${platform.toLowerCase()}"></i>`).join(" ")}
                                </div>
                                <div class="more-ott"></div>

                                <!-- Hidden OTT Description Data -->
                                <div class="ott-description-data" style="display: none;">
                                    ${transaction.plan.ott.map(platform => `<div data-ott="${platform}">Enjoy ${platform}'s premium content.</div>`).join("")}
                                </div>

                                <!-- Terms & Conditions (Hidden) -->
                                <div class="terms-conditions" style="display: none;">
                                    ${transaction.plan.terms.map(term => `<p>${term}</p>`).join(" ")}
                                </div>
                            </div>
                        </div>

                        <!-- Hidden Transaction Details -->
                        <div class="transaction-details" style="display: none;">
                            <h5>Transaction Details</h5>
                            <div class="transaction-content">
                                <p><strong>Plan:</strong> <span class="transaction-amount">₹${transaction.amount}</span></p>
                                <p><strong>Purchased on:</strong> <span class="transaction-date">${new Date(transaction.purchasedOn).toLocaleString()}</span></p>
                                <p><strong>Payment Mode:</strong> <span class="transaction-mode">${transaction.paymentMode}</span></p>
                                <p><strong>Ref. Number:</strong> <span class="transaction-ref">${transaction.refNumber}</span></p>

                                <!-- Hidden Fields -->
                                <p class="hidden"><strong>Status:</strong> <span class="transaction-status">${transaction.transactionStatus}</span></p>
                                <p class="hidden"><strong>Plan Start Date:</strong> <span class="transaction-start">${new Date(transaction.planStart).toLocaleDateString()}</span></p>
                                <p class="hidden"><strong>Plan End Date:</strong> <span class="transaction-end">${new Date(transaction.planEnd).toLocaleDateString()}</span></p>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Icons -->
                    <div class="cust_card_footer">
                        <i class="fa-solid fa-download download-icon"></i>
                        <i class="fa-solid fa-eye view-icon"></i>
                    </div>

                    <!-- Chevron Button -->
                    <div class="chevron-icon">
                        <i class="fa fa-chevron-right"></i>
                    </div>
                `;

                    container.appendChild(card);
                });

                updatePagination();
            })
            .catch(error => console.error("Error fetching transactions:", error));
    }

    // Adding event listeners for filter navigation with backend filtering
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            
            const status = this.classList.contains("all_list") ? "all" :
                this.classList.contains("successful_list") ? "successful" :
                this.classList.contains("unsuccessful_list") ? "failed" : "";
            
            if (status) {
                // Reset to first page when changing filters
                fetchTransactionsPage(0, currentMobile, status);
            }
        });
    });

    // Listen for mobile number input change
    mobileInput.addEventListener("input", function () {
        let mobile = mobileInput.value.replace(/\D/g, "").slice(0, 10);
        mobileInput.value = mobile; // Keep only digits
        if (mobile.length === 10 || mobile.length === 0) {
            // Reset to first page and maintain current filter status
            fetchTransactionsPage(0, mobile, currentStatus);
        }
    });

    // Initialize with 'All' filter
    fetchTransactionsPage(0, "", "all");
});





// Admin Header Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Select DOM elements
  const adminUserDropdown = document.querySelector(".admin_user_dropdown");
  const adminUserIcon = document.getElementById("adminUserIcon");
  const adminDropdownContent = document.getElementById("adminDropdownContent");
  const adminSignOutBtn = document.getElementById("adminSignOutBtn");

  // Check Admin Authentication
  function checkAdminAuthentication() {
    const currentCustomer = sessionStorage.getItem("currentCustomer");
    const adminAccessToken = sessionStorage.getItem("adminAccessToken");

    // Redirect to login page if not authenticated
    if (!currentCustomer || !adminAccessToken) {
      window.location.href =
        "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
      return false;
    }
    return true;
  }

  // Toggle dropdown visibility
  function toggleDropdown(event) {
    if (event) {
      event.stopPropagation();
    }
    adminDropdownContent.style.display =
      adminDropdownContent.style.display === "block" ? "none" : "block";
    adminUserDropdown.classList.toggle("active");
  }

  // Handle admin logout
  // Modify the existing admin logout function
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

// Update the existing event listener setup
function setupEventListeners() {
  // User icon click event
  if (adminUserIcon) {
      adminUserIcon.addEventListener("click", toggleDropdown);
  }

  // Sign out button click event
  if (adminSignOutBtn) {
      adminSignOutBtn.addEventListener("click", handleAdminLogout);
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
      if (adminUserDropdown && !adminUserDropdown.contains(event.target)) {
          adminDropdownContent.style.display = "none";
          adminUserDropdown.classList.remove("active");
      }
  });
}

  // Set up event listeners
  function setupEventListeners() {
    // User icon click event
    if (adminUserIcon) {
      adminUserIcon.addEventListener("click", toggleDropdown);
    }

    // Sign out button click event
    if (adminSignOutBtn) {
      adminSignOutBtn.addEventListener("click", handleAdminLogout);
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      if (adminUserDropdown && !adminUserDropdown.contains(event.target)) {
        adminDropdownContent.style.display = "none";
        adminUserDropdown.classList.remove("active");
      }
    });
  }

  // Listen for storage events (logout from another tab)
  function setupStorageListener() {
    window.addEventListener("storage", function () {
      if (
        !sessionStorage.getItem("currentCustomer") ||
        !sessionStorage.getItem("adminAccessToken")
      ) {
        window.location.href =
          "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
      }
    });
  }

  // Initialize the dropdown functionality
  function init() {
    if (checkAdminAuthentication()) {
      setupEventListeners();
      setupStorageListener();

      // Ensure dropdown is initially hidden
      if (adminDropdownContent) {
        adminDropdownContent.style.display = "none";
      }
    }
  }

  // Start the application
  init();
});



document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.admin_hamburger_menu');
    const navLinks = document.querySelector('.admin_nav_links');
    const userDropdown = document.querySelector('.admin_user_dropdown');
    const userIcon = document.getElementById('adminUserIcon');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Add index for animation delay
            document.querySelectorAll('.admin_nav_links li').forEach((item, index) => {
                item.style.setProperty('--i', index);
            });
        });
        
        // Close menu when clicking on a link
        const navItems = document.querySelectorAll('.admin_navigation a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
            
            if (userDropdown && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // User dropdown functionality
    if (userIcon && userDropdown) {
        userIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
    }
});



document.addEventListener("DOMContentLoaded", function () {
  // API endpoints
  const API_BASE = "http://localhost:8083/api";
  const ENDPOINTS = {
    transactions: `${API_BASE}/transactions`,
    users: `${API_BASE}/users`,
    categories: `${API_BASE}/categories`,
    activeCustomers: `${API_BASE}/customers/active`,
    expiringSoonCustomers: `${API_BASE}/customers/expires-soon`,
    expiredCustomers: `${API_BASE}/customers/expired`,
    allCustomers: `${API_BASE}/customers/all`,
  };

  // Chart objects for later reference
  let statusPieChart = null;
  let userGrowthChart = null;
  let categoryBarChart = null;
  let revenueChart = null;
  let planTypeRevenueChart = null;

  // Colors for charts
  const CHART_COLORS = {
    active: "rgba(75, 192, 75, 0.8)", // Green
    expiresSoon: "rgba(255, 205, 86, 0.8)", // Yellow
    expired: "rgba(255, 99, 132, 0.8)", // Red
    barChart: "rgba(54, 162, 235, 0.8)", // Blue
    lineChart: "rgba(75, 192, 192, 0.8)", // Teal
    lineChartFill: "rgba(75, 192, 192, 0.2)",
  };

  // Fetch data with error handling
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return [];
    }
  }

  // Format currency values
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format percentage values
  function formatPercentage(value) {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  }

  // Calculate days between two dates
  function getDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Update KPI cards with latest data
  async function updateKPICards() {
    try {
      // Fetch all necessary data
      const [
        transactions,
        activeCustomers,
        expiringSoonCustomers,
        expiredCustomers,
      ] = await Promise.all([
        fetchData(ENDPOINTS.transactions),
        fetchData(ENDPOINTS.activeCustomers),
        fetchData(ENDPOINTS.expiringSoonCustomers),
        fetchData(ENDPOINTS.expiredCustomers),
      ]);

      // Calculate KPI values
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousMonthYear =
        currentMonth === 0 ? currentYear - 1 : currentYear;

      // Filter transactions for current and previous month
      const currentMonthTransactions = transactions.filter((t) => {
        const purchaseDate = new Date(t.purchasedOn);
        return (
          purchaseDate.getMonth() === currentMonth &&
          purchaseDate.getFullYear() === currentYear
        );
      });

      const previousMonthTransactions = transactions.filter((t) => {
        const purchaseDate = new Date(t.purchasedOn);
        return (
          purchaseDate.getMonth() === previousMonth &&
          purchaseDate.getFullYear() === previousMonthYear
        );
      });

      // Calculate metrics
      const totalCustomers = new Set(transactions.map((t) => t.user.userId))
        .size;
      const totalCustomersLastMonth = new Set(
        transactions
          .filter((t) => {
            const purchaseDate = new Date(t.purchasedOn);
            return (
              purchaseDate.getMonth() === previousMonth &&
              purchaseDate.getFullYear() === previousMonthYear
            );
          })
          .map((t) => t.user.userId)
      ).size;

      const customerGrowthPercent =
        totalCustomersLastMonth > 0
          ? ((totalCustomers - totalCustomersLastMonth) /
              totalCustomersLastMonth) *
            100
          : 100;

      const currentMonthRevenue = currentMonthTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );
      const previousMonthRevenue = previousMonthTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      const revenueGrowthPercent =
        previousMonthRevenue > 0
          ? ((currentMonthRevenue - previousMonthRevenue) /
              previousMonthRevenue) *
            100
          : 100;

      const activePlansCount = activeCustomers.length;
      const expiringPlansCount = expiringSoonCustomers.length;
      const totalPlans =
        activePlansCount + expiringPlansCount + expiredCustomers.length;

      const activePercentage =
        totalPlans > 0 ? (activePlansCount / totalPlans) * 100 : 0;
      const expiringPercentage =
        totalPlans > 0 ? (expiringPlansCount / totalPlans) * 100 : 0;

      // Update the KPI cards
      document.getElementById("totalCustomers").textContent =
        totalCustomers.toLocaleString();
      document.getElementById("customerGrowth").textContent = formatPercentage(
        customerGrowthPercent
      );
      document.getElementById("customerGrowth").className = `kpi-performance ${
        customerGrowthPercent >= 0 ? "positive" : "negative"
      }`;

      document.getElementById("monthlyRevenue").textContent =
        formatCurrency(currentMonthRevenue);
      document.getElementById("revenueGrowth").textContent =
        formatPercentage(revenueGrowthPercent);
      document.getElementById("revenueGrowth").className = `kpi-performance ${
        revenueGrowthPercent >= 0 ? "positive" : "negative"
      }`;

      document.getElementById("activePlans").textContent =
        activePlansCount.toLocaleString();
      document.getElementById(
        "activePercentage"
      ).textContent = `${activePercentage.toFixed(1)}%`;

      document.getElementById("expiringPlans").textContent =
        expiringPlansCount.toLocaleString();
      document.getElementById(
        "expiringPercentage"
      ).textContent = `${expiringPercentage.toFixed(1)}%`;
    } catch (error) {
      console.error("Error updating KPI cards:", error);
      // Set fallback values
      document.getElementById("totalCustomers").textContent = "Error loading";
      document.getElementById("monthlyRevenue").textContent = "Error loading";
      document.getElementById("activePlans").textContent = "Error loading";
      document.getElementById("expiringPlans").textContent = "Error loading";
    }
  }

  // Create and update the Status Pie Chart
  async function createStatusPieChart() {
    try {
      // Fetch customer status data
      const [activeCustomers, expiringSoonCustomers, expiredCustomers] =
        await Promise.all([
          fetchData(ENDPOINTS.activeCustomers),
          fetchData(ENDPOINTS.expiringSoonCustomers),
          fetchData(ENDPOINTS.expiredCustomers),
        ]);

      // Prepare chart data
      const data = [
        activeCustomers.length,
        expiringSoonCustomers.length,
        expiredCustomers.length,
      ];

      const ctx = document.getElementById("statusPieChart").getContext("2d");

      // Destroy existing chart if it exists
      if (statusPieChart) {
        statusPieChart.destroy();
      }

      // Create new chart
      statusPieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Active", "Expires Soon", "Expired"],
          datasets: [
            {
              data: data,
              backgroundColor: [
                CHART_COLORS.active,
                CHART_COLORS.expiresSoon,
                CHART_COLORS.expired,
              ],
              borderColor: [
                "rgba(75, 192, 75, 1)",
                "rgba(255, 205, 86, 1)",
                "rgba(255, 99, 132, 1)",
              ],
              borderWidth: 2,
              hoverOffset: 15,
              hoverBorderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "#2b2b2b",
              bodyColor: "white",
              titleColor: "#ff6b6b",
              padding: 10,
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce(
                    (acc, val) => acc + val,
                    0
                  );
                  const percentage =
                    total > 0 ? Math.round((value / total) * 100) + "%" : "0%";
                  return `${label}: ${value} (${percentage})`;
                },
              },
            },
          },
          elements: {
            arc: {
              borderWidth: 1,
              hoverBorderColor: "#fff",
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating status pie chart:", error);
      const ctx = document.getElementById("statusPieChart").getContext("2d");
      ctx.font = "14px Arial";
      ctx.fillText("Error loading chart data", 10, 50);
    }
  }

  // Create and update the User Growth Trend chart
  async function createUserGrowthChart(months = 6) {
    try {
      const transactions = await fetchData(ENDPOINTS.transactions);

      // Get month names for the last X months
      const getMonthName = (monthIndex) => {
        const date = new Date();
        date.setMonth(date.getMonth() - monthIndex);
        return date.toLocaleString("en-US", { month: "short" });
      };

      const monthNames = Array.from({ length: months }, (_, i) =>
        getMonthName(months - 1 - i)
      );

      // Get month-year combinations for filtering
      const getMonthYearCombo = (monthIndex) => {
        const date = new Date();
        date.setMonth(date.getMonth() - monthIndex);
        return {
          month: date.getMonth(),
          year: date.getFullYear(),
        };
      };

      const monthCombos = Array.from({ length: months }, (_, i) =>
        getMonthYearCombo(months - 1 - i)
      );

      // Calculate unique users per month
      const usersPerMonth = monthCombos.map(({ month, year }) => {
        const uniqueUsers = new Set(
          transactions
            .filter((t) => {
              const purchaseDate = new Date(t.purchasedOn);
              return (
                purchaseDate.getMonth() === month &&
                purchaseDate.getFullYear() === year
              );
            })
            .map((t) => t.user.userId)
        );
        return uniqueUsers.size;
      });

      const ctx = document.getElementById("userGrowthChart").getContext("2d");

      // Destroy existing chart if it exists
      if (userGrowthChart) {
        userGrowthChart.destroy();
      }

      // Create new chart
      userGrowthChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: monthNames,
          datasets: [
            {
              label: "Monthly Active Users",
              data: usersPerMonth,
              borderColor: CHART_COLORS.lineChart,
              backgroundColor: CHART_COLORS.lineChartFill,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: CHART_COLORS.lineChart,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Users",
              },
              ticks: {
                precision: 0,
              },
            },
            x: {
              title: {
                display: true,
                text: "Month",
              },
            },
          },
          plugins: {
            tooltip: {
              backgroundColor: "#2b2b2b",
              bodyColor: "white",
              titleColor: "#ff6b6b",
              padding: 10,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating user growth chart:", error);
      const ctx = document.getElementById("userGrowthChart").getContext("2d");
      ctx.font = "14px Arial";
      ctx.fillText("Error loading chart data", 10, 50);
    }
  }

  // Create and update the Top Performing Categories Bar Chart
  async function createCategoryBarChart(limit = 5) {
    try {
      // Fetch categories and transactions
      const [categories, transactions] = await Promise.all([
        fetchData(ENDPOINTS.categories),
        fetchData(ENDPOINTS.transactions),
      ]);

      // Calculate transactions per category
      let categoryData = categories.map((category) => {
        const categoryId = category.categoryId;

        // Count transactions for this category
        const transactionsCount = transactions.filter((t) => {
          return (
            t.plan.categories &&
            t.plan.categories.some((cat) => cat.categoryId === categoryId)
          );
        }).length;

        // Sum revenue for this category
        const categoryRevenue = transactions
          .filter(
            (t) =>
              t.plan.categories &&
              t.plan.categories.some((cat) => cat.categoryId === categoryId)
          )
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          id: categoryId,
          name: category.categoryName,
          count: transactionsCount,
          revenue: categoryRevenue,
        };
      });

      // Sort by transaction count and get top N
      categoryData.sort((a, b) => b.count - a.count);
      categoryData = categoryData.slice(0, limit);

      const ctx = document.getElementById("categoryBarChart").getContext("2d");

      // Destroy existing chart if it exists
      if (categoryBarChart) {
        categoryBarChart.destroy();
      }

      // Create new chart
      categoryBarChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: categoryData.map((c) => c.name),
          datasets: [
            {
              label: "Number of Transactions",
              data: categoryData.map((c) => c.count),
              backgroundColor: CHART_COLORS.barChart,
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              borderRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          indexAxis: "y", // Horizontal bar chart
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Transactions",
              },
              ticks: {
                precision: 0,
              },
            },
            y: {
              title: {
                display: true,
                text: "Plan Category",
              },
            },
          },
          plugins: {
            tooltip: {
              backgroundColor: "#2b2b2b",
              bodyColor: "white",
              titleColor: "#ff6b6b",
              padding: 10,
              callbacks: {
                afterLabel: function (context) {
                  const index = context.dataIndex;
                  const revenue = categoryData[index].revenue;
                  return `Revenue: ${formatCurrency(revenue)}`;
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating category bar chart:", error);
      const ctx = document.getElementById("categoryBarChart").getContext("2d");
      ctx.font = "14px Arial";
      ctx.fillText("Error loading chart data", 10, 50);
    }
  }

  // Update the expiring plans table
  // Update the expiring plans table
  async function updateExpiringPlansTable() {
    try {
      const expiringCustomers = await fetchData(
        ENDPOINTS.expiringSoonCustomers
      );
      const tableBody = document.getElementById("expiringPlansTableBody");

      // Clear existing rows
      tableBody.innerHTML = "";

      // Add new rows
      expiringCustomers.forEach((customer) => {
        const tr = document.createElement("tr");

        // Calculate days remaining
        const today = new Date();
        const endDate = new Date(customer.transaction.planEnd);
        const daysRemaining = getDaysBetween(today, endDate);

        tr.innerHTML = `
                  <td>${customer.user.name}</td>
                  <td>${customer.user.mobile}</td>
                  <td>${customer.transaction.plan.planName}</td>
                  <td>${new Date(
                    customer.transaction.planStart
                  ).toLocaleDateString()}</td>
                  <td>${new Date(
                    customer.transaction.planEnd
                  ).toLocaleDateString()}</td>
                  <td>${formatCurrency(customer.transaction.amount)}</td>
                  <td>${customer.transaction.paymentMode}</td>
                  <td>
                      <button class="btn-view" data-userid="${
                        customer.user.userId
                      }">
                          <i class="fas fa-eye"></i> View
                      </button>
                  </td>
              `;

        tableBody.appendChild(tr);
      });

      // Add click listeners to view buttons
      document.querySelectorAll(".btn-view").forEach((btn) => {
        btn.addEventListener("click", function () {
          const userId = this.getAttribute("data-userid");
          showTransactionHistory(userId);
        });
      });
    } catch (error) {
      console.error("Error updating expiring plans table:", error);
      const tableBody = document.getElementById("expiringPlansTableBody");
      tableBody.innerHTML =
        '<tr><td colspan="8" class="text-center">Error loading data</td></tr>';
    }
  }

  // Show transaction history for a user
  async function showTransactionHistory(userId) {
    try {
      const transactions = await fetchData(ENDPOINTS.transactions);
      const userTransactions = transactions.filter(
        (t) => t.user.userId == userId
      );

      // Get user info from first transaction
      const user =
        userTransactions.length > 0 ? userTransactions[0].user : null;

      if (!user) {
        alert("No transactions found for this user");
        return;
      }

      // Populate customer info with more details
      const customerInfoSection = document.getElementById(
        "customerInfoSection"
      );
      customerInfoSection.innerHTML = `
              <h6><i class="fas fa-user"></i> <strong>Customer Profile</strong></h6>
              <div class="customer-detail">
                  <div>
                      <div class="detail-label">Name</div>
                      <div class="detail-value">${user.name}</div>
                  </div>
                  <div>
                      <div class="detail-label">Mobile</div>
                      <div class="detail-value">${user.mobile}</div>
                  </div>
                  <div>
                      <div class="detail-label">Email</div>
                      <div class="detail-value">${
                        user.email || "Not provided"
                      }</div>
                  </div>
                  <div>
                      <div class="detail-label">Customer Since</div>
                      <div class="detail-value">${new Date(
                        userTransactions[
                          userTransactions.length - 1
                        ].purchasedOn
                      ).toLocaleDateString()}</div>
                  </div>
                  <div>
                      <div class="detail-label">Total Transactions</div>
                      <div class="detail-value">${userTransactions.length}</div>
                  </div>
                  <div>
                      <div class="detail-label">Lifetime Value</div>
                      <div class="detail-value">${formatCurrency(
                        userTransactions.reduce((sum, t) => sum + t.amount, 0)
                      )}</div>
                  </div>
              </div>
          `;

      // Populate transaction table
      const transactionTableBody = document.getElementById(
        "transactionHistoryTableBody"
      );
      transactionTableBody.innerHTML = "";

      userTransactions.forEach((t) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                  <td>${t.plan.planName}</td>
                  <td>${new Date(t.purchasedOn).toLocaleDateString()}</td>
                  <td>${new Date(t.planEnd).toLocaleDateString()}</td>
                  <td>${formatCurrency(t.amount)}</td>
                  <td><span class="status-badge ${t.planStatus.toLowerCase()}">${
          t.planStatus
        }</span></td>
                  <td>${t.paymentMode}</td>
                  <td>${t.refNumber}</td>
              `;
        transactionTableBody.appendChild(tr);
      });

      // Show the modal
      const modal = new bootstrap.Modal(
        document.getElementById("transactionHistoryModal")
      );
      modal.show();
    } catch (error) {
      console.error("Error showing transaction history:", error);
      alert("Could not load transaction history. Please try again.");
    }
  }

  // Export expiring plans data to CSV
  function exportExpiringPlansData() {
    try {
      const table = document.getElementById("expiringPlansTable");
      let csv = [];

      // Get headers
      const headers = [];
      const headerCells = table.querySelectorAll("thead th");
      headerCells.forEach((cell) => {
        if (cell.textContent !== "Actions") {
          headers.push(cell.textContent);
        }
      });
      csv.push(headers.join(","));

      // Get rows
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const rowData = [];
        const cells = row.querySelectorAll("td");

        // Skip the actions column
        for (let i = 0; i < cells.length - 1; i++) {
          // Clean the cell data of commas
          let cellData = cells[i].textContent.replace(/,/g, " ");
          rowData.push(cellData);
        }

        csv.push(rowData.join(","));
      });

      // Create and download the CSV file
      const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        "expiring_plans_" + new Date().toISOString().split("T")[0] + ".csv"
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Could not export data. Please try again.");
    }
  }

  // Set up event listeners for chart buttons
  function setupChartButtons() {
    // User Growth chart period buttons
    document
      .querySelectorAll(".chart-box:nth-child(2) .chart-period")
      .forEach((button) => {
        button.addEventListener("click", function () {
          const period = parseInt(this.getAttribute("data-period"));

          // Update active state
          document
            .querySelectorAll(".chart-box:nth-child(2) .chart-period")
            .forEach((btn) => {
              btn.classList.remove("active");
            });
          this.classList.add("active");

          // Update the chart
          createUserGrowthChart(period);
        });
      });

    // Top categories chart buttons
    document.querySelectorAll(".wide-chart .chart-period").forEach((button) => {
      button.addEventListener("click", function () {
        const limit = parseInt(this.getAttribute("data-period"));

        // Update active state
        document
          .querySelectorAll(".wide-chart .chart-period")
          .forEach((btn) => {
            btn.classList.remove("active");
          });
        this.classList.add("active");

        // Update the chart
        createCategoryBarChart(limit);
      });
    });

    // Refresh buttons
    document
      .getElementById("refreshPieChart")
      .addEventListener("click", function () {
        createStatusPieChart();
      });

    document
      .getElementById("refreshLineChart")
      .addEventListener("click", function () {
        const activeButton = document.querySelector(
          ".chart-box:nth-child(2) .chart-period.active"
        );
        const period = parseInt(activeButton.getAttribute("data-period"));
        createUserGrowthChart(period);
      });

    document
      .getElementById("refreshBarChart")
      .addEventListener("click", function () {
        const activeButton = document.querySelector(
          ".wide-chart .chart-period.active"
        );
        const limit = parseInt(activeButton.getAttribute("data-period"));
        createCategoryBarChart(limit);
      });

    // Export button
    document
      .getElementById("exportExpiringData")
      .addEventListener("click", exportExpiringPlansData);
  }

  // Initialize all dashboard components
  async function initDashboard() {
    try {
      // Update KPI cards
      await updateKPICards();

      // Create charts
      await createStatusPieChart();
      await createUserGrowthChart(6); // Default to 6 months
      await createCategoryBarChart(5); // Default to top 5

      // Update expiring plans table
      await updateExpiringPlansTable();

      // Set up button event listeners
      setupChartButtons();

      console.log("Dashboard initialized successfully");
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    }
  }

  // Start the dashboard
  initDashboard();
});


// Revenue Analysis Section JavaScript

document.addEventListener("DOMContentLoaded", async function () {
  // API endpoints
  const transactionsEndpoint = "http://localhost:8083/api/transactions";
  const categoriesEndpoint = "http://localhost:8083/api/categories";

  // Initialize data containers
  let allTransactions = [];
  let allCategories = [];

  // DOM elements
  const revenueChart = document.getElementById("revenueChart");
  const planTypeRevenueChart = document.getElementById("planTypeRevenueChart");
  const refreshRevenueBtn = document.getElementById("refreshRevenueChart");
  const periodButtons = document.querySelectorAll(
    "#revenue-analysis .chart-period"
  );

  // Chart instances
  let revenueChartInstance = null;
  let planTypeRevenueChartInstance = null;

  // Active period (default: month)
  let activePeriod = "month";

  /**
   * Fetch data from API endpoints
   */
  async function fetchData() {
    try {
      // Fetch transactions and categories in parallel
      const [transactionsResponse, categoriesResponse] = await Promise.all([
        fetch(transactionsEndpoint),
        fetch(categoriesEndpoint),
      ]);

      if (!transactionsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      // Parse JSON responses
      allTransactions = await transactionsResponse.json();
      allCategories = await categoriesResponse.json();

      // Update KPI metrics
      updateKPIMetrics();

      // Initialize charts
      initializeCharts();

      return true;
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  }

  /**
   * Update KPI metrics based on transaction data
   */
  function updateKPIMetrics() {
    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate monthly revenue
    const monthlyRevenue = allTransactions
      .filter((txn) => {
        const txnDate = new Date(txn.purchasedOn);
        return (
          txnDate.getMonth() === currentMonth &&
          txnDate.getFullYear() === currentYear
        );
      })
      .reduce((total, txn) => total + txn.amount, 0);

    // Calculate previous month's revenue for growth comparison
    const prevMonthTransactions = allTransactions.filter((txn) => {
      const txnDate = new Date(txn.purchasedOn);
      // Previous month logic with year rollover handling
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        txnDate.getMonth() === prevMonth && txnDate.getFullYear() === prevYear
      );
    });

    const prevMonthRevenue = prevMonthTransactions.reduce(
      (total, txn) => total + txn.amount,
      0
    );

    // Calculate revenue growth percentage
    let revenueGrowth = 0;
    if (prevMonthRevenue > 0) {
      revenueGrowth =
        ((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
    }

    // Format revenue with Indian currency format (₹)
    const formattedRevenue = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(monthlyRevenue);

    // Update KPI values in UI
    document.getElementById("monthlyRevenue").textContent = formattedRevenue;

    const revenueGrowthElement = document.getElementById("revenueGrowth");
    revenueGrowthElement.textContent = `${revenueGrowth.toFixed(1)}%`;
    revenueGrowthElement.className =
      revenueGrowth >= 0
        ? "kpi-performance positive"
        : "kpi-performance negative";
  }

  /**
   * Initialize revenue charts
   */
  function initializeCharts() {
    // Prepare data for revenue trend chart
    prepareRevenueChartData();

    // Prepare data for plan type revenue distribution
    preparePlanTypeRevenueData();
  }

  /**
   * Prepare data for revenue trend chart (monthly or quarterly)
   */
  function prepareRevenueChartData() {
    // Destroy existing chart if it exists
    if (revenueChartInstance) {
      revenueChartInstance.destroy();
    }

    // Get current date for reference
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    let labels = [];
    let revenueData = [];

    if (activePeriod === "month") {
      // Monthly data - Show last 12 months
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Start from 11 months ago
      let startMonth = currentDate.getMonth() - 11;
      let startYear = currentYear;

      // Handle year rollover
      if (startMonth < 0) {
        startMonth += 12;
        startYear--;
      }

      // Generate data for each month
      for (let i = 0; i < 12; i++) {
        const month = (startMonth + i) % 12;
        const year = startYear + Math.floor((startMonth + i) / 12);

        // Generate label with month and year
        labels.push(`${monthNames[month]} ${year}`);

        // Filter transactions for this month
        const monthRevenue = allTransactions
          .filter((txn) => {
            const txnDate = new Date(txn.purchasedOn);
            return (
              txnDate.getMonth() === month && txnDate.getFullYear() === year
            );
          })
          .reduce((total, txn) => total + txn.amount, 0);

        revenueData.push(monthRevenue);
      }
    } else {
      // Quarterly data - Show last 8 quarters
      const quarters = ["Q1", "Q2", "Q3", "Q4"];

      // Start from 7 quarters ago
      let startQuarter = Math.floor(currentDate.getMonth() / 3) - 7;
      let startYear = currentYear;

      // Handle year rollover
      if (startQuarter < 0) {
        startQuarter += 4;
        startYear--;
      }

      // Generate data for each quarter
      for (let i = 0; i < 8; i++) {
        const quarter = (startQuarter + i) % 4;
        const year = startYear + Math.floor((startQuarter + i) / 4);

        // Generate label with quarter and year
        labels.push(`${quarters[quarter]} ${year}`);

        // Calculate start and end months for this quarter
        const startMonth = quarter * 3;
        const endMonth = startMonth + 2;

        // Filter transactions for this quarter
        const quarterRevenue = allTransactions
          .filter((txn) => {
            const txnDate = new Date(txn.purchasedOn);
            return (
              txnDate.getFullYear() === year &&
              txnDate.getMonth() >= startMonth &&
              txnDate.getMonth() <= endMonth
            );
          })
          .reduce((total, txn) => total + txn.amount, 0);

        revenueData.push(quarterRevenue);
      }
    }

    // Create the revenue trend chart
    const ctx = revenueChart.getContext("2d");
    revenueChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue Trend",
            data: revenueData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            tension: 0.2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                return "Revenue: ₹" + value.toLocaleString("en-IN");
              },
            },
          },
          title: {
            display: true,
            text:
              activePeriod === "month"
                ? "Monthly Revenue Trend"
                : "Quarterly Revenue Trend",
            font: {
              size: 16,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "₹" + value.toLocaleString("en-IN");
              },
            },
            title: {
              display: true,
              text: "Revenue (₹)",
            },
          },
          x: {
            title: {
              display: true,
              text: activePeriod === "month" ? "Month" : "Quarter",
            },
          },
        },
      },
    });
  }

  /**
   * Prepare data for plan type revenue distribution
   */
  function preparePlanTypeRevenueData() {
    // Destroy existing chart if it exists
    if (planTypeRevenueChartInstance) {
      planTypeRevenueChartInstance.destroy();
    }

    // Group transactions by plan category
    const categoryRevenue = {};

    // Initialize categories
    allCategories.forEach((category) => {
      categoryRevenue[category.categoryName] = 0;
    });

    // Sum revenue by category
    allTransactions.forEach((txn) => {
      // Some transactions might not have plan or categories
      if (txn.plan && txn.plan.categories && txn.plan.categories.length > 0) {
        txn.plan.categories.forEach((category) => {
          if (categoryRevenue[category.categoryName] !== undefined) {
            categoryRevenue[category.categoryName] += txn.amount;
          }
        });
      }
    });

    // Convert to arrays for Chart.js
    const labels = Object.keys(categoryRevenue);
    const data = Object.values(categoryRevenue);

    // Generate array of colors for each category
    const colors = generateColors(labels.length);

    // Create the plan type revenue chart
    const ctx = planTypeRevenueChart.getContext("2d");
    planTypeRevenueChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ₹${value.toLocaleString(
                  "en-IN"
                )} (${percentage}%)`;
              },
            },
          },
          title: {
            display: true,
            text: "Revenue by Plan Type",
            font: {
              size: 16,
            },
          },
        },
      },
    });
  }

  /**
   * Generate colors for chart
   */
  function generateColors(count) {
    const baseColors = [
      "rgba(255, 99, 132, 0.8)",
      "rgba(54, 162, 235, 0.8)",
      "rgba(255, 206, 86, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(153, 102, 255, 0.8)",
      "rgba(255, 159, 64, 0.8)",
      "rgba(199, 199, 199, 0.8)",
      "rgba(83, 102, 255, 0.8)",
      "rgba(40, 159, 136, 0.8)",
      "rgba(210, 105, 30, 0.8)",
    ];

    // If we need more colors, generate them
    const colors = [...baseColors];
    while (colors.length < count) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
    }

    return colors.slice(0, count);
  }

  /**
   * Event handler for period button clicks
   */
  function handlePeriodButtonClick(event) {
    // Get selected period
    const period = event.target.getAttribute("data-period");

    // Do nothing if already selected
    if (period === activePeriod) return;

    // Update active period
    activePeriod = period;

    // Update active button class
    periodButtons.forEach((btn) => {
      if (btn.getAttribute("data-period") === period) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update charts with new period
    prepareRevenueChartData();
  }

  /**
   * Initialize event listeners
   */
  function initializeEventListeners() {
    // Period button click handler
    periodButtons.forEach((btn) => {
      btn.addEventListener("click", handlePeriodButtonClick);
    });

    // Refresh button click handler
    refreshRevenueBtn.addEventListener("click", async function () {
      // Add rotation animation to refresh button
      this.querySelector("i").classList.add("fa-spin");

      // Fetch fresh data
      await fetchData();

      // Stop rotation animation after a short delay
      setTimeout(() => {
        this.querySelector("i").classList.remove("fa-spin");
      }, 500);
    });
  }

  // Initialize the revenue analysis section
  async function initializeRevenueAnalysis() {
    await fetchData();
    initializeEventListeners();
  }

  // Start initialization
  initializeRevenueAnalysis();
});

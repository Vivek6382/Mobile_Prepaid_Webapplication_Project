 
// Profile-DropDown-JS

document.addEventListener("DOMContentLoaded", function () {
    // User dropdown functionality
    const userDropdown = document.querySelector(".user-dropdown");
    const userIcon = document.getElementById("userIcon");
    const dropdownContent = document.querySelector(".dropdown-content");
    const signOutBtn = document.getElementById("signOutBtn");
    const myAccountBtn = document.getElementById("myAccountBtn");

    function updateDropdown() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");
        const accessToken = sessionStorage.getItem("accessToken");

        // Always make the user icon visible
        userIcon.style.display = "block";
        
        // Set up click handler for user icon
        userIcon.onclick = function (event) {
            event.stopPropagation();
            
            if (currentCustomer && accessToken) {
                // If authenticated, toggle dropdown
                userDropdown.classList.toggle("active");
            } else {
                // If not authenticated, redirect to recharge page
                window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
            }
        };

        if (currentCustomer && accessToken) {
            // My Account functionality
            myAccountBtn.onclick = function(event) {
                event.preventDefault();
                window.location.href = "/Mobile_Prepaid_Customer/My_Account/My_Account.html";
            };
            
            // Sign-out functionality with backend logout
            signOutBtn.onclick = async function (event) {
                event.preventDefault();
                
                try {
                    const storedCustomer = JSON.parse(currentCustomer);
                    const logoutResponse = await fetch("http://localhost:8083/auth/logout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ 
                            refreshToken: storedCustomer.refreshToken 
                        })
                    });

                    // Clear session storage
                    sessionStorage.removeItem("accessToken");
                    sessionStorage.removeItem("currentCustomer");
                    localStorage.removeItem("accessToken");

                    // Redirect
                    window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
                } catch (error) {
                    console.error("Logout error:", error);
                    // Fallback clear
                    sessionStorage.removeItem("accessToken");
                    sessionStorage.removeItem("currentCustomer");
                    localStorage.removeItem("accessToken");
                    window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
                }
            };
        }
    }

    // Initialize dropdown behavior
    updateDropdown();

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
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
        }
    });
});


function setupHamburgerMenu() {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.navigation_main .nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navItems = document.querySelectorAll('.navigation_main a');
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
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupHamburgerMenu);




// Transaction JS
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("transaction-popup");
    const viewDetailsBtn = document.querySelector(".transaction-view-btn");
    const doneBtn = document.getElementById("transaction-done-btn");

    // Get values from transaction card
    function getTransactionValues() {
        return {
            amount: document.getElementById("transaction-amount").textContent,
            status: document.getElementById("transaction-status").textContent,
            date: document.getElementById("transaction-date").textContent,
            mode: document.getElementById("transaction-mode").textContent,
            ref: document.getElementById("transaction-ref").textContent,
            start: document.getElementById("transaction-start").textContent,
            end: document.getElementById("transaction-end").textContent
        };
    }

    // Populate popup dynamically
    function populatePopup(data) {
        document.getElementById("popup-amount").textContent = data.amount;
        document.getElementById("popup-status").textContent = data.status;
        document.getElementById("popup-date").textContent = data.date;
        document.getElementById("popup-mode").textContent = data.mode;
        document.getElementById("popup-ref").textContent = data.ref;
        document.getElementById("popup-start").textContent = data.start;
        document.getElementById("popup-end").textContent = data.end;
    }

    // Show pop-up on "View Details" button click
    viewDetailsBtn.addEventListener("click", function () {
        const transactionData = getTransactionValues(); // Get values
        populatePopup(transactionData); // Set values in pop-up
        popup.style.display = "flex"; // Show the pop-up
    });

    // Hide pop-up on "Done" button click
    doneBtn.addEventListener("click", function () {
        popup.style.display = "none"; // Hide the pop-up
    });

    // Close pop-up if clicked outside the content box
    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none"; // Hide when clicking outside
        }
    });
});





// SideBar-Navigation

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Script Loaded & DOM Ready!"); // Debugging message
  
    // Get sidebar links
    const accountLink = document.getElementById("show-account");
    const historyLink = document.getElementById("show-history");
  
    console.log("Account Link:", accountLink);
    console.log("History Link:", historyLink);
  
    if (!accountLink || !historyLink) {
      console.error("❌ Sidebar links are MISSING. Check your HTML IDs.");
      return;
    }
  
    // Get sections
    const accountSection = document.getElementById("Account_details");
    const historySection = document.getElementById("Recharge-history");
  
    console.log("Account Section:", accountSection);
    console.log("History Section:", historySection);
  
    if (!accountSection || !historySection) {
      console.error("❌ Content sections are MISSING. Check your HTML IDs.");
      return;
    }
  
    // Function to show the selected section
    function showSection(selectedSection) {
      console.log(`📌 Showing section: ${selectedSection.id}`);
      [accountSection, historySection].forEach(section => {
        section.style.display = "none";
      });
      selectedSection.style.display = "block";
    }
  
    // Event Listeners
    accountLink.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("📌 Account link clicked!");
      showSection(accountSection);
    });
  
    historyLink.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("📌 History link clicked!");
      showSection(historySection);
    });
  
    // Default view
    showSection(accountSection);
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

//Filter-navigation

document.addEventListener("DOMContentLoaded", function () {
    // Selecting navigation elements
    const navLinks = document.querySelectorAll(".expires_list");
  
    // Function to filter transactions dynamically
    function filterTransaction(status) {
        const transactionCards = document.querySelectorAll(".cust_manage_card");
  
        transactionCards.forEach(card => {
            if (status === "all" || card.classList.contains(status)) {
                card.style.display = "flex"; // Show matching cards
            } else {
                card.style.display = "none"; // Hide non-matching cards
            }
        });
  
        // Update active navigation
        navLinks.forEach(link => link.classList.remove("active-nav"));
        document.querySelector(`.${status}_list`)?.classList.add("active-nav");
    }
  
    // Adding event listeners for filter navigation
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const status = this.classList.contains("all_list") ? "all" :
                this.classList.contains("successful_list") ? "successful" :
                this.classList.contains("unsuccessful_list") ? "failed" : "";
  
            if (status) filterTransaction(status);
        });
    });
  
    // Initialize with 'All' filter after dynamic content load
    setTimeout(() => filterTransaction("all"), 500);
  });
  





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
  



// Profile Picture & User Details Handling
// Dynamic Account Detail JSON Population

// Profile Picture & User Details Handling
document.addEventListener("DOMContentLoaded", function () {
    const currentCustomer = sessionStorage.getItem("currentCustomer");
    if (!currentCustomer) {
        // Redirect to recharge page if not logged in
        window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
        return;
    }
    
    // Parse the stored customer details
    const userData = JSON.parse(currentCustomer);
    
    // Populate details dynamically
    document.querySelector(".user-name").textContent = userData.name;
    document.querySelector(".user-mobile").textContent = `+91 ${userData.mobile}`;
    
    const infoItems = document.querySelectorAll(".info-grid .info-item span");
    infoItems[0].textContent = userData.dob; // DOB
    infoItems[1].textContent = userData.email; // Email
    infoItems[2].textContent = `+91 ${userData.alternateNumber}`; // Alternate Number
    infoItems[3].textContent = userData.contactMethod; // Ways to Contact
    infoItems[4].textContent = userData.communicationLanguage; // Communication Language (Hidden)
    infoItems[5].textContent = userData.address; // Permanent Address (Hidden)
    
    // Additional Hidden Fields
    if (userData.role) {
        const roleItem = document.createElement("div");
        roleItem.classList.add("info-item", "hidden");
        roleItem.innerHTML = `<i class="fas fa-user"></i> Role: <span class="text-white">${userData.role}</span>`;
        document.querySelector(".info-grid").appendChild(roleItem);
    }
    
    if (userData.username) {
        const usernameItem = document.createElement("div");
        usernameItem.classList.add("info-item", "hidden");
        usernameItem.innerHTML = `<i class="fas fa-user-circle"></i> Username: <span class="text-white">${userData.username}</span>`;
        document.querySelector(".info-grid").appendChild(usernameItem);
    }
    
    // Call Updated Profile Picture Handling after user details are populated
    handleProfilePicture(userData.userId, userData.mobile, userData.name);
});

// Updated Function to Handle Profile Picture Logic
// Updated Function to Handle Profile Picture Logic with Better Error Handling
function handleProfilePicture(userId, userMobile, userName) {
    const profilePic = document.getElementById("profile-pic");
    const profileUpload = document.getElementById("profile-upload");
    const profileImage = document.getElementById("profile-image");
    const profileInitial = document.getElementById("profile-initial");
    const sideProfilePic = document.getElementById("user-profile-pic");
    
    if (!profilePic || !profileUpload || !profileImage || !profileInitial || !sideProfilePic) {
        console.error("Profile picture elements not found!");
        return;
    }
    
    console.log(`Attempting to load profile picture for user ${userId}`);
    
    // First try to load profile picture from backend
    fetch(`/api/users/${userId}/profile-picture`)
        .then(response => {
            console.log("Profile picture fetch response:", response.status);
            if (response.ok) {
                return response.blob();
            } else {
                console.log("No profile picture found on server, checking session storage");
                // If no profile picture in backend, try localStorage
                const storedProfilePic = sessionStorage.getItem(`profilePic_${userMobile}`);
                if (storedProfilePic) {
                    console.log("Found profile picture in session storage");
                    displayProfilePicture(storedProfilePic);
                    return null;
                } else {
                    console.log("No profile picture found in session storage, using initials");
                    // If no profile picture anywhere, use initials
                    setProfileInitials(userName);
                    return null;
                }
            }
        })
        .then(blob => {
            if (blob) {
                console.log(`Received profile picture blob of size: ${blob.size} bytes`);
                const imageURL = URL.createObjectURL(blob);
                displayProfilePicture(imageURL);
                // Also save to session storage for offline use
                saveToSessionStorage(blob, userMobile);
            }
        })
        .catch(error => {
            console.error("Error fetching profile picture:", error);
            setProfileInitials(userName);
        });
    
    // Handle profile picture upload
    profilePic.addEventListener("click", function () {
        profileUpload.click();
    });
    
    profileUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            console.log(`Selected file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                return;
            }
            
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size exceeds maximum limit (2MB)');
                return;
            }
            
            // Display image immediately for better UX
            console.log("Loading file preview");
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageURL = e.target.result;
                displayProfilePicture(imageURL);
                // Save to session storage
                sessionStorage.setItem(`profilePic_${userMobile}`, imageURL);
                console.log("Saved image to session storage");
            };
            reader.readAsDataURL(file);
            
            // Upload to backend
            uploadProfilePicture(userId, file);
        }
    });
    
    // Helper function to display profile picture
    function displayProfilePicture(imageURL) {
        console.log("Displaying profile picture");
        profileImage.src = imageURL;
        profileImage.style.display = "block";
        profileInitial.style.display = "none";
        
        sideProfilePic.style.backgroundImage = `url(${imageURL})`;
        sideProfilePic.style.backgroundSize = "cover";
        sideProfilePic.style.backgroundPosition = "center";
        sideProfilePic.innerHTML = "";
    }
    
    // Helper function to save blob to session storage
    function saveToSessionStorage(blob, userMobile) {
        console.log("Saving blob to session storage");
        const reader = new FileReader();
        reader.onload = function(e) {
            sessionStorage.setItem(`profilePic_${userMobile}`, e.target.result);
            console.log("Blob saved to session storage");
        };
        reader.readAsDataURL(blob);
    }
    
    // Function to upload profile picture to backend with detailed error handling
   // Replace your uploadProfilePicture function with this implementation
function uploadProfilePicture(userId, file) {
    console.log(`Uploading profile picture for user ${userId}`);
    
    // Create FormData to send the file
    const formData = new FormData();
    formData.append("file", file);
    
    // Try using FormData first (your original multipart approach)
    fetch(`/api/users/${userId}/profile-picture`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            console.log("Multipart upload failed, falling back to base64 upload");
            // If multipart fails, fall back to base64 upload
            uploadProfilePictureAsBase64(userId, file);
            return null;
        }
        return response.text();
    })
    .then(data => {
        if (data) {
            console.log('Profile picture uploaded successfully via multipart:', data);
        }
    })
    .catch(error => {
        console.error('Error during multipart upload:', error);
        console.log("Falling back to base64 upload");
        uploadProfilePictureAsBase64(userId, file);
    });
}

// Implementation of base64 upload (you already had part of this)
function uploadProfilePictureAsBase64(userId, file) {
    console.log("Using base64 upload method");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
        const base64String = reader.result;
        const base64Image = base64String.split(',')[1]; // Remove the "data:image/jpeg;base64," part
        
        fetch(`/api/users/${userId}/profile-picture-base64`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('Profile picture uploaded successfully via base64:', data);
        })
        .catch(error => {
            console.error('Error uploading profile picture via base64:', error);
            alert('Failed to upload profile picture to server. The picture will be available for this session only.');
        });
    };
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('Error reading the file. Please try again with a different image.');
    };
}
}

// Function to Set Profile Initials (unchanged)
function setProfileInitials(name) {
    let userInitial = name ? name.trim().charAt(0).toUpperCase() : "U";
    const profileInitial = document.getElementById("profile-initial");
    profileInitial.innerText = userInitial;
    profileInitial.style.display = "flex";
    
    const sideProfilePic = document.getElementById("user-profile-pic");
    let sideProfileInitial = document.createElement("span");
    sideProfileInitial.innerText = userInitial;
    sideProfileInitial.style.fontSize = "46px";
    sideProfileInitial.style.color = "#333";
    sideProfileInitial.style.fontWeight = "bold";
    sideProfileInitial.style.textTransform = "uppercase";
    sideProfilePic.innerHTML = "";
    sideProfilePic.appendChild(sideProfileInitial);
}





// Update-Js

// Update-Js

document.addEventListener("DOMContentLoaded", function () {
    const updatePopup = document.getElementById("update-popup");
    const updateBtn = document.getElementById("update-btn");
    const cancelUpdateBtn = document.getElementById("cancel-update");
    const closeBtn = document.querySelector(".close-btn");

    // Selecting user details
    const userName = document.querySelector(".user-name");
    const userMobile = document.querySelector(".user-mobile");
    const userEmail = document.querySelector(".fa-envelope + span");
    const userContactMethod = document.querySelector(".fa-comment + span");
    const userDOB = document.querySelector(".fa-calendar + span");
    const userLanguage = document.querySelector(".fa-language + span");
    const userAddress = document.querySelector(".fa-map-marker-alt + span");
    const userAltMobile = document.querySelector(".fa-phone + span");
    const userRole = document.querySelector(".user-role");
    const userUsername = document.querySelector(".user-username");

    // Select the edit button
    const editButton = document.querySelector(".edit-icon");

    if (editButton) {
        editButton.addEventListener("click", function () {
            if (updatePopup) {
                let mobileNumber = userMobile?.textContent.trim() || "";
                let altMobileNumber = userAltMobile?.textContent.trim() || "";

                document.getElementById("update-name").value = userName?.textContent || "";
                document.getElementById("update-mobile").value = mobileNumber.replace(/^\+91\s*/, "");
                document.getElementById("update-alt-mobile").value = altMobileNumber.replace(/^\+91\s*/, "");
                document.getElementById("update-email").value = userEmail?.textContent || "";

                let contactMethodValue = userContactMethod?.textContent.trim() || "EMAIL";
                let languageValue = userLanguage?.textContent.trim() || "ENGLISH";

                document.getElementById("update-contact-method").value = contactMethodValue;
                document.getElementById("update-language").value = languageValue;

                document.getElementById("update-dob").value = userDOB?.textContent || "";
                document.getElementById("update-address").value = userAddress?.textContent || "";

                document.getElementById("update-role").value = sessionStorage.getItem("userRole") || "ROLE_GUEST";
                document.getElementById("update-username").value = userUsername?.textContent || "";

                updatePopup.style.display = "flex";
            } else {
                console.error("Update popup not found!");
            }
        });
    } else {
        console.error("Edit button (.edit-icon) not found!");
    }

    // Dynamic validation for editable fields
    const validateInput = (input, regex, errorMessage) => {
        let errorSpan = input.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains("error-message")) {
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error-message");
            input.parentNode.appendChild(errorSpan);
        }

        if (!regex.test(input.value.trim())) {
            errorSpan.innerHTML = `❌ ${errorMessage}`;
            errorSpan.style.color = "red";
            return false;
        } else {
            errorSpan.innerHTML = "";
            return true;
        }
    };

    document.getElementById("update-alt-mobile").addEventListener("input", function () {
        validateInput(this, /^\d{10}$/, "Enter a valid 10-digit mobile number!");
    });

    document.getElementById("update-email").addEventListener("input", function () {
        validateInput(this, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email address!");
    });

    // Close pop-up when cancel button is clicked
    cancelUpdateBtn?.addEventListener("click", function () {
        updatePopup.style.display = "none";
    });

    // Close pop-up when close (×) button is clicked
    closeBtn?.addEventListener("click", function () {
        updatePopup.style.display = "none";
    });

    // Save updated details with API call
    updateBtn?.addEventListener("click", function () {
        let altMobileInput = document.getElementById("update-alt-mobile");
        let emailInput = document.getElementById("update-email");

        let altMobileValid = validateInput(altMobileInput, /^\d{10}$/, "Enter a valid 10-digit mobile number!");
        let emailValid = validateInput(emailInput, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid email address!");

        if (!altMobileValid || !emailValid) {
            alert("Please correct the highlighted errors before updating.");
            return;
        }

        let updatedDetails = {
            alternateNumber: altMobileInput.value.trim(),
            email: emailInput.value.trim(),
            contactMethod: document.getElementById("update-contact-method").value,
            communicationLanguage: document.getElementById("update-language").value,
        };

        fetch("http://localhost:8083/api/users/1/update-details", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDetails),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update details.");
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            alert("User details updated successfully!");

            // Update UI
            if (userAltMobile) userAltMobile.textContent = updatedDetails.alternateNumber;
            if (userEmail) userEmail.textContent = updatedDetails.email;
            if (userContactMethod) userContactMethod.textContent = updatedDetails.contactMethod;
            if (userLanguage) userLanguage.textContent = updatedDetails.communicationLanguage;

            // Update session storage
            let currentCustomer = JSON.parse(sessionStorage.getItem("currentCustomer")) || {};
            currentCustomer.altMobile = updatedDetails.alternateNumber;
            currentCustomer.email = updatedDetails.email;
            currentCustomer.contactMethod = updatedDetails.contactMethod;
            currentCustomer.language = updatedDetails.communicationLanguage;

            sessionStorage.setItem("currentCustomer", JSON.stringify(currentCustomer));

            updatePopup.style.display = "none";
        })
        .catch(error => {
            console.error("Error updating details:", error);
            alert("An error occurred while updating details.");
        });
    });
});





// Dynamic-OTT-JS


// Dynamic-OTT-JS

document.addEventListener("DOMContentLoaded", function() {
    const ottTextElement = document.querySelector(".ott-text-data");
    const ottIconsContainer = document.querySelector(".ott-icons");
    const moreOtt = document.querySelector(".more-ott");

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
            if (ottClassMap[ott] && loadedIcons < 3) {
                let icon = document.createElement("div");
                icon.classList.add("icon", ottClassMap[ott]);

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




// Dynamic-Pop-up-Content-JS 
// Dynamic OTT Icons with Fallback Handling
document.addEventListener("DOMContentLoaded", function () {
    const ottTextElement = document.querySelector(".ott-text-data");
    const ottIconsContainer = document.querySelector(".ott-icons");
    const moreOtt = document.querySelector(".more-ott");

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




// Dynamic Pop-up Content JS
document.querySelector('.open-popup').addEventListener('click', function (e) {
    e.preventDefault();

    const card = document.querySelector('.vi_card');

    // Set Plan Name & Cost
    document.querySelector('.plan-title-custom').textContent = card.querySelector('.plan-name').textContent;
    document.querySelector('.plan-cost-custom').textContent = card.querySelector('.price').textContent;

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
    const planDetailsBody = document.getElementById('plan-details-body');
    planDetailsBody.innerHTML = '';

    card.querySelectorAll('.benefit').forEach(benefit => {
        const iconClass = benefit.querySelector('i')?.className.trim();
        const textValue = benefit.textContent.trim();

        if (iconClass && textValue) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${featureMap[iconClass] || "Unknown"}</td>
                <td class="separator"></td>
                <td>${textValue}</td>
            `;
            planDetailsBody.appendChild(row);
        }
    });

    // Populate OTT Benefits (Fixing Fallback Issue)
    const perkList = document.querySelector('.perk-list-custom');
    perkList.innerHTML = '';

    const ottTextElement = card.querySelector('.ott-text-data');
    if (ottTextElement) {
        const ottNames = ottTextElement.textContent.split(', ').map(ott => ott.trim());
        const ottDescriptions = card.querySelectorAll('.ott-description-data div');

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

        // Function to create a fallback icon with background color
        function createFallbackIcon(name) {
            const fallbackDiv = document.createElement("div");
            fallbackDiv.classList.add("fallback-icon", classMap[name] || "default-fallback");
            fallbackDiv.innerText = name.charAt(0).toUpperCase(); // First letter
            return fallbackDiv;
        }

        ottNames.forEach(name => {
            const desc = [...ottDescriptions].find(div => div.getAttribute('data-ott') === name)?.textContent || '';
            const imgSrc = logoMap[name] || '';

            const perkItem = document.createElement('div');
            perkItem.classList.add('perk-item-custom');

            let imgElement = document.createElement("img");
            imgElement.src = imgSrc;
            imgElement.alt = `${name} Logo`;

            // Handling fallback when image fails to load
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
    const termsContainer = document.getElementById('terms-content');
    termsContainer.innerHTML = '';

    card.querySelectorAll('.terms-conditions p').forEach(p => {
        const paragraph = document.createElement('p');
        paragraph.textContent = p.textContent;
        termsContainer.appendChild(paragraph);
    });

    // Show Popup
    document.getElementById('unique-popup-overlay').classList.add('active');
});

// Close Popup
document.getElementById('close-unique-popup').addEventListener('click', function () {
    document.getElementById('unique-popup-overlay').classList.remove('active');
});






//Download Invoice - Tanscation details :

const downloadInvoiceBtn = document.getElementById("transaction-download-btn");

// Attach event listener for "Download Invoice" button
downloadInvoiceBtn.addEventListener("click", function () {
    generateInvoice(); // Call the invoice generation function
});



// Invoice-Details-JS

// Ensure DOM is loaded before executing
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("download-invoice").addEventListener("click", function () {
        generateInvoice();
    });
});

function generateInvoice() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Fetch user details
    const userName = document.querySelector(".user-name").textContent.trim();
    const userMobile = document.querySelector(".user-mobile").textContent.trim();
    const userEmail = document.querySelector(".fa-envelope + span").textContent.trim();

    // Fetch transaction details
    const planAmount = document.getElementById("transaction-amount").textContent.replace(/[^\d.]/g, '').trim(); // Retain only digits and decimal
    const rupeeSymbol = String.fromCharCode(8377); // Unicode ₹ symbol
    const formattedPlanAmount = rupeeSymbol + " " + planAmount; // Ensure ₹ is explicitly added

    const transactionDate = document.getElementById("transaction-date").textContent.replace(/\s+/g, ' ').trim();
    const paymentMode = document.getElementById("transaction-mode").textContent.trim();
    const refNumber = document.getElementById("transaction-ref").textContent.trim();
    const transactionStatus = document.getElementById("transaction-status").textContent.trim();
    const planStartDate = document.getElementById("transaction-start").textContent.replace(/\s+/g, ' ').trim();
    const planEndDate = document.getElementById("transaction-end").textContent.replace(/\s+/g, ' ').trim();

    // Fetch plan details
    const planName = "Mobi-Comm Plan";
    const planDuration = document.querySelector(".benefit:nth-child(2)").textContent.trim();
    const planData = document.querySelector(".benefit:nth-child(3)").textContent.trim();
    const planCalls = document.querySelector(".benefit:nth-child(4)").textContent.trim();
    const planTotalData = document.querySelector(".benefit:nth-child(5)").textContent.trim();
    const planSms = document.querySelector(".benefit:nth-child(6)").textContent.trim();

    // Invoice details
    const invoiceNo = "INV" + Math.floor(Math.random() * 1000000);
    const companyName = "Mobi-Comm Services";
    const companyAddress = "123, Tech Street, City, India - 600001";

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
            ["Amount", formattedPlanAmount], // Corrected ₹ symbol issue
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




// Dynamic-Sidebar-Data-Fetch


// Dynamic Sidebar Data Fetch (Updated)
document.addEventListener("DOMContentLoaded", async function () {
    // Fetch user details dynamically from account details
    const userNameElement = document.querySelector("#user-name");
    const userContactElement = document.querySelector(".user-contact");

    // Selecting user details from session storage
    const currentCustomer = JSON.parse(sessionStorage.getItem("currentCustomer"));

    if (currentCustomer) {
        userNameElement.textContent = currentCustomer.name || "User";
        userContactElement.textContent = currentCustomer.mobile || "Not Available";
    } else {
        userNameElement.textContent = "User";
        userContactElement.textContent = "Not Available";
    }

    // Fetch active plan details dynamically
    try {
        const response = await fetch("http://localhost:8083/api/transactions");
        if (!response.ok) throw new Error("Failed to fetch transaction data");

        const transactions = await response.json();
        const userTransactions = transactions.filter(t => t.user.mobile === currentCustomer?.mobile);

        if (userTransactions.length === 0) {
            updateSidebarWithNoPlan();
            return;
        }

        const today = new Date();
        let activeTransaction = null;

        userTransactions.forEach(transaction => {
            const planEndDate = new Date(transaction.planEnd);
            if (planEndDate >= today) {
                if (!activeTransaction || new Date(transaction.purchasedOn) < new Date(activeTransaction.purchasedOn)) {
                    activeTransaction = transaction;
                }
            }
        });

        if (!activeTransaction) {
            updateSidebarWithNoPlan();
            return;
        }

        // ✅ Wait for transactions to be rendered, then update sidebar
        setTimeout(() => {
            updateSidebarWithPlan(activeTransaction);
        }, 100); // Small delay to allow DOM to update

    } catch (error) {
        console.error("Error fetching transactions:", error);
        updateSidebarWithNoPlan();
    }

    function updateSidebarWithPlan(transaction) {
        const planDetails = transaction.plan;

        const activePlanText = document.querySelector("#active-plan");
        const expiryDateSpan = document.querySelector("#expiry-date");
        const totalRecharges = document.querySelector("#total-recharges");

        // ✅ Ensure the recharge count updates AFTER rendering
        const rechargeCards = document.querySelectorAll(".cust_manage_card");
        if (totalRecharges) {
            totalRecharges.textContent = `${rechargeCards.length} Recharges`;
        }


        if (activePlanText) {
            const planName = planDetails.planName || "Unknown Plan";
            const price = planDetails.price ? `₹${planDetails.price}` : "₹0";
            const duration = planDetails.validity ? `${planDetails.validity} Days` : "No Duration";
            activePlanText.textContent = `${price} - ${duration}`;
        }

        if (expiryDateSpan) {
            expiryDateSpan.textContent = `Expires: ${transaction.planEnd ? new Date(transaction.planEnd).toLocaleDateString() : "Not Available"}`;
        }
    }

    function updateSidebarWithNoPlan() {
        document.querySelector("#active-plan").textContent = "No Active Plan";
        document.querySelector("#expiry-date").textContent = "Expires: Not Available";
        document.querySelector("#total-recharges").textContent = "0 Recharges";
    }
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









// Active-plan-Transaction-Dynamic-JS

// Active-plan-Transaction-Dynamic-JS (Updated to fetch data from API)

document.addEventListener("DOMContentLoaded", async function () {
    const planContainer = document.getElementById("Active_plans_section");
    const transactionSection = document.getElementById("transaction_section");

    // Get current customer from session storage
    const currentCustomer = JSON.parse(sessionStorage.getItem("currentCustomer"));
    if (!currentCustomer) {
        displayNoActivePlans();
        return;
    }

    const mobileNumber = currentCustomer.mobile;
    try {
        const response = await fetch("http://localhost:8083/api/transactions");
        if (!response.ok) throw new Error("Failed to fetch transaction data");
        
        const transactions = await response.json();
        const userTransactions = transactions.filter(t => t.user.mobile === mobileNumber);
        
        if (userTransactions.length === 0) {
            displayNoActivePlans();
            return;
        }

        const today = new Date();
        let activeTransaction = null;

        userTransactions.forEach(transaction => {
            const planEndDate = new Date(transaction.planEnd);
            if (planEndDate >= today) {
                if (!activeTransaction || new Date(transaction.purchasedOn) < new Date(activeTransaction.purchasedOn)) {
                    activeTransaction = transaction;
                }
            }
        });

        if (!activeTransaction) {
            displayNoActivePlans();
            return;
        }

        const planDetails = activeTransaction.plan;
        const cardContent = document.querySelector(".card-content");
        document.querySelector(".plan-name").textContent = planDetails.planName || "Unknown Plan";
        document.querySelector(".price").textContent = `₹${planDetails.price || 0}`;

        cardContent.innerHTML = "";
        
        addBenefit(cardContent, "fas fa-calendar-alt", `${planDetails.validity} Days`);
        if (planDetails.dailyData) addBenefit(cardContent, "fas fa-tachometer-alt", planDetails.dailyData);
        if (planDetails.voice) addBenefit(cardContent, "fas fa-phone-alt", planDetails.voice);
        if (planDetails.totalData) addBenefit(cardContent, "fas fa-wifi", planDetails.totalData);
        if (planDetails.sms) addBenefit(cardContent, "fas fa-envelope", planDetails.sms);

        const termsElement = document.querySelector(".terms-conditions");
        termsElement.innerHTML = "";
        if (planDetails.terms?.length > 0) {
            planDetails.terms.forEach(term => {
                const termItem = document.createElement("p");
                termItem.textContent = `• ${term}`;
                termsElement.appendChild(termItem);
            });
        } else {
            termsElement.innerHTML = "<p>No specific terms & conditions available.</p>";
        }

        const ottTextElement = document.querySelector(".ott-text-data");
        const ottIconsContainer = document.createElement("div");
        ottIconsContainer.classList.add("ott-icons");

        if (planDetails.ott?.length > 0) {
            ottTextElement.textContent = planDetails.ott.join(", ");
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

            let loadedIcons = 0;
            planDetails.ott.forEach((ott, index) => {
                if (index < 3) {
                    let icon = document.createElement("div");
                    icon.classList.add("icon", ottClassMap[ott] || "");

                    let img = document.createElement("img");
                    img.src = ottLogos[ott] || "";
                    img.alt = ott;

                    let fallbackText = document.createElement("span");
                    fallbackText.classList.add("fallback-icon");
                    fallbackText.innerText = ott.charAt(0).toUpperCase();

                    img.onerror = function () {
                        img.remove();
                        icon.appendChild(fallbackText);
                    };

                    icon.appendChild(img);
                    ottIconsContainer.appendChild(icon);
                    loadedIcons++;
                }
            });

            if (planDetails.ott.length > 3) {
                const moreText = document.createElement("span");
                moreText.classList.add("ott-more-text");
                moreText.textContent = `+${planDetails.ott.length - 3} more`;
                ottIconsContainer.appendChild(moreText);
            }
        }
        cardContent.appendChild(ottIconsContainer);

        document.getElementById("transaction-amount").textContent = `₹${activeTransaction.amount}`;
        document.getElementById("transaction-date").textContent = activeTransaction.purchasedOn;
        document.getElementById("transaction-mode").textContent = activeTransaction.paymentMode;
        document.getElementById("transaction-ref").textContent = activeTransaction.refNumber || "N/A";
        document.getElementById("transaction-status").textContent = activeTransaction.transactionStatus || "N/A";
        document.getElementById("transaction-start").textContent = activeTransaction.planStart || "N/A";
        document.getElementById("transaction-end").textContent = activeTransaction.planEnd || "N/A";
    } catch (error) {
        console.error("Error fetching transactions:", error);
        displayNoActivePlans();
    }

    function addBenefit(container, iconClass, text) {
        const benefitDiv = document.createElement("div");
        benefitDiv.classList.add("benefit");
        benefitDiv.innerHTML = `<i class="${iconClass}"></i> <span>${text}</span>`;
        container.appendChild(benefitDiv);
    }

    function displayNoActivePlans() {
        planContainer.innerHTML = `<h2 style="color: orangered; text-align: center;">No Active Plans or Transaction Details Available</h2>`;
        transactionSection.style.display = "none";
    }
});






// Dynamically recharge history card and papulation

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".cust_manage_cards_container");

    fetch("http://localhost:8083/api/transactions")
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ""; // Clear existing content

            data.forEach(transaction => {
                const card = document.createElement("div");
                card.classList.add("cust_manage_card", transaction.transactionStatus.toLowerCase());

                card.innerHTML = `
                    <!-- ✅ Batch Label (Month & Year) -->
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

                        <!-- ✅ Hidden Plan Details -->
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

                        <!-- ✅ Hidden Transaction Details -->
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

                    <!-- ✅ Footer Icons -->
                    <div class="cust_card_footer">
                        <i class="fa-solid fa-download download-icon"></i>
                        <i class="fa-solid fa-eye view-icon"></i>
                    </div>

                    <!-- ✅ Chevron Button -->
                    <div class="chevron-icon">
                        <i class="fa fa-chevron-right"></i>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error fetching transactions:", error));
});











//Pagination Logic :

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".cust_manage_cards_container");
    const paginationContainer = document.querySelector(".pagination");
    const itemsPerPage = 3;
    let currentPage = 1;
    let allCards = [];

    function initializePagination() {
        if (allCards.length === 0) return;

        let totalPages = Math.ceil(allCards.length / itemsPerPage);
        paginationContainer.innerHTML = "";

        let prevLi = document.createElement("li");
        prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
        prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        prevLi.addEventListener("click", function () {
            if (currentPage > 1) showPage(currentPage - 1);
        });
        paginationContainer.appendChild(prevLi);

        for (let i = 1; i <= totalPages; i++) {
            let li = document.createElement("li");
            li.className = `page-item ${i === currentPage ? "active" : ""}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", function () {
                showPage(i);
            });
            paginationContainer.appendChild(li);
        }

        let nextLi = document.createElement("li");
        nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
        nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
        nextLi.addEventListener("click", function () {
            if (currentPage < totalPages) showPage(currentPage + 1);
        });
        paginationContainer.appendChild(nextLi);

        showPage(currentPage);
    }

    function showPage(page) {
        let start = (page - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        allCards.forEach((card, index) => {
            card.style.display = index >= start && index < end ? "block" : "none";
        });
        currentPage = page;
        initializePagination();
    }

    fetch("http://localhost:8083/api/transactions")
    .then(response => response.json())
    .then(data => {
        container.innerHTML = ""; // Clear existing content
        allCards = [];

        // ✅ Get logged-in user ID from session storage
        const currentUser = JSON.parse(sessionStorage.getItem("currentCustomer"));
        const currentUserId = currentUser ? currentUser.userId : null;

        if (!currentUserId) {
            console.error("User is not logged in.");
            return;
        }

        // ✅ Filter transactions based on logged-in user ID
        const userTransactions = data.filter(transaction => transaction.user.userId === currentUserId);

        userTransactions.forEach(transaction => {
            const card = document.createElement("div");
            card.classList.add("cust_manage_card", transaction.transactionStatus.toLowerCase());

            card.innerHTML = `
                <!-- ✅ Batch Label (Month & Year) -->
                <span class="batch-label badge badge-secondary">${new Date(transaction.planStart).toLocaleString('en-US', { month: 'short', year: 'numeric' })}</span>

                <div class="dot_div">
                    <span class="status-dot"></span>
                </div>

                <div class="recharge_history_info">
                    <div class="recharge_history_row">
                        <div class="recharge_mobile_div">
                            <span class="recharge_mobile">Transaction ID: <span class="recharge_plan-category">${transaction.refNumber}</span></span>
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

                    <!-- ✅ Hidden Plan Details -->
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

                    <!-- ✅ Hidden Transaction Details -->
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

                <!-- ✅ Footer Icons -->
                <div class="cust_card_footer">
                    <i class="fa-solid fa-download download-icon"></i>
                    <i class="fa-solid fa-eye view-icon"></i>
                </div>

                <!-- ✅ Chevron Button -->
                <div class="chevron-icon">
                    <i class="fa fa-chevron-right"></i>
                </div>
            `;

            allCards.push(card);
            container.appendChild(card);
        });

        initializePagination();
    })
    .catch(error => console.error("Error fetching transactions:", error));
});




// Mobile Menu Toggle for My Account Page
document.addEventListener("DOMContentLoaded", function() {
  // Create mobile menu toggle button if on My Account page
  if (document.querySelector('.sidebar')) {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(menuToggle);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Toggle sidebar
    menuToggle.addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('active');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function() {
      document.querySelector('.sidebar').classList.remove('active');
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    // Close sidebar when clicking a link
    document.querySelectorAll('.list-unstyled a').forEach(link => {
      link.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    });

    // Adaptive table handling for mobile
    function adaptTables() {
      if (window.innerWidth < 768) {
        document.querySelectorAll('.recharge_history_row').forEach(row => {
          row.style.flexDirection = 'column';
          row.style.gap = '10px';
        });
      } else {
        document.querySelectorAll('.recharge_history_row').forEach(row => {
          row.style.flexDirection = 'row';
        });
      }
    }

    window.addEventListener('resize', adaptTables);
    adaptTables(); // Run initially
  }
});


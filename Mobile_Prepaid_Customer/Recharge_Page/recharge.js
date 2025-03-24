   // Profile-DropDown-JS

document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.querySelector(".user-dropdown");
    const userIcon = document.getElementById("userIcon");
    const dropdownContent = document.querySelector(".dropdown-content");
    const signOutBtn = document.getElementById("signOutBtn");

    function updateDropdown() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");
        const accessToken = sessionStorage.getItem("accessToken");

        if (currentCustomer && accessToken) {
            // Show dropdown when user icon is clicked, toggle 'active' class
            userIcon.onclick = function (event) {
                event.stopPropagation();
                userDropdown.classList.toggle("active");
            };

            // Ensure dropdown starts hidden
            userDropdown.classList.remove("active");

            // Sign-out functionality
            signOutBtn.onclick = function (event) {
                event.preventDefault();

                console.log("Before clearing:", {
                    accessToken: sessionStorage.getItem("accessToken"),
                    currentCustomer: sessionStorage.getItem("currentCustomer")
                });

                sessionStorage.removeItem("accessToken"); // Remove specific item
                sessionStorage.removeItem("currentCustomer"); // Remove user data
                localStorage.removeItem("accessToken"); // Ensure it's removed from localStorage

                console.log("After clearing:", {
                    accessToken: sessionStorage.getItem("accessToken"),
                    currentCustomer: sessionStorage.getItem("currentCustomer")
                });

                // Ensure the storage is cleared before redirecting
                setTimeout(() => {
                    window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
                }, 100);
            };
        } else {
            // If not logged in or missing accessToken, redirect to recharge page
            userIcon.onclick = function () {
                window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
            };

            // Ensure dropdown is hidden
            userDropdown.classList.remove("active");
        }
    }

    // Initialize dropdown behavior
    updateDropdown();

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!userDropdown.contains(event.target)) {
            userDropdown.classList.remove("active");
        }
    });

    // Handle case where user manually navigates away after signing out
    window.addEventListener("storage", function () {
        if (!sessionStorage.getItem("currentCustomer") || !sessionStorage.getItem("accessToken")) {
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("currentCustomer");
            localStorage.removeItem("accessToken");
            window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
        }
    });

    // Listen for login event from the recharge form
    window.addEventListener("storage", function () {
        if (sessionStorage.getItem("currentCustomer") && sessionStorage.getItem("accessToken")) {
            updateDropdown(); 
        }
    });
});






// Mobile Validation & OTP Pop-up Integration with JSON-based Quick Recharge Validation


// OTP Functionality with Twilio Integration
document.addEventListener("DOMContentLoaded", function () {
    const LOGIN_URL = "http://localhost:8083/auth/login";
    const PROFILE_URL = "http://localhost:8083/auth/profile";
    const GENERATE_OTP_URL = "http://localhost:8083/api/otp/generate";
    const VERIFY_OTP_URL = "http://localhost:8083/api/otp/verify";
    
    var phonePattern = /^\d{10}$/;
    var mobileError = document.getElementById("mobileError");
    var mobileInput = document.getElementById("mobile");
    var generateOtpButton = document.getElementById("generateOtp");
    var verifyOtpButton = document.querySelector(".validate-btn");
    var otpPopup = document.getElementById("otpPopup");
    var otpOverlay = document.getElementById("otpOverlay");
    var closePopup = document.getElementById("closePopup");
    var otpMessage = document.querySelector(".otp-message strong");
    var otpError = document.getElementById("otpError");
    var timerElement = document.getElementById("timer");
    var resendLink = document.getElementById("resendLink");
    
    // Create notification container
    var notificationContainer = document.createElement("div");
    notificationContainer.classList.add("notification-container");
    document.body.appendChild(notificationContainer);
    
    var customerData = {};
    var otpTimerInterval;
    
    // Function to fetch customer data
    async function fetchCustomerData(phoneNumberValue) {
        try {
            let loginResponse = await fetch(LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile: phoneNumberValue })
            });
            
            let loginData = await loginResponse.json();
            if (!loginResponse.ok) throw new Error("Login failed");
            
            let profileResponse = await fetch(PROFILE_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${loginData.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            
            let profileData = await profileResponse.json();
            customerData[phoneNumberValue] = { profileData, accessToken: loginData.accessToken };
            return true;
        } catch (error) {
            mobileError.innerHTML = "🚫 Unable to fetch customer details. Please try again.";
            console.error("Error fetching customer data:", error);
            return false;
        }
    }
    
    // Validate mobile number input
    mobileInput.addEventListener("input", function () {
        var phoneNumberValue = mobileInput.value.trim().replace(/\s+/g, "");
        validateRechargeForm(phoneNumberValue);
    });
    
    // Generate OTP button click handler
    generateOtpButton.addEventListener("click", async function (event) {
        event.preventDefault();
        var phoneNumberValue = mobileInput.value.trim().replace(/\s+/g, "");
        
        if (!validateRechargeForm(phoneNumberValue)) {
            return; // Stop execution if validation fails
        }
        
        const customerDataFetched = await fetchCustomerData(phoneNumberValue);
        
        if (customerDataFetched) {
            try {
                // Send request to generate and send OTP via Twilio
                const response = await fetch(GENERATE_OTP_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mobile: phoneNumberValue })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification("OTP sent successfully to your mobile number");
                    openOtpPopup(phoneNumberValue);
                } else {
                    mobileError.innerHTML = `🚫 ${data.message}`;
                }
            } catch (error) {
                console.error("Error sending OTP:", error);
                mobileError.innerHTML = "🚫 Unable to send OTP. Please try again.";
            }
        }
    });
    
    // Validate the recharge form
    function validateRechargeForm(phoneNumberValue) {
        var isValid = true;
        mobileError.innerHTML = "";
        
        if (phoneNumberValue === "") {
            mobileError.innerHTML = "📢 Phone Number is required.";
            isValid = false;
        } else if (!/^\d*$/.test(phoneNumberValue)) {
            mobileError.innerHTML = "⚠️ Enter only digits (0-9).";
            isValid = false;
        } else if (phoneNumberValue.length < 10) {
            mobileError.innerHTML = "⚠️ Enter a valid 10-digit phone number.";
            isValid = false;
        }
        
        return isValid;
    }
    
    // Open OTP popup
    function openOtpPopup(phoneNumber) {
        otpPopup.classList.add("active");
        otpOverlay.classList.add("active");
        otpMessage.textContent = `******${phoneNumber.slice(-4)}`;
        otpError.textContent = "";
        
        // Clear OTP inputs
        otpInputs.forEach(input => input.value = "");
        otpInputs[0].focus();
        
        // Start timer
        startOtpTimer(30);
    }
    
    // Close popup handler
    closePopup.addEventListener("click", function () {
        otpPopup.classList.remove("active");
        otpOverlay.classList.remove("active");
        clearInterval(otpTimerInterval);
    });
    
    // OTP input handling
    var otpInputs = document.querySelectorAll(".otp-input");
    
    otpInputs.forEach((input, index) => {
        // Handle input
        input.addEventListener("input", function (event) {
            if (!/^\d$/.test(this.value)) {
                this.value = "";
                return;
            }
            
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        // Handle backspace
        input.addEventListener("keydown", function (event) {
            if (event.key === "Backspace" && index > 0 && this.value === "") {
                otpInputs[index - 1].focus();
            }
        });
        
        // Handle paste
        input.addEventListener("paste", function (event) {
            event.preventDefault();
            let pasteData = event.clipboardData.getData("text").trim();
            
            if (/^\d{6}$/.test(pasteData)) {
                let digits = pasteData.split("");
                otpInputs.forEach((input, i) => {
                    input.value = digits[i] || "";
                });
                otpInputs[otpInputs.length - 1].focus();
            }
        });
    });
    
    // Start OTP timer
    function startOtpTimer(durationInSeconds) {
        var timeLeft = durationInSeconds;
        resendLink.style.display = "none";
        timerElement.style.display = "block";
        
        // Clear existing interval if any
        if (otpTimerInterval) {
            clearInterval(otpTimerInterval);
        }
        
        otpTimerInterval = setInterval(() => {
            timerElement.textContent = `00:${timeLeft.toString().padStart(2, "0")}`;
            
            if (timeLeft <= 0) {
                clearInterval(otpTimerInterval);
                resendLink.style.display = "inline";
                timerElement.style.display = "none";
            } else {
                timeLeft--;
            }
        }, 1000);
    }
    
    // Resend OTP link handler
    resendLink.addEventListener("click", async function () {
        var phoneNumberValue = mobileInput.value.trim();
        
        try {
            const response = await fetch(GENERATE_OTP_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile: phoneNumberValue })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification("OTP sent successfully to your mobile number");
                startOtpTimer(30);
            } else {
                otpError.innerHTML = `🚫 ${data.message}`;
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            otpError.innerHTML = "🚫 Unable to resend OTP. Please try again.";
        }
    });
    
    // Verify OTP button click handler
    verifyOtpButton.addEventListener("click", async function (event) {
        event.preventDefault();
        var phoneNumberValue = mobileInput.value.trim();
        var enteredOtp = Array.from(otpInputs).map(input => input.value).join("");
        
        otpError.innerHTML = "";
        
        if (enteredOtp.length < 6) {
            otpError.innerHTML = "⚠️ Please enter all 6 digits.";
            return;
        }
        
        try {
            // Send request to verify OTP
            const response = await fetch(VERIFY_OTP_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mobile: phoneNumberValue,
                    otp: enteredOtp
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (customerData[phoneNumberValue]) {
                    sessionStorage.setItem("currentCustomer", JSON.stringify(customerData[phoneNumberValue].profileData));
                    sessionStorage.setItem("accessToken", customerData[phoneNumberValue].accessToken);
                }
                
                window.location.href = "/Mobile_Prepaid_Customer/Prepaid_plans_Page/Popular_plans/prepaid.html";
            } else {
                otpError.innerHTML = "🚫 The OTP entered is incorrect. Please try again.";
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            otpError.innerHTML = "🚫 Unable to verify OTP. Please try again.";
        }
    });
    
    // Show notification
    function showNotification(message) {
        var notification = document.createElement("div");
        notification.classList.add("notification");
        notification.innerHTML = `
            <div class="icon">✔</div>
            <div class="notification-text">${message}</div>
            <button class="close-btn">&times;</button>
        `;
        
        notification.querySelector(".close-btn").addEventListener("click", function () {
            notification.remove();
        });
        
        notificationContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 10000);
    }
});
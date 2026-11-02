// ==================================================
// TRAVELEASE - COMPLETE COMMON JAVASCRIPT
// ==================================================

document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // 1. COMMON FUNCTIONS
    // ==================================================

    function getElement(id) {
        return document.getElementById(id);
    }

    function getValue(id) {
        const element = getElement(id);
        return element ? element.value.trim() : "";
    }

    function saveData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function readData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            return null;
        }
    }

    function setText(id, value) {
        const element = getElement(id);

        if (element) {
            element.textContent = value;
        }
    }

    function formatCurrency(amount) {
        return "₹" + Number(amount || 0).toLocaleString("en-IN");
    }


    // ==================================================
    // 2. TRANSPORT SELECTION
    // ==================================================

    let currentMode = localStorage.getItem("transportMode") || "Bus";

    const transportButtons = document.querySelectorAll(".transport-btn");

    function updateTransportButtons(mode) {

        transportButtons.forEach(function (button) {

            button.classList.remove("active");

            if (button.dataset.mode === mode) {
                button.classList.add("active");
            }

        });

    }

    window.selectTransport = function (mode, button) {

        currentMode = mode;

        localStorage.setItem("transportMode", mode);

        updateTransportButtons(mode);

    };

    updateTransportButtons(currentMode);


    // ==================================================
    // 3. SEARCH JOURNEY
    // ==================================================

    const searchForm = getElement("searchForm");

    if (searchForm) {

        searchForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const source = getValue("from");
            const destination = getValue("to");
            const journeyDate = getValue("journeyDate");

            if (source === "" || destination === "" || journeyDate === "") {

                alert("Please fill all journey details.");
                return;

            }

            if (source.toLowerCase() === destination.toLowerCase()) {

                alert("Source and destination cannot be the same.");
                return;

            }

            const selectedMode =
                localStorage.getItem("transportMode") || "Bus";

            const travelSearch = {

                source: source,
                destination: destination,
                journeyDate: journeyDate,
                transportMode: selectedMode

            };

            saveData("travelSearch", travelSearch);

            localStorage.setItem("source", source);
            localStorage.setItem("destination", destination);
            localStorage.setItem("journeyDate", journeyDate);

            localStorage.setItem("resultSource", source);
            localStorage.setItem("resultDestination", destination);
            localStorage.setItem("resultDate", journeyDate);

            localStorage.setItem("transportMode", selectedMode);

            window.location.href = "results.html";

        });

    }


    


    

    // ==================================================
    // 6. RESULTS PAGE
    // Results are handled by results.html inline JavaScript.
    // Do not create another transportList results system here.
    // ==================================================


    // ==================================================
    // 7. DETAILS PAGE
    // ==================================================

    const selectedTransport = readData("selectedTransport");

    if (selectedTransport) {

        setText("transportName", selectedTransport.name || "");
        setText("transportType", selectedTransport.type || "");
        setText("fare", formatCurrency(selectedTransport.fare));
        setText("departureTime", selectedTransport.time || "");
        setText("arrivalTime", selectedTransport.arrival || "");
        setText("duration", selectedTransport.duration || "");

    }

    setText(
        "detailsTransportName",
        localStorage.getItem("selectedTransportName") || ""
    );

    setText(
        "detailsTransportType",
        localStorage.getItem("selectedTransportType") || ""
    );

    setText(
        "detailsFare",
        formatCurrency(localStorage.getItem("selectedFare"))
    );
// ==================================================
// 8. SEAT SELECTION - COMPLETE CORRECTED VERSION
// ==================================================

const seatLayout = document.getElementById("seatLayout");

let selectedSeats = [];
let totalAmount = 0;

const seatPrice = Number(localStorage.getItem("selectedFare")) || 0;

// Default booked seats
const bookedSeats = ["A1", "A2", "B3", "B4", "C1", "D4", "E2", "F3"];

if (seatLayout) {

    const seats = seatLayout.querySelectorAll(".seat-btn");

    const waitingSection = document.getElementById("waitingSection");

    // Apply default booked seats
    seats.forEach(function (seat) {

        const seatNumber = seat.dataset.seat;

        if (bookedSeats.includes(seatNumber)) {

            seat.classList.add("booked");
            seat.disabled = true;

        }

    });

    // Check available seats
    const availableSeats = Array.from(seats).filter(function (seat) {
        return !seat.classList.contains("booked");
    });

    if (availableSeats.length === 0 && waitingSection) {
        waitingSection.style.display = "block";
    }

    // Seat click functionality
    seats.forEach(function (seat) {

        seat.addEventListener("click", function () {

            const seatNumber = seat.dataset.seat;

            // Prevent booked seat selection
            if (seat.classList.contains("booked")) {
                return;
            }

            // Deselect seat
            if (seat.classList.contains("selected")) {

                seat.classList.remove("selected");

                selectedSeats = selectedSeats.filter(function (item) {
                    return item !== seatNumber;
                });

            }

            // Select seat
            else {

                if (selectedSeats.length >= 6) {

                    alert("Maximum 6 seats can be selected!");
                    return;

                }

                seat.classList.add("selected");

                selectedSeats.push(seatNumber);

            }

            // Calculate total
            totalAmount = selectedSeats.length * seatPrice;

            // Display selected seats
            document.getElementById("selectedSeats").textContent =
                selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "None";

            // Display total amount
            document.getElementById("seatTotal").textContent =
                totalAmount.toLocaleString("en-IN");

            // Save selected seats
            localStorage.setItem(
                "selectedSeatNumbers",
                JSON.stringify(selectedSeats)
            );

            localStorage.setItem("totalAmount", totalAmount);

        });

    });

    // Waiting list functionality
    const joinWaiting = document.getElementById("joinWaiting");

    if (joinWaiting) {

        joinWaiting.addEventListener("click", function () {

            localStorage.setItem("waitingListJoined", "true");

            document.getElementById("waitingMessage").textContent =
                "You have successfully joined the waiting list!";

        });

    }

}

    // ==================================================
    // 9. CONTINUE TO PASSENGER PAGE
    // ==================================================

    const continueBooking = getElement("continueBooking");

    if (continueBooking) {

        continueBooking.addEventListener("click", function () {

            const savedSeats = readData("selectedSeatNumbers") || [];

            if (savedSeats.length === 0) {

                alert("Please select at least one seat.");
                return;

            }

            window.location.href = "passenger.html";

        });

    }


    // ==================================================
    // 10. PASSENGER DETAILS
    // ==================================================

    const passengerForm = getElement("passengerForm");

    if (passengerForm) {

        passengerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const formData = new FormData(passengerForm);

            const passengerDetails = {};

            formData.forEach(function (value, key) {

                passengerDetails[key] = value;

            });

            const inputs = passengerForm.querySelectorAll(
                "input[required], select[required], textarea[required]"
            );

            for (let input of inputs) {

                if (!input.value.trim()) {

                    alert("Please fill all passenger details.");
                    input.focus();
                    return;

                }

            }

            saveData("passengerDetails", passengerDetails);

            window.location.href = "payment.html";

        });

    }


    // ==================================================
    // 11. PAYMENT PAGE
    // ==================================================

    const paymentForm = getElement("paymentForm");

    if (paymentForm) {

        const amount = Number(
            localStorage.getItem("totalAmount") ||
            localStorage.getItem("selectedFare") ||
            0
        );

        setText("paymentAmount", formatCurrency(amount));
        setText("totalPayment", formatCurrency(amount));

        paymentForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const requiredFields = paymentForm.querySelectorAll(
                "input[required], select[required]"
            );

            for (let field of requiredFields) {

                if (!field.value.trim()) {

                    alert("Please complete the payment details.");
                    field.focus();
                    return;

                }

            }

            const paymentData = {};

            new FormData(paymentForm).forEach(function (value, key) {

                paymentData[key] = value;

            });

            saveData("paymentDetails", paymentData);

            const bookingId =
                "TRV" + Date.now().toString().slice(-8);

            localStorage.setItem("bookingId", bookingId);

            const booking = {

                bookingId: bookingId,

                source: localStorage.getItem("source") || "",
                destination: localStorage.getItem("destination") || "",
                journeyDate: localStorage.getItem("journeyDate") || "",

                transportName:
                    localStorage.getItem("selectedTransportName") || "",

                transportType:
                    localStorage.getItem("selectedTransportType") || "",

                seats: readData("selectedSeatNumbers") || [],

                fare: amount,

                passenger: readData("passengerDetails") || {},

                bookingDate: new Date().toLocaleDateString(),

                status: "Confirmed"

            };

            let bookings = readData("travelBookings") || [];

            bookings.push(booking);

            saveData("travelBookings", bookings);

            window.location.href = "confirmation.html";

        });

    }


    // ==================================================
    // 12. CONFIRMATION PAGE
    // ==================================================

    const bookingId = localStorage.getItem("bookingId");

    if (bookingId) {

        setText("bookingId", bookingId);
        setText("confirmationBookingId", bookingId);

    }

    setText(
        "confirmationSource",
        localStorage.getItem("source") || ""
    );

    setText(
        "confirmationDestination",
        localStorage.getItem("destination") || ""
    );

    setText(
        "confirmationDate",
        localStorage.getItem("journeyDate") || ""
    );

    setText(
        "confirmationTransport",
        localStorage.getItem("selectedTransportName") || ""
    );

    setText(
        "confirmationSeats",
        (readData("selectedSeatNumbers") || []).join(", ")
    );

    setText(
        "confirmationAmount",
        formatCurrency(localStorage.getItem("totalAmount"))
    );


    // ==================================================
    // 13. MY BOOKINGS PAGE
    // ==================================================

    const bookingTable = getElement("bookingTable");

    if (bookingTable) {

        const bookings = readData("travelBookings") || [];

        if (bookings.length === 0) {

            bookingTable.innerHTML = `
                <tr>
                    <td colspan="8">No bookings found.</td>
                </tr>
            `;

        } else {

            bookingTable.innerHTML = "";

            bookings.forEach(function (booking) {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${booking.bookingId || ""}</td>
                    <td>${booking.source || ""}</td>
                    <td>${booking.destination || ""}</td>
                    <td>${booking.journeyDate || ""}</td>
                    <td>${booking.transportName || ""}</td>
                    <td>${(booking.seats || []).join(", ")}</td>
                    <td>${formatCurrency(booking.fare)}</td>
                    <td>${booking.status || "Confirmed"}</td>
                `;

                bookingTable.appendChild(row);

            });

        }

    }


    // ==================================================
    // 14. PROFILE PAGE
    // ==================================================

    const profileForm = getElement("profileForm");

    const loggedInUser = readData("loggedInUser");

    if (profileForm && loggedInUser) {

        const nameInput = getElement("profileName");
        const emailInput = getElement("profileEmail");
        const phoneInput = getElement("profilePhone");

        if (nameInput) {
            nameInput.value = loggedInUser.fullName || "";
        }

        if (emailInput) {
            emailInput.value = loggedInUser.email || "";
        }

        if (phoneInput) {
            phoneInput.value = loggedInUser.phone || "";
        }

        profileForm.addEventListener("submit", function (event) {

            event.preventDefault();

            loggedInUser.fullName =
                getValue("profileName");

            loggedInUser.email =
                getValue("profileEmail");

            loggedInUser.phone =
                getValue("profilePhone");

            saveData("loggedInUser", loggedInUser);

            alert("Profile updated successfully!");

        });

    }


    // ==================================================
    // 15. LOGOUT
    // ==================================================

    const logoutButton = getElement("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            localStorage.removeItem("loggedInUser");

            localStorage.removeItem("guestMode");

            alert("Logged out successfully!");

            window.location.href = "login.html";

        });

    }


    // ==================================================
    // 16. WELCOME SCREEN
    // ==================================================

    const welcomeScreen = getElement("welcomeScreen");
    const accountOptions = getElement("accountOptions");

    window.showAccountOptions = function () {

        if (accountOptions) {
            accountOptions.style.display = "block";
        }

    };

    window.continueAsGuest = function () {

        localStorage.setItem("guestMode", "true");

        if (welcomeScreen) {
            welcomeScreen.style.display = "none";
        }

    };

    if (welcomeScreen) {

        const user = readData("loggedInUser");
        const guestMode = localStorage.getItem("guestMode");

        if (user || guestMode === "true") {

            welcomeScreen.style.display = "none";

        }

    }


    // ==================================================
    // 17. RECOMMENDATIONS
    // ==================================================

    window.getRecommendation = function (preference) {

        const result = getElement("recommendationResult");

        if (!result) {
            return;
        }

        if (preference === "Budget") {

            result.innerHTML = `
                <h3>Budget Friendly Recommendation</h3>
                <p><strong>Express Train</strong></p>
                <p>Estimated Fare: ₹350</p>
                <p>Affordable travel option.</p>
            `;

        } else if (preference === "Fastest") {

            result.innerHTML = `
                <h3>Fastest Journey Recommendation</h3>
                <p><strong>Flight</strong></p>
                <p>Estimated Fare: ₹2,500</p>
                <p>Best option for saving travel time.</p>
            `;

        } else if (preference === "Comfort") {

            result.innerHTML = `
                <h3>Comfortable Travel Recommendation</h3>
                <p><strong>AC Bus / AC Train</strong></p>
                <p>Estimated Fare: ₹900</p>
                <p>Comfortable journey option.</p>
            `;

        }

    };


    // Support recommendation buttons using data-preference too

    const recommendationButtons =
        document.querySelectorAll(".recommend-btn");

    recommendationButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const preference = button.dataset.preference;

            window.getRecommendation(preference);

        });

    });


    // ==================================================
    // 18. ACCOUNT OPTIONS
    // ==================================================

    window.goToRegister = function () {

        window.location.href = "register.html";

    };

});